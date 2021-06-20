INSERT INTO department (dept_name) 
VALUES 
    ('Administrative'), 
    ('Sales'),
    ('Product'),
    ('Marketing'),
    ('Engineering'),
    ('Services'),
    ('Finance'),
    ('Legal'),
    ('Human Resources');

INSERT INTO roles (role_title, salary, department_id) 
VALUES 
    ('Customer Service Rep', 50000.00, 6), 
    ('Sales Rep', 60000.00, 2),
    ('Product Manager', 70000.00, 3),
    ('Marketing Manager', 65000.00, 4),
    ('Sr Software Engineer', 75000.00, 5),
    ('Accountant I', 55000.00, 7),
    ('Chief Counsel', 100000.00, 8),
    ('People Business Partner I', 62000.00, 9);

INSERT INTO employee (first_name, last_name, emp_role_id, manager_id) 
VALUES 
    ('Jane', 'Doe', 8, 19), 
    ('John', 'Smith', 7, 19), 
    ('Lil', 'Wayne', 6, 20),
    ('Dennis', 'Menace', 5, 19),
    ('Jeez', 'Louise', 4, 19),
    ('Michelle', 'B', 3, 19),
    ('Jess', 'Tencer', 2, 19),
    ('NULL', 'NULL', NULL, NULL),
    ('Salima', 'Gillmore', 1, NULL);
