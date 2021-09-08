const db = require('./connector.js');

const validateDept = deptName => {
    return db.getDepartments().then(table => {
        let found = table.findIndex(element => element.name === deptName);
        return found;
    });
}

const validateSalary = salary => {
    return !isNaN(salary);
}

module.exports = {
    validateDept: validateDept,
    validateSalary: validateSalary
}