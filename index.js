const inquirer = require('inquirer');
const db = require('./utils/connector.js');

const PORT = 3001 || process.env.PORT;

const prompt = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'userChoice',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'View all employees by Department',
                'View all employees by Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'Exit application'
            ]
        }
    ]).then(answers => {
        switch(answers.userChoice) {
            case 'View all employees': db.getEmployees().then(table => {
                    console.table(table);
                    prompt();
                });
                break;
            case 'View all employees by Department': 
                break;
            case 'View all employees by Manager': 
                break;
            case 'Add Employee': 
                break;
            case 'Remove Employee': 
                break;
            case 'Update Employee Role': 
                break;
            case 'Update Employee Manager': 
                break;
            case 'Exit application':
                break;
        }
    });
};


const init = () => {
    console.log(`
================
Employee Tracker
================
`);

    prompt();
}

init();