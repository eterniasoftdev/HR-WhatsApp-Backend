const db = require("../db/db");
const moment = require("moment");
const { userCampaignList } = require("./templates");
const { sendMessageToWhatsapp } = require("../controllers/message");
class SchedulerService {
  constructor() {
    console.log("Scheduler service triggered...");
    if (SchedulerService.instance) {
      return SchedulerService.instance;
    }

    this.schedulers = [];
    SchedulerService.instance = this;
    this.initSchedulers();
    this.setupDailyCleanup();
  }

  async initSchedulers() {
    const result = await db.query(
      "SELECT * FROM scheduler WHERE is_active = TRUE"
    );
    result.rows.forEach((scheduler) => {
      this.scheduleTask(scheduler);
    });
  }

  scheduleTask(scheduler) {
    const { id, next_execution_time, function: functionName } = scheduler;
    const now = new Date();
    const timeToNextExecution = new Date(next_execution_time) - now;

    // Only schedule tasks that need to run today
    if (timeToNextExecution > 0 && timeToNextExecution <= 24 * 60 * 60 * 1000) {
      const timeoutId = setTimeout(() => {
        this.executeFunction(functionName, id);
      }, timeToNextExecution);

      this.schedulers.push({ id, timeoutId });
    } else if (timeToNextExecution < 0) {
      this.scheduleNextExecution(id, false);
    }
  }

  async executeFunction(functionName, schedulerId) {
    console.log(
      `Executing function: ${functionName} for scheduler ID: ${schedulerId}`
    );

    if (this[functionName] && typeof this[functionName] === "function") {
      await this[functionName]();
      this.updateSchedulerExecution(schedulerId);
    } else {
      console.error(`No method found for function: ${functionName}`);
    }
  }

  async updateSchedulerExecution(schedulerId) {
    const now = new Date();
    await db.query(
      `UPDATE scheduler SET 
                last_executed_time = $1, 
                last_execution_status = $2,
                total_executions = total_executions + 1
             WHERE id = $3`,
      [now, true, schedulerId]
    );

    this.scheduleNextExecution(schedulerId);
  }

  async scheduleNextExecution(schedulerId, executed = true) {
    try {
      const result = await db.query("SELECT * FROM scheduler WHERE id = $1", [
        schedulerId,
      ]);
      const scheduler = result.rows[0];

      if (!scheduler) return;

      const { frequency, next_execution_time } = scheduler;
      let nextTime;
      if (executed == true) {
        nextTime = new Date(next_execution_time);
      } else {
        nextTime = new Date();
        console.log("Next Execution set from now....");
      }

      switch (frequency) {
        case "half hour":
          nextTime.setMinutes(nextTime.getMinutes() + 30);
          break;
        case "1 hour":
          nextTime.setHours(nextTime.getHours() + 1);
          break;
        case "1 day":
          nextTime.setDate(nextTime.getDate() + 1);
          break;
        case "weekly":
          nextTime.setDate(nextTime.getDate() + 7);
          break;
        case "monthly":
          nextTime.setMonth(nextTime.getMonth() + 1);
          break;
        default:
          console.error("Invalid frequency");
          return;
      }

      await db.query(
        `UPDATE scheduler SET next_execution_time = $1 WHERE id = $2`,
        [nextTime, schedulerId]
      );

      console.log(`Next execution time updated to: ${nextTime}`);

      // Schedule new task for the next execution
      this.scheduleTask({ ...scheduler, next_execution_time: nextTime });
    } catch (err) {
      console.error("Error scheduling next execution:", err);
    }
  }

  setupDailyCleanup() {
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();

    setTimeout(() => {
      this.cleanupAndReschedule();
      setInterval(() => {
        this.cleanupAndReschedule();
      }, 24 * 60 * 60 * 1000); // Run daily
    }, msUntilMidnight);
  }

  async cleanupAndReschedule() {
    console.log("Cleaning up and rescheduling tasks...");
    // Clear existing timeouts
    this.schedulers.forEach(({ timeoutId }) => clearTimeout(timeoutId));
    this.schedulers = [];

    // Reinitialize schedulers
    await this.initSchedulers();
  }

  async sendFactsEveryDay() {
    const employeeResult = await db.query(
      `SELECT *
           FROM employee 
           WHERE is_active = TRUE`
    );
    const employees = employeeResult.rows;

    if (employees.length === 0) {
      console.log("No Employees");
      return;
    }

    // Loop through each fact and send it as a separate message
    for (let employee of employees) {
      const is_welcome_message = false;
      await this.sendFactMessagesToEmployee(employee.id, is_welcome_message);
    }
  }

  async sendWelcomeMessage() {
    const employeeResult = await db.query(
      `SELECT * 
        FROM employee 
        WHERE created_on::date = CURRENT_DATE AND is_active = TRUE AND welcome_message_sent = FALSE`
    );
    const employees = employeeResult.rows;

    if (employees.length === 0) {
      console.log("No Employees");
      return;
    }
    for (let employee of employees) {
      const is_welcome_message = true;
      this.sendFactMessagesToEmployee(employee.id, is_welcome_message);
    }
  }

  //////////////////////////////////////////////////////////////////////////////////
  async sendFactMessagesToEmployee(employeeId, is_welcome_message) {
    console.log(
      "Employee id: ",
      employeeId + " for welcome: ",
      is_welcome_message
    );
    try {
      // Fetch employee details
      const employeeResult = await db.query(
        "SELECT id, name, mobile, created_on FROM employee WHERE id = $1",
        [employeeId]
      );
      const employee = employeeResult.rows[0];
      const { name, mobile, created_on } = employee;

      // Calculate the number of workdays and weeks (excluding weekends)
      const createdOnDate = moment(
        created_on.setDate(created_on.getDate() + 1)
      );
      const now = moment();
      const { weeks, days } = this.calculateWorkDaysAndWeeks(
        createdOnDate,
        now
      );

      // Fetch relevant facts for the employee's current week and day
      const factsQuery = `
      SELECT message, is_dynamic, dynamic_data, as_on, day
      FROM facts
      WHERE week = $1 AND is_active = TRUE AND day=$2
      ${!is_welcome_message ? "AND day>0" : " "}
      ORDER BY week, day, position
    `;
      const factsResult = await db.query(factsQuery, [weeks, days]);
      const facts = factsResult.rows;
      console.log("Facts length", facts.length, "days:", days, "weeks:", weeks);
      if (facts.length === 0) {
        console.log("No facts to send for this employee");
        return;
      }

      // Loop through each fact and send it as a separate message
      for (let fact of facts) {
        let message = fact.message;

        // If dynamic, append dynamic data
        if (fact.is_dynamic && fact.dynamic_data) {
          message += ` ${fact.dynamic_data} as on FY ${fact.as_on}`;
        }

        // Count the number of \n in the message
        const newlineCount = (message.match(/\n/g) || []).length;

        // Handle message based on \n count

        message = message.split("\n").slice(0, 3);

        // Choose the appropriate campaign based on the number of \n
        const campaign = this.selectCampaign(
          newlineCount > 2 ? 2 : newlineCount
        );

        // Send the message via WhatsApp
        const result = await sendMessageToWhatsapp({
          mobile,
          text: message,
          campaignName: campaign.name,
          userName: name,
        });

        console.log(`Message sent to ${name}: ${result.message}`);
        if (is_welcome_message) {
          await db.query(
            `UPDATE employee SET 
                   welcome_message_sent=TRUE
                   WHERE id = $1`,
            [employeeId]
          );
        }
      }
    } catch (err) {
      console.error("Error sending fact messages:", err);
    }
  }

  calculateWorkDaysAndWeeks(startDate, currentDate) {
    // Get the total number of days excluding weekends (Saturday and Sunday)
    let totalDays = 0;
    let tempDate = startDate.clone();

    while (tempDate.isBefore(currentDate)) {
      const dayOfWeek = tempDate.day();
      if (dayOfWeek !== 6 && dayOfWeek !== 0) {
        // Skip Saturday (6) and Sunday (0)
        totalDays++;
      }
      tempDate.add(1, "days");
    }

    const weeks = Math.floor(totalDays / 5) + 1; // 5 workdays per week
    const days = totalDays % 5; // Remaining workdays in the current week

    return { weeks, days };
  }

  selectCampaign(newlineCount) {
    return userCampaignList.find(
      (campaign) => campaign.number === newlineCount
    );
  }
}

module.exports = new SchedulerService();
