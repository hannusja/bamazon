var mysql = require("mysql")
var inquirer = require("inquirer")

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
        connection.query("SELECT item_id FROM products", function(err, res) {
            if (err) throw err
            for (var i=0; i<res.length; i++){
                idArray.push(res[i].item_id)
            }
        }) 
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
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err
        console.log("Low inventory:\n")
        for (var i=0; i<res.length; i++){
            if (res[i].stock_quantity<=5){
                var stock={
                    ID: res[i].item_id,
                    Product: res[i].product_name,
                    Price: res[i].price,
                    Quantity: res[i].stock_quantity
                }
                console.log(stock)
            }  
        }
        continueWork()
    }) 
}

function addInventory(){
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Please type the id number of the product you wish to add more\n",
            validate: function(value) {
                if(idArray.indexOf(parseFloat(value))>-1){
                    return true
                }
                else {
                    return "Please type the id number!"
                }
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "How many items would you like to add",
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
        connection.query("SELECT stock_quantity FROM products WHERE ?",
        [
            {
                item_id: answers.id
            }
        ],
        function(err, res) {
            if (err) throw err
            var newQuantity=res[0].stock_quantity+parseFloat(answers.quantity)
            connection.query(
                "UPDATE products SET ? WHERE ?", [
                    {
                        stock_quantity: newQuantity
                    },
                    {
                        item_id: answers.id
                    }
                ],
                function (err,res){
                    if (err) throw err
                    console.log(res)
                    console.log("Inventory updated.\n")
                    continueWork()
                }
            )
        })
    })
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