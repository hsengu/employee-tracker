const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./utils/connector.js');
const val = require('./utils/inputValidator.js');

const PORT = 3001 || process.env.PORT;

// Main menu prompt function
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
                'Update Employee Role',
                'Update Employee Manager',
                'Remove Department',
                'Remove Role',
                'Remove Employee',
                'View Budget by Department',
                'Exit application',
                new inquirer.Separator
            ]
        }
    ]).then(({ userChoice }) => {
        choiceHandler(userChoice);
    });
};

// Handler function to handle main menu selection from user
// 1. SELECT cases perform: DB Query -> Build Table -> Display Table -> Callback to main menu prompt
// 2. INSERT cases perform: Prompt User for Input -> Perform DB insert query -> Callback to main menu prompt
// 3. UPDATE cases perform: Prompt User for Input -> Perform DB update query -> Callback to main menu prompt
// 4. DELETE cases perform: Prompt User for Input -> Perform DB delete query -> Callback to main menu prompt
// 5. Quit Application case will exit the application
const choiceHandler = userChoice => {
    let message = '';

    switch(userChoice) {
        case 'View all departments': db.getDepartments().then(table => {
                table = cTable.getTable(table);
                console.table('\nAll Departments\n===============', table);
                prompt();
            })
            break;
        case 'View all roles': db.getRoles().then(table => {
                table = cTable.getTable(table);
                console.table('\nAll Roles\n=========', table);
                prompt();
            })
            break;
        case 'View all employees': db.getEmployees().then(table => {
                table = cTable.getTable(table);
                console.table('\nAll Employees\n=============', table);
                prompt();
            });
            break;
        case 'View all employees by Department': 
            message = 'Which department would you like to view?';
            db.getDepartments().then(table => {
                inquirer.prompt(promptChoices(message, 'dept', table)).then(department => {
                    return db.getEmployeesByDept(department.deptChoice);
                }).then(deptEmployeeTable => {
                    table = cTable.getTable(table);
                    console.table('\nEmployees by Department\n=======================', deptEmployeeTable);
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
                    table = cTable.getTable(table);
                    console.table('\nEmployees by Manager\n====================', mgrEmployeeTable);
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
        case 'Update Employee Role': promptUpdateEmployeeRole().then(() => {
                prompt();
            });
            break;
        case 'Update Employee Manager': promptUpdateEmployeeManager().then(() => {
                prompt();
            });
            break;
        case 'Remove Department': promptRemoveDepartment().then(() => {
                prompt();
            });
            break;
        case 'Remove Role': promptRemoveRole().then(() => {
                prompt();
            });
            break;
        case 'Remove Employee': promptRemoveEmployee().then(() => {
                prompt();
            });
            break;
        case 'View Budget by Department': promptDepartmentBudget().then((table) => {
                table = cTable.getTable(table);
                console.table('\nBudgets by Department\n=====================', table);
                prompt();
            });
            break;
        case 'Exit application':
            process.exit(1);
    }
};

// Helper function to prompt choices for selecting Managers or Department
const promptChoices = (msg, type, choices) => {    
    return {
        type: 'list',
        name: `${type}Choice`,
        message: msg,
        choices: choices.map(element => element.name || element.title)
    }
};

// Prompt function for prompting add a department
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

// Prompt function for prompting add a role
promptAddRole = async () => {
    // Create a department prompt
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

// Prompt function for prompting add an employee
promptAddEmployee = async () => {
    // Create a role prompt
    const rolePrompt = await db.getRoles().then(table => {
        return promptChoices('What role does this employee have?', 'role', table);
    });

    // Create a manager prompt
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
    ]).then(({ employeeFirstName, employeeLastName, roleChoice, mgrChoice }) => {
        db.addEmployee(employeeFirstName, employeeLastName, roleChoice, mgrChoice);
    });

    return prompt;
};

// Prompt function for prompting to update an employee's role
promptUpdateEmployeeRole = async () => {
    // Create an employee prompt
    const employeePrompt = await db.getEmployees().then(table => {
        return promptChoices('Which employee would you like to update?', 'emp', table)
    });

    // Create a role prompt
    const rolePrompt = await db.getRoles().then(table => {
        return promptChoices("What is this employee's new role?", 'role', table);
    });

    const prompt = await inquirer.prompt([
        employeePrompt,
        rolePrompt
    ]).then(({ empChoice, roleChoice }) => {
        db.updateEmployeeRole(empChoice, roleChoice);
    });

    return prompt;
};

// Prompt function for prompting to update an employee's manager
promptUpdateEmployeeManager = async () => {
    // Create an employee prompt
    const employeePrompt = await db.getEmployees().then(table => {
        return promptChoices('Which employee would you like to update?', 'emp', table)
    });

    // Create a manager prompt
    const managerPrompt = await db.getEmployees().then(table => {
        return promptChoices("Who is this employee's new manager?", 'mgr', table);
    });

    const prompt = await inquirer.prompt([
        employeePrompt,
        managerPrompt
    ]).then(({ empChoice, mgrChoice }) => {
        db.updateEmployeeManager(empChoice, mgrChoice);
    });

    return prompt;
};

// Prompt function for prompting to removing an employee
promptRemoveEmployee = async () => {
    // Create an employee prompt
    const employeePrompt = await db.getEmployees().then(table => {
        return promptChoices('Which employee would you like to remove?', 'emp', table)
    });

    const prompt = await inquirer.prompt([
        employeePrompt
    ]).then(({ empChoice }) => {
        db.removeEmployee(empChoice);
    });

    return prompt;
};

// Prompt function for prompting to removing a department
promptRemoveDepartment = async () => {
    // Create a department prompt
    const departmentPrompt = await db.getDepartments().then(table => {
        return promptChoices('Which department would you like to remove?', 'dept', table)
    });

    const prompt = await inquirer.prompt([
        departmentPrompt
    ]).then(({ deptChoice }) => {
        db.removeDepartment(deptChoice);
    });

    return prompt;
};

// Prompt function for prompting to removing a role
promptRemoveRole = async () => {
    // Create a role prompt
    const rolePrompt = await db.getRoles().then(table => {
        return promptChoices('Which role would you like to remove?', 'role', table)
    });

    const prompt = await inquirer.prompt([
        rolePrompt
    ]).then(({ roleChoice }) => {
        db.removeRole(roleChoice);
    });

    return prompt;
};

// Prompt function for getting budget by department
promptDepartmentBudget = async () => {
    // Create a department prompt
    const departmentPrompt = await db.getDepartments().then(table => {
        return promptChoices('Which department would you like to remove?', 'dept', table)
    });

    const prompt = await inquirer.prompt([
        departmentPrompt
    ]).then(({ deptChoice }) => {
        return db.getBudget(deptChoice);
    });

    return prompt;
};

// Init function to kick off the application
const init = () => {
    console.log(`
================
Employee Tracker
================
`);

    prompt();
}

// Call init function
init();