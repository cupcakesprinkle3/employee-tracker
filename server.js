const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const choicesArr = ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
const cTable = require('console.table');

// const PORT = process.env.PORT || 3001;
// const app = express();

// Express middleware
//app.use(express.urlencoded({ extended: false }));
//app.use(express.json());

// app.get('/', (req, res) => {
//     res.json({
//         message: 'Hello World'
//     });
// });

// Default response for any other request (Not Found)
// app.use((req, res) => {
//     res.status(404).end();
// });

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: '',
        database: 'roster'
    },
    console.log('Connected to the roster database.')
);

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// console.log('Hello Node!');

const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do? (Make a selection below or use Ctrl+C to exit menu)',
            choices: choicesArr,
            default: 0
        },
    ])
        .then(choicesData => {
            if (choicesData.action === 'View all departments') {
                db.query(`SELECT * FROM department`, (err, row) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.table(row);
                    }
                    promptUser();

                });
            }
            if (choicesData.action === 'View all roles') {
                db.query(`SELECT roles.role_title,roles.role_id,department.dept_name,roles.salary FROM department INNER JOIN roles ON roles.department_id = department.dept_id`, (err, row) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.table(row);
                    }
                    promptUser();

                });
            }
            if (choicesData.action === 'View all employees') {
                db.query(`SELECT 
                id,
                first_name,
                last_name,
                manager_id,
                role_title,
                salary,
                dept_name
            FROM
                employee
            INNER JOIN
                roles ON roles.role_id = employee.emp_role_id
            INNER JOIN
                department ON department.dept_id = roles.department_id`, (err, row) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.table(row);
                    }
                    promptUser();

                });
            }
            if (choicesData.action === 'Add a department') {
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'add_dept',
                        message: 'Please provide the new department name. (Required)',
                        validate: deptInput => {
                            if (deptInput) {
                                return true;
                            } else {
                                console.log('Please enter the department name!');
                                return false;
                            }
                        }
                    },
                ])
                    .then(addDeptName => {
                        db.query(`INSERT INTO department (dept_name) VALUES ('${addDeptName.add_dept}');`, (err, row) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log("New department has been added.");
                            promptUser();
                        });
                    });


            }
            if (choicesData.action === 'Add a role') {
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'add_role_title',
                        message: 'Please provide the new role title. (Required)',
                        validate: roleInput => {
                            if (roleInput) {
                                return true;
                            } else {
                                console.log('Please enter the role title!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'add_salary',
                        message: 'Please provide the new role salary in number format (no dollar sign, no commas) and include the decimal and two decimal places. (Required)',
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log('Please enter the role salary!');
                                return false;
                            }
                        }
                    },
                ])
                    .then(addRoleName => {
                        db.query(`INSERT INTO roles (role_title, salary) VALUES ('${addRoleName.add_role_title}', '${addRoleName.add_salary}');`, (err, row) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log("New role has been added.");
                            console.log(row);
                            promptUser();
                        });
                    });

            }
            if (choicesData.action === 'Add an employee') {
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'add_employee_fn',
                        message: 'Please provide the employee first name. (Required)',
                        validate: fnameInput => {
                            if (fnameInput) {
                                return true;
                            } else {
                                console.log('Please enter the first name!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'add_employee_ln',
                        message: 'Please provide the employee last name. (Required)',
                        validate: lnameInput => {
                            if (lnameInput) {
                                return true;
                            } else {
                                console.log('Please enter the last name!');
                                return false;
                            }
                        }
                    },
                ])
                    .then(addEmployee => {
                        db.query(`INSERT INTO employee (first_name, last_name) VALUES ('${addEmployee.add_employee_fn}', '${addEmployee.add_employee_ln}');`, (err, row) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log("New employee has been added.");
                            console.log(row);
                            promptUser();
                        });
                    });
            }

        })
        .catch(err => {
            console.log(err);
        });
};

promptUser();