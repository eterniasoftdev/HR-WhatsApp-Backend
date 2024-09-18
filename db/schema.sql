CREATE TABLE employee_unit (
    id SERIAL PRIMARY KEY,
    unit_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_functions (
    id SERIAL PRIMARY KEY,
    function_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for employee types
CREATE TABLE employee_type (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_on DATE DEFAULT CURRENT_DATE 
);

-- Table for employees
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    employee_unit_id INT REFERENCES employee_unit(id),
    employee_function_id INT REFERENCES employee_functions(id),
    employee_type_id INT REFERENCES employee_type(id),
    poornata_id VARCHAR(50),
    welcome_message_sent BOOLEAN DEFAULT FALSE;
);

-- Table for fact types
CREATE TABLE fact_type (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL UNIQUE, 
    is_active BOOLEAN DEFAULT TRUE,
    created_on DATE DEFAULT CURRENT_DATE 
);
-- Table for facts
CREATE TABLE facts (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    fact_type_id INT REFERENCES fact_type(id),
    week INT NOT NULL,
    position INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_dynamic BOOLEAN DEFAULT FALSE,    -- New field
    dynamic_data TEXT,                   -- New field
    as_on TEXT,                          -- New field
    day INT ,
    created_on DATE DEFAULT CURRENT_DATE                            -- New field
);

-- Table for scheduler
CREATE TABLE scheduler (
    id SERIAL PRIMARY KEY,
    frequency VARCHAR(20) CHECK (frequency IN ('half hour', '1 hour', '1 day', 'weekly', 'monthly')),
    start_time TIMESTAMP NOT NULL,
    last_executed_time TIMESTAMP,
    next_execution_time TIMESTAMP,
    last_execution_status BOOLEAN,
    is_active BOOLEAN DEFAULT TRUE,
    fact_type_id INT REFERENCES fact_type(id),
    employee_type_id INT REFERENCES employee_type(id),
    created_on DATE DEFAULT CURRENT_DATE,
    total_executions INT DEFAULT 0,
    function TEXT
);
