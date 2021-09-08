const db = require('./connector.js');

// Helper function to validate salary input
const validateSalary = salary => {
    return !isNaN(salary);
}

// Export functions
module.exports = {
    validateSalary: validateSalary
}