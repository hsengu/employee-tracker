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
        case 'View all employees by Department': db.getDepartments().then(table => {
                promptDepartments(table).then(deptEmployeeTable => {
                    console.table(deptEmployeeTable);
                    prompt();
                })
            });
            break;
        case 'View all employees by Manager': db.getManagers().then(table => {
                promptManagers(table).then(mgrEmployeeTable => {
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

const promptDepartments = departments => {    
    departments = departments.map(element => element.name)
    return inquirer.prompt([
        {
            type: 'list',
            name: 'deptChoice',
            message: 'Which department would you like to view?',
            choices: departments
        }
    ]).then(({ deptChoice }) => {
        return db.getEmployeesByDept(deptChoice);
    });
};

const promptManagers = managers => {    
    managers = managers.map(element => element.name)
    return inquirer.prompt([
        {
            type: 'list',
            name: 'mgrChoice',
            message: 'Which manager would you like to view?',
            choices: managers
        }
    ]).then(({ mgrChoice }) => {
        return db.getEmployeesByManager(mgrChoice);
    });
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

promptAddRole = () => {
    return inquirer.prompt([
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
        {
            type: 'text',
            name: 'roleDepartment',
            message: 'What is the name of the department this role belongs to? (Required)',
            validate: async roleDeptInput => {
                const result = await val.validateDept(roleDeptInput);
                if(result === -1)
                    console.log('\nYou must enter a valid department!');
                return result !== -1;
            }
        }
    ]).then(({ roleName, roleSalary, roleDepartment }) => {
        
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