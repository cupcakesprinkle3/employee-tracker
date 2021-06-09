const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const choicesArr = ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']


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
}

promptUser ();