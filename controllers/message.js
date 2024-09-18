const axios = require("axios");
const { createTenDigitMobile } = require("../lib/global");
exports.sendMessageToWhatsapp = async (data) => {
  try {
    let { mobile, text, url, filename, campaignName, userName } = data;
    // text = text.join(". ");
    mobile = createTenDigitMobile(mobile);
    if (!campaignName)
      return res.status(402).send({ message: "Template is required" });
    let reqBody = {
      apiKey: process.env.API_KEY,
      destination: mobile,
      userName: userName || "unknown",
      campaignName: campaignName,
      templateParams: text,
      media: { url: url || "xyz.pdf", filename: filename || "Eternia" },
    };
    const response = await axios.post(
      // `https://apis.aisensy.com/project-apis/v1/project/${process.env.AISENSY_PROJECT_API_ID}/messages`,
      "https://backend.aisensy.com/campaign/t1/api/v2",
      reqBody,
      {
        headers: {
          "X-AiSensy-Project-API-Pwd": process.env.AISENSY_PROJECT_API_PASSWORD,
        },
      }
    );
    if (response.status == 200) {
      return { status: 200, message: "message sent" };
    } else return { status: 400, message: "message not sent" };
  } catch (err) {
    // console.log(err);
    return { status: 400, message: "message not sent" };
  }
};
