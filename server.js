const inquirer = require("inquirer");
const db = require("./config/connection");

db.connect(err => {
  if (err) throw err;
  console.log("Database connected.");
  promptUser();
});

function promptUser() {
  inquirer.prompt({
      type: "list",
      name: "pickOption",
      message: "What would you like to do?",
      choices: [
        "View all Departments",
        "View all Roles",
        "View all Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee Role",
        "Quit"
      ] 
    })

  .then((answer) => {
    switch (answer.pickOption) {
      case "View all Departments":
        viewAllDepartments();
        break;
    
      case "View all Roles":
       viewAllRoles();
       break;

      case "View all Employees":
       viewAllEmployees();
       break; 
    
      case "Add a Department":
       addDepartment();
       break; 

      case "Add a Role":
       addRole();
       break;

      case "Add an Employee":
       addEmployee();
       break;

      case "Update an Employee Role":
       updateEmployeeRole();
       break;

      case "Quit":
        db.end();
        break;
    }
  })
}

function viewAllEmployees() {
  db.query("SELECT * FROM employee", (err, data) => {
    if (err) throw err; 
    console.log("All Employees:");
    console.table(data);
    promptUser();
  });
}

function viewAllRoles() {
  db.query("SELECT * FROM role", (err, data) => {
    if (err) throw err; 
    console.log("All Roles:");
    console.table(data);
    promptUser();
  });
}

  function viewAllDepartments() {
    db.query("SELECT * FROM department", (err, data) => {
    if (err) throw err; 
    console.log("All Departments:");
    console.table(data);
    promptUser();
  });
}

function addDepartment() {
  inquirer.prompt([
    {
      type: "input",
      name: "department",
      message: "Enter the new department name:",
      validate: (value) => {
        if (value) {
          return true;
        } else {
          console.log("A new department name is required");
        }
      }
    },
  ])
  .then(answer => {
    db.query("INSERT INTO department SET ?", {name: answer.department},
      (err) => {
      if (err) throw err; 
      console.log(`The ${answer.department} department has been added`);
      promptUser();
      }
    );
  });  
}

function addRole() {
  const sql = "SELECT * FROM department";
    db.query(sql, (err, data) => {
        if (err) throw err;

      inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the name of the new role:",
          validate: (value) => {
            if (value) {
              return true;
            } else {
              console.log("A new role name is required");
            }
        }
      },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary for this role:",
          validate: (value) => {
            if (isNaN(value) === false) {
              return true;
            } else {
              console.log("A salary is required");
            }
          }  
        },
        {
          type: "rawlist",
          name: "department",
          choices: () => {
          let choiceArray = [];
          for (let i=0; i<data.length; i++) {
            choiceArray.push(data[i].name);
          }
          return choiceArray;
        },
          message: "Enter the department this role belongs to:",
      }    
    ]).then(answer => {
      let chosenDept;
      for (let i = 0; i < data.length; i++) {
        if (data[i].name === answer.department) {
            chosenDept = data[i];
        }
      }
      db.query(
        "INSERT INTO role SET ?",
        {
            title: answer.title,
            salary: answer.salary,
            department_id: chosenDept.id
        },
        (err) => {
          if (err) throw err; 
              console.log(`The ${answer.title} role has been added`);
              promptUser();
        }
    )
  });
 });
}

function addEmployee() {
  const sql = "SELECT * FROM employee, role";
    db.query(sql, (err, data) => {
        if (err) throw err;

      inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?",
          validate: (value) => {
            if (value) {
              return true;
            } else {
              console.log("A first name is required");
            }
          }  
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter the employee's last name:",
          validate: (value) => {
            if (value) {
              return true;
            } else {
              console.log("A last name is required");
            }
          }  
        },
        {
          type: "rawlist",
          name: "role",
          choices: () => {
            let choiceArray = [];
            for (let i = 0; i < data.length; i++) {
                choiceArray.push(data[i].title);
            }
            //remove duplicates
            let cleanChoiceArray = [...new Set(choiceArray)];
            return cleanChoiceArray;
        },
          message: "Enter the employee's role:"
      }
    ]).then(answer => {
      let chosenRole;

      for (let i = 0; i < data.length; i++) {
          if (data[i].title === answer.role) {
              chosenRole = data[i];
          }
      }

      db.query(
          "INSERT INTO employee SET ?",
          {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: chosenRole.id,
          },
          (err) => {
              if (err) throw err;
              console.log(`Employee ${answer.firstName} ${answer.lastName} has been added under role ${answer.role}`);
              promptUser();
          }
      )
  });
});
}

function updateEmployeeRole() {
  db.query("SELECT * FROM employee, role", (err, data) => {
    if (err) throw err;

      inquirer.prompt([
        {
          type: "rawlist",
          name: "employeeId",
          choices: () => {
            let choiceArray = [];
            for (let i = 0; i < data.length; i++) {
                choiceArray.push(data[i].last_name);
            }
            //remove duplicates
            let cleanChoiceArray = [...new Set(choiceArray)];
            return cleanChoiceArray;
        },
          message: "Select employee to update:",
        },
        {
          type: "rawlist",
          name: "roleId",
          choices: () => {
            let choiceArray = [];
            for (let i = 0; i < data.length; i++) {
                choiceArray.push(data[i].title);
            }
            //remove duplicates
            let cleanChoiceArray = [...new Set(choiceArray)];
            return cleanChoiceArray;
        },
          message: "Select the employee's new role:",
        }
      ]).then(answer => {
        let chosenEe;
        let chosenRole;

        for (let i = 0; i < data.length; i++) {
            if (data[i].last_name === answer.employee) {
                chosenEe = data[i];
            }
        }

        for (let i = 0; i < data.length; i++) {
            if (data[i].title === answer.role) {
                chosenRole = data[i];
            }
        }

        db.query(
            "UPDATE employee SET ? WHERE ?",
            [
                {
                    role_id: chosenRole,
                },
                {
                    last_name: chosenEe,
                }
            ],
            (err) => {
                if (err) throw err;
                console.log(`Role has been updated!`);
                promptUser();
            }
        )
    })
})
}