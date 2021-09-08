const inquirer = require('inquirer');
const db = require('./utils/connector.js');
const val = require('./utils/inputValidator.js');

const PORT = 3001 || process.env.PORT;

const prompt = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'userChoice',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'View all employees by Department',
                'View all employees by Manager',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'Exit application'
            ]
        }
    ]).then(({ userChoice }) => {
        choiceHandler(userChoice);
    });
};

const choiceHandler = userChoice => {
    let message = '';

    switch(userChoice) {
        case 'View all departments': db.getDepartments().then(table => {
                console.table(table);
                prompt();
            })
            break;
        case 'View all roles': db.getRoles().then(table => {
                console.table(table);
                prompt();
            })
            break;
        case 'View all employees': db.getEmployees().then(table => {
                console.table(table);
                prompt();
            });
            break;
        case 'View all employees by Department': 
            message = 'Which department would you like to view?';
            db.getDepartments().then(table => {
                inquirer.prompt(promptChoices(message, 'dept', table)).then(department => {
                    return db.getEmployeesByDept(department.deptChoice);
                }).then(deptEmployeeTable => {
                    console.table(deptEmployeeTable);
                    prompt();
                })
            });
            break;
        case 'View all employees by Manager': 
            message = "Which manager's employees would you like to view?";
            db.getManagers().then(table => {
                inquirer.prompt(promptChoices(message, 'mgr', table)).then(manager => {
                    return db.getEmployeesByManager(manager.mgrChoice);
                }).then(mgrEmployeeTable => {
                    console.table(mgrEmployeeTable);
                    prompt();
                })
            });
            break;
        case 'Add Department': promptAddDepartment().then(() => {
                prompt();
            });
            break;
        case 'Add Role': promptAddRole().then(() => {
                prompt();
            });
            break;
        case 'Add Employee': promptAddEmployee().then(() => {
                prompt();
            });
            break;
        case 'Remove Employee': 
            break;
        case 'Update Employee Role': 
            break;
        case 'Update Employee Manager': 
            break;
        case 'Exit application':
            process.exit(1);
    }
};

const promptChoices = (msg, type, choices) => {    
    return {
        type: 'list',
        name: `${type}Choice`,
        message: msg,
        choices: choices.map(element => element.name || element.title)
    }
};

promptAddDepartment = () => {
    return inquirer.prompt([
        {
            type: 'text',
            name: 'deptName',
            message: 'What is the name of the department you would like to add? (Required)',
            validate: deptNameInput => {
                if(!deptNameInput)
                    console.log('\nYou must enter a department name!');
                return(deptNameInput !== '');
            }
        }
    ]).then(({ deptName }) => {
        return db.addDepartment(deptName);
    })
};

promptAddRole = async () => {
    const deptPrompt = await db.getDepartments().then(table => {
            return promptChoices('What department does this role belong to?', 'role', table);
    });

    const prompt = await inquirer.prompt([
        {
            type: 'text',
            name: 'roleName',
            message: 'What is the name of the role you would like to add? (Required)',
            validate: roleNameInput => {
                if(!roleNameInput)
                    console.log('\nYou must enter a role name!');
                return(roleNameInput !== '');
            }
        },
        {
            type: 'text',
            name: 'roleSalary',
            message: 'What is the salary of this role? (Required)',
            validate: roleSalaryInput => {
                const result = val.validateSalary(roleSalaryInput);
                if(!result)
                    console.log('\nYou must enter a valid salary!');
                return result;
            }
        },
        deptPrompt
    ]).then(({ roleName, roleSalary, roleChoice }) => {
        return db.addRole(roleName, roleSalary, roleChoice);
    });

    return prompt;
};

promptAddEmployee = async () => {
    const rolePrompt = await db.getRoles().then(table => {
        return promptChoices('What role does this employee have?', 'role', table);
    });

    const managerPrompt = await db.getEmployees().then(table => {
        return promptChoices('Which manager does this employee report to?', 'mgr', table);
    });

    const prompt = await inquirer.prompt([
        {
            type: 'text',
            name: 'employeeFirstName',
            message: 'What is the first name of the employee you would like to add? (Required)',
            validate: employeeFirstNameInput => {
                if(!employeeFirstNameInput)
                    console.log('\nYou must enter an employee first name!');
                return(employeeFirstNameInput !== '');
            }
        },
        {
            type: 'text',
            name: 'employeeLastName',
            message: 'What is the last name of the employee you would like to add? (Required)',
            validate: employeeLastNameInput => {
                if(!employeeLastNameInput)
                    console.log('\nYou must enter an employee last name!');
                return(employeeLastNameInput !== '');
            }
        },
        rolePrompt,
        managerPrompt
    ]).then(answers => {
        console.log(answers);
    })

    return prompt;
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