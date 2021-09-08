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

const getEmployees = () => {
    return new Promise((resolve, reject) => {
        
        const sql = `SELECT e.id, CONCAT(e.first_name,' ' , e.last_name) AS name, r.title AS title, d.name AS department, r.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            JOIN role r ON r.id = e.role_id
            JOIN department d ON d.id = r.department_id
            LEFT JOIN employee m ON e.manager_id = m.id
            ORDER BY id;`

        db.query(sql, (err, row) => {
        if(err) {
            console.log(`SQL Error: ${err.message}`);
            return;
        }
        resolve(row);
        });
    });
};

module.exports = {
    getEmployees: getEmployees
};