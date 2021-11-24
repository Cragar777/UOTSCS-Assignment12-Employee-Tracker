USE employeetrackerdb;

INSERT INTO department (name)
VALUES 
  ("Sales"),
  ("Marketing"),
  ("Customer Service"),
  ("Finance"),
  ("Warehouse")
;

INSERT INTO role (title, salary, department_id)
VALUES
  ("Salesperson", 70000, 1),
  ("Analyst", 65000, 4),
  ("Shipper", 50000, 5),
  ("CS Manager", 80000, 3),
  ("MKT Manager", 90000, 2)
;

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES
  ("Lisa", "Frank", 1, NULL),
  ("Bart", "Mislivec", 1, NULL),
  ("Katrina", "Osterwick", 2, 9),
  ("Robert", "Canoli", 3, 8),
  ("Angeline", "Smith", 4, 7)
;