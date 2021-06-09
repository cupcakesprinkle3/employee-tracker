USE roster;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
    dept_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  role_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  role_title VARCHAR(30) NOT NULL,
  salary DECIMAL(9,2),
  department_id INTEGER,
  CONSTRAINT fk_dept FOREIGN KEY (department_id) REFERENCES department(dept_id) ON DELETE SET NULL
);

CREATE TABLE employee (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  emp_role_id INTEGER,
  manager_id INTEGER DEFAULT NULL, 
  CONSTRAINT fk_emprole FOREIGN KEY (emp_role_id) REFERENCES roles(role_id) ON DELETE SET NULL,
  CONSTRAINT fk_managerid FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
