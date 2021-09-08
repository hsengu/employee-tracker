const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '7364',
        database: 'employee_tracker'
    },
    console.log('Connected to the employee_tracker database.')
);

const getDepartments = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM department
            ORDER BY id;`
        db.query(sql, (err, row) => {
            if(err) {
                console.log(`\nSQL Error: ${err.message}\n`);
            }
            resolve(row);
        });
    });
};

const getRoles = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT r.id, r.title, r.salary, d.name AS department
             FROM role r
             JOIN department d ON r.department_id = d.id
             ORDER BY r.id;`
        db.query(sql, (err, row) => {
            if(err) {
                console.log(`\nSQL Error: ${err}\n`);
            }
            resolve(row);
        });
    });
};

const getEmployees = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name, r.title AS title, d.name AS department, r.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            JOIN role r ON r.id = e.role_id
            JOIN department d ON d.id = r.department_id
            LEFT JOIN employee m ON e.manager_id = m.id
            ORDER BY id`

        db.query(sql, (err, row) => {
            if(err) {
                console.log(`\nSQL Error: ${err.message}\n`);
            }
            resolve(row);
        });
    });
};

const getEmployeesByDept = department => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name, r.title AS title, d.name AS department, r.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            JOIN role r ON r.id = e.role_id
            JOIN department d ON d.id = r.department_id
            LEFT JOIN employee m ON e.manager_id = m.id
            WHERE d.name = ?
            ORDER BY id;`
        db.query(sql, department, (err, row) => {
            if(err) {
                console.log(`\nSQL Error: ${err.message}\n`);
            }
            resolve(row);
        });
    });
};

const getManagers = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT DISTINCT CONCAT(m.first_name, ' ', m.last_name) AS name FROM employee e
            JOIN employee m ON e.manager_id = m.id;`
        db.query(sql, (err, row) => {
            if(err) {
                console.log(`\nSQL Error: ${err.message}\n`);
                return;
            }
            resolve(row);
        });
    });
};

const getEmployeesByManager = manager => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name, r.title AS title, d.name AS department, r.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            JOIN role r ON r.id = e.role_id
            JOIN department d ON d.id = r.department_id
            LEFT JOIN employee m ON e.manager_id = m.id
            WHERE CONCAT(m.first_name, ' ', m.last_name) = ?
            ORDER BY e.id;`
        db.query(sql, manager, (err, row) => {
            if(err) {
                console.log(`\nSQL Error: ${err.message}\n`);
            }
            resolve(row);
        });
    });
};

const addDepartment = deptName => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO department (name)
            VALUES (?);`
        db.query(sql, deptName, (err, res) => {
            if(err) {
                console.log(`\nSQL Error: ${err}\n`);
            }
            resolve(res);
        });
    });
};

const addRole = (roleName, roleSalary, roleDepartment) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO role (title, salary, department_id)
            VALUES (?,?, (SELECT id FROM department WHERE name = ?));`
        db.query(sql, [roleName, roleSalary, roleDepartment], (err, res) => {
            if(err) {
                console.log(`\nSQL error: ${err}`);
            }
            resolve(res);
        })
    })
};

const addEmployee = (employeeName, employeeRole, employeeManager) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?,?,(SELECT id FROM role WHERE title = ?), (SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?));`
        db.query(sql, [roleName, roleSalary, roleDepartment], (err, res) => {
            if(err) {
                console.log(`\nSQL error: ${err}`);
            }
            resolve(res);
        })
    })
};

module.exports = {
    getDepartments: getDepartments,
    getRoles: getRoles,
    getEmployees: getEmployees,
    getEmployeesByDept: getEmployeesByDept,
    getManagers : getManagers,
    getEmployeesByManager: getEmployeesByManager,
    addDepartment: addDepartment,
    addRole: addRole
};