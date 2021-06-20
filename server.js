const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const choicesArr = ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'Sutrotowerpw123!',
        database: 'roster'
    },
    console.log('Connected to the roster database.')
);

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
                        type: 'list',
                        name: 'choose_department',
                        message: 'Which department does this role belong to?',
                        // CREDIT TO CLASSMATE MCC FOR THIS CODE SNIPPET AS INSPIRATION
                        // APPROVED TO SHARE BY THE INSTRUCTOR
                        // choices: answers => {
                        //     const departmentNew = new Department(db);
                        //     return departmentNew.fetchAll().then(department => {
                        //         return department.map(d => {
                        //             return { name: d.name, value: d.id }
                        //         })
                        //     })
                        // }
                        // CREDIT TO MIN YANG MY TUTOR FOR HELP WITH THE BELOW CHOICES CODE
                        choices: department => new Promise((resolve, reject) => {
                            db.query(`SELECT dept_name, dept_id FROM department`, (err, res) => {
                                if (err) reject(err);
                                resolve(res);
                            });
                        }).then(departments => departments.map(dept => {
                            // CREDIT TO JAKE DUDUM FOR THE BELOW RETURN CODE TO MAP NAME TO ID    
                            return {
                                name: dept.dept_name,
                                value: dept.dept_id
                            }
                        }))
                            .catch(err => {
                                console.log(err);
                            })
                    },
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
                        },
                    },

                ])
                    .then(addRoleName => {
                        db.query(`INSERT INTO roles (role_title, salary, department_id) VALUES ('${addRoleName.add_role_title}', '${addRoleName.add_salary}', '${addRoleName.choose_department}');`, (err, row) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log("New role has been added.");
                            promptUser();
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
            if (choicesData.action === 'Add an employee') {
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'choose_role',
                        message: 'Which role does this employee hold? (If role does not exist please Ctrl+C and add role first)',
                        choices: empRole => new Promise((resolve, reject) => {
                            db.query(`SELECT role_title, role_id FROM roles`, (err, res) => {
                                if (err) reject(err);
                                resolve(res);
                            });
                        }).then(roles => roles.map(role => {
                            return {
                                name: role.role_title,
                                value: role.role_id
                            }
                        }))
                            .catch(err => {
                                console.log(err);
                            })
                    },
                    {
                        type: 'list',
                        name: 'choose_mgr',
                        message: 'Which manager does this employee report to? (If manager does not exist please Ctrl+C and add manager first or select NULL)',
                        choices: empMgr => new Promise((resolve, reject) => {
                            db.query(`SELECT first_name, last_name, id FROM employee`, (err, res) => {
                                if (err) reject(err);
                                resolve(res);
                            });

                        }).then(employee => employee.map(mgr => {
                            return {
                                // CREDIT TO JOHN ROBINSON FOR SYNTAX ON ADDING FIRST AND LAST NAME TOGETHER
                                name: mgr.first_name + " " + mgr.last_name,
                                value: mgr.id
                            }
                        }))
                            .catch(err => {
                                console.log(err);
                            })
                    },

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
                        db.query(`INSERT INTO employee (first_name, last_name, emp_role_id, manager_id) VALUES ('${addEmployee.add_employee_fn}', '${addEmployee.add_employee_ln}', '${addEmployee.choose_role}', '${addEmployee.choose_mgr}');`, (err, row) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log("New employee has been added.");
                            promptUser();
                        });
                    });
            }
            if (choicesData.action === 'Update an employee role') {
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'choose_emp',
                        message: 'Choose an employee to update their role',
                        choices: empSelect => new Promise((resolve, reject) => {
                            db.query(`SELECT first_name, last_name, id FROM employee`, (err, res) => {
                                if (err) reject(err);
                                resolve(res);
                            });

                        }).then(employeeSelect => employeeSelect.map(emp => {
                            return {
                                name: emp.first_name + " " + emp.last_name,
                                value: emp.id
                            }
                        }))
                            .catch(err => {
                                console.log(err);
                            })
                    },
                    {
                        type: 'list',
                        name: 'choose_new_role',
                        message: 'What is the new role for this employee? (If role does not exist please Ctrl+C and add role first)',
                        choices: roleSelect => new Promise((resolve, reject) => {
                            db.query(`SELECT role_title, role_id, department_id FROM roles`, (err, res) => {
                                if (err) reject(err);
                                resolve(res);
                            });

                        })
                            .then(newRole => newRole.map(role => {
                                return {
                                    name: role.role_title + " | " + "Role ID = " + role.role_id + ", " + "Department ID for Role = " + role.department_id,
                                    value: role.role_id
                                }
                            }))
                            .catch(err => {
                                console.log(err);
                            })
                    },
                ])
                    .then(updateEmployee => {
                        db.query(`UPDATE employee SET emp_role_id = ${updateEmployee.choose_new_role} WHERE id = ${updateEmployee.choose_emp};`, (err, row) => {
                            if (err) {
                                console.log(err);
                            }
                            promptUser();
                        });
                    });
            }

        })        
}

promptUser();
