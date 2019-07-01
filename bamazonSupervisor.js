var mysql = require("mysql")
var inquirer = require("inquirer")
var Table = require("cli-table")

var idArray=[]

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
})

function startwork(){
    connection.connect(function(err) {
        if (err) throw err
        console.log("connected as id " + connection.threadId+ "\n")
        //showMenu()
        var result = getSales("footwear")
        console.log(result)
    }) 
}

function showMenu (){
    connection.query("SELECT department_id FROM departments", function(err, res) {
        if (err) throw err
        idArray=[]
        for (var i=0; i<res.length; i++){
            idArray.push(res[i].department_id)
        }
    }) 
    inquirer.prompt([
    {
        type: "list",
        name: "doThis",
        message: "What would you like to do?\n",
        choices: ["View Product Sales by Department", "Create New Department"]
    }
    ])
    .then(function (answers) {
        switch(answers.doThis){
            case "View Product Sales by Department":
                viewSales()
            break;
            case "Create New Department":
                createDep()
            break
        }
    })
}



function viewSales(){
    connection.query("SELECT * FROM departments", function(err, res) {
        if (err) throw err
        console.log("Current sales:\n")
        var table = new Table({
            head: ['department_id', 'department_name', 'over_head_costs', 'product_sales','total_profit']
        })
        for (var i=0; i<res.length; i++){
            table.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_costs, getSales(res[i].department_name)]
            )
        }
        console.log(table.toString())
      continueWork()
    }) 
}

function createDep(){
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Please type the id number of the new department\n",
            validate: function(value) {
                if(!isNaN(value)&&idArray.indexOf(parseFloat(value))==-1)
                {
                    return true
                }
                else {
                    return "Please type the id number! Do not repeat existing id!"
                }
            }
        },
        {
            type: "input",
            name: "department",
            message: "Please type the new department name\n",
            validate: function(value) {
                if(value.match(/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/))
                {
                    return true
                }
                else {
                    return "Please type name of the department! Use letters!"
                }
            }
        },
        {
            type: "input",
            name: "costs",
            message: "Please type the over head costs",
            validate: function(value) {
                if(!isNaN(value)){
                    return true
                }
                else {
                    return "Please type number!"
                }  
            }
        }
    ]).then(function (answers) {
        connection.query( "INSERT INTO departments SET ?",
        {
            department_id: answers.id,
            department_name: answers.department.toLowerCase(),
            over_head_costs: answers.costs
        },
        function (err,res){
            console.log("New department added!\n")
            continueWork()
        })
    })
}


function getSales(dep){
    
    connection.query("SELECT department_name, SUM (product_sales) FROM products GROUP BY department_name", function (err, res) {
        if (err) throw err
        for (var i=0; i<res.length; i++){ 
            if (res[i].department_name==dep){
               var depRow=Object.values(res[i])
            }
        }
        var sale=depRow[1]
        console.log(sale)
        return sale
    })
}

function continueWork(){
    inquirer.prompt([
        { 
            type: "confirm",
            message: "Continue working with inventory?",
            name: "confirm",
            default: true
        }
    ])
    .then(function(inquirerResponse) {
        if (inquirerResponse.confirm) {
            showMenu()
        }
        else{
            console.log("Leaving the inventory...")
            connection.end()
        }
    })   
}

startwork()