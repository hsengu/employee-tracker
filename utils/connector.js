const mysql = require('mysql2');

// Create a connection to the SQL DB
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '7364',
        database: 'employee_tracker'
    },
    console.log('Connected to the employee_tracker database.')
);

// SQL Query function - Get all departments
const getDepartments = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM department
            ORDER BY id;`
        db.query(sql, (err, res, fields) => {
            if(err) {
                console.log(`\nSQL Error: ${err.message}\n`);
                return;
            }
            resolve(res);
        });
    });
};

// SQL Query function - Get all Roles
const getRoles = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT r.id, r.title, r.salary, d.name AS department
             FROM role r
             JOIN department d ON r.department_id = d.id
             ORDER BY r.id;`
        db.query(sql, (err, res, fields) => {
            if(err) {
                console.log(`\nSQL Error: ${err}\n`);
                return;
            }
            resolve(res);
        });
    });
};

// SQL Query function - Get all Employees
const getEmployees = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT e.id,
            CONCAT(e.first_name, ' ', e.last_name) AS name,
            r.title AS title,
            d.name AS department,
            r.salary AS salary,
            CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            JOIN role r ON r.id = e.role_id
            JOIN department d ON d.id = r.department_id
            LEFT JOIN employee m ON e.manager_id = m.id
            ORDER BY id`

        db.query(sql, (err, res, fields) => {
            if(err) {
                console.log(`\nSQL Error: ${err.message}\n`);
                return;
            }
            resolve(res);
        });
    });
};

// SQL Query Function - Get all Employees by Department
const getEmployeesByDept = department => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT e.id, 
            CONCAT(e.first_name, ' ', e.last_name) AS name, 
            r.title AS title, d.name AS department, 
            r.salary AS salary, 
            CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            JOIN role r ON r.id = e.role_id
            JOIN department d ON d.id = r.department_id
            LEFT JOIN employee m ON e.manager_id = m.id
            WHERE d.name = ?
            ORDER BY id;`
        db.query(sql, department, (err, res, fields) => {
            if(err) {
                console.log(`\nSQL Error: ${err.message}\n`);
                return;
            }
            resolve(res);
        });
    });
};

// SQL Query Function - Get all Managers
const getManagers = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT DISTINCT CONCAT(m.first_name, ' ',
            m.last_name) AS name FROM employee e
            JOIN employee m ON e.manager_id = m.id;`
        db.query(sql, (err, res, fields) => {
            if(err) {
                console.log(`\nSQL Error: ${err.message}\n`);
                return;
            }
            resolve(res);
        });
    });
};

// SQL Query Function - Get all Employees by Manager
const getEmployeesByManager = manager => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT e.id,
            CONCAT(e.first_name, ' ', e.last_name) AS name,
            r.title AS title,
            d.name AS department,
            r.salary AS salary,
            CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            JOIN role r ON r.id = e.role_id
            JOIN department d ON d.id = r.department_id
            LEFT JOIN employee m ON e.manager_id = m.id
            WHERE CONCAT(m.first_name, ' ', m.last_name) = ?
            ORDER BY e.id;`
        db.query(sql, manager, (err, res, fields) => {
            if(err) {
                console.log(`\nSQL Error: ${err.message}\n`);
                return;
            }
            resolve(res);
        });
    });
};

// SQL Query Function - Add a new Department
const addDepartment = deptName => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO department (name)
            VALUES (?);`
        db.query(sql, deptName, (err, res, fields) => {
            if(err) {
                console.log(`\nSQL Error: ${err}\n`);
                return;
            }
            console.log(`\nSQL Result: Affected Rows - ${res.affectedRows}, Status Code - ${res.warningStatus}`);
            resolve(res);
        });
    });
};

// SQL Query Function - Add a new Role
const addRole = (roleName, roleSalary, roleDepartment) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO role (title, salary, department_id)
            VALUES (?,?, (SELECT id FROM department WHERE name = ?));`
        db.query(sql, [roleName, roleSalary, roleDepartment], (err, res, fields) => {
            if(err) {
                console.log(`\nSQL error: ${err}`);
                return;
            }
            console.log(`\nSQL Result: Affected Rows - ${res.affectedRows}, Status Code - ${res.warningStatus}`);
            resolve(res);
        })
    })
};

// SQL Query Function - Add a new Employee
const addEmployee = (employeeFirstName, employeeLastName, employeeRole, employeeManager) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            SELECT ?,?,(SELECT id FROM role WHERE title = ?), (SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?);`
        db.query(sql, [employeeFirstName, employeeLastName, employeeRole, employeeManager], (err, res, fields) => {
            if(err) {
                console.log(`\nSQL error: ${err}`);
                return;
            }
            console.log(`\nSQL Result: Affected Rows - ${res.affectedRows}, Status Code - ${res.warningStatus}`);
            resolve(res);
        })
    })
};

// SQL Query Function - Uodate an Employee's Role
const updateEmployeeRole = (employeeName, employeeRole) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE employee
            SET role_id = (SELECT id FROM role WHERE title = ?)
            WHERE CONCAT(first_name, ' ', last_name) = ?`;
        db.query(sql, [employeeRole, employeeName], (err, res, fields) => {
            if(err) {
                console.log(`\nSQL error: ${err}`);
                return;
            }
            console.log(`\nSQL Result: Affected Rows - ${res.affectedRows}, Status Code - ${res.warningStatus}`);
            resolve(res);
        });
    });
};

// SQL Query Function - Update and Employee's Manager
const updateEmployeeManager = (employeeName, employeeManager) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE employee AS e,
            (SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?) AS e2
            SET e.manager_id = e2.id
            WHERE CONCAT(e.first_name, ' ', e.last_name) = ?`;
        db.query(sql, [employeeManager, employeeName], (err, res, fields) => {
            if(err) {
                console.log(`\nSQL error: ${err}`);
                return;
            }
            console.log(`\nSQL Result: Affected Rows - ${res.affectedRows}, Status Code - ${res.warningStatus}`);
            resolve(res);
        });
    });
};

// SQL Query Function - Remove an Employee
const removeEmployee = (employeeName) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?`;
        db.query(sql, [employeeName], (err, res, fields) => {
            if(err) {
                console.log(`\nSQL error: ${err}`);
                return;
            }
            console.log(`\nSQL Result: Affected Rows - ${res.affectedRows}, Status Code - ${res.warningStatus}`);
            resolve(res);
        });
    });
};

// SQL Query Function - Remove a Role
const removeRole = (roleName) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM role WHERE title = ?`;
        db.query(sql, roleName, (err, res, fields) => {
            if(err) {
                console.log(`\nSQL error: ${err}`);
                return;
            }
            console.log(`\nSQL Result: Affected Rows - ${res.affectedRows}, Status Code - ${res.warningStatus}`);
            resolve(res);
        });
    });
};

// SQL Query Function - Remove a Department
const removeDepartment = (departmentName) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM department WHERE name = ?`;
        db.query(sql, departmentName, (err, res, fields) => {
            if(err) {
                console.log(`\nSQL error: ${err}`);
                return;
            }
            console.log(`\nSQL Result: Affected Rows - ${res.affectedRows}, Status Code - ${res.warningStatus}`);
            resolve(res);
        });
    });
};

// SQL Query Function - Get Budget by Department
const getBudget = (departmentName) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT d.id AS id, d.name AS department, (SELECT SUM(salary)) as budget
            FROM department d
            JOIN role r ON d.id = r.department_id
            JOIN employee e ON e.role_id = r.id
            WHERE d.name = ?;`;
        db.query(sql, departmentName, (err, res, fields) => {
            if(err) {
                console.log(`\nSQL error: ${err}`);
                return;
            }
            resolve(res);
        });
    });
};

// Export all the above functions
module.exports = {
    getDepartments: getDepartments,
    getRoles: getRoles,
    getEmployees: getEmployees,
    getEmployeesByDept: getEmployeesByDept,
    getManagers : getManagers,
    getEmployeesByManager: getEmployeesByManager,
    addDepartment: addDepartment,
    addRole: addRole,
    addEmployee: addEmployee,
    updateEmployeeRole: updateEmployeeRole,
    updateEmployeeManager: updateEmployeeManager,
    removeDepartment: removeDepartment,
    removeRole: removeRole,
    removeEmployee: removeEmployee,
    getBudget: getBudget
};