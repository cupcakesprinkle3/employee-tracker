const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const choicesArr = ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
const express = require('express');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

console.log('Hello Node!');

const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
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
                    console.table(row);
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
                            console.table(row);
                        });
                    });

            }
            // var pageMD = generateMarkdown(readmeData)
            // writeToFile('./utils/README.md', pageMD)
        })
        .catch(err => {
            console.log(err);
        });
};

promptUser();

// GET All departments
// db.query(`SELECT * FROM department`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });

// GET All roles
db.query(`SELECT * FROM roles`, (err, row) => {
    if (err) {
        console.log(err);
    }
    console.log(row);
});