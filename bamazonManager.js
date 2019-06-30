var mysql = require("mysql")
var inquirer = require("inquirer")

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
        showMenu()
    }) 
}

function showMenu (){
    inquirer.prompt([
    {
        type: "list",
        name: "doThis",
        message: "What would you like to do?\n",
        choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]
    }
    ])
    .then(function (answers) {
        switch(answers.doThis){
            case "View Products for Sale":
                viewSale()
                break;
            case "View Low Inventory":
                viewLow()
                break;
            case "Add to Inventory":
                addInventory()
                break;
            case "Add New Product":
                addNew()
            break
        }
    })
}

function viewSale(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err
        console.log("Current inventory:\n")
        for (var i=0; i<res.length; i++){
            var stock={
                ID: res[i].item_id,
                Product: res[i].product_name,
                Price: res[i].price,
                Quantity: res[i].stock_quantity
            }
            console.log(stock)  
        }
        continueWork()
    }) 
}

function viewLow(){

}

function addInventory(){

}

function addNew(){

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