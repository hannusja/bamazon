var mysql = require("mysql")
var inquirer = require("inquirer")

var chosenProduct
var new_quantity
var total

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
})

function newOrder(){
    connection.connect(function(err) {
        if (err) throw err
        console.log("connected as id " + connection.threadId+ "\n")
        showstock()
        inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "Please type the id number of the product you wish to buy\n",
                validate: function(value) {
                    if(value<11&&value>0){
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
                message: "How many items would you like to order",
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
            chosenProduct = answers.id
            connection.query("SELECT price, stock_quantity FROM products WHERE ?",
            [
                {
                    item_id: answers.id
                }
            ],
            function(err, res) {
                if (err) throw err
                if(res[0].stock_quantity >= parseFloat(answers.quantity)){
                    new_quantity = res[0].stock_quantity-parseFloat(answers.quantity)
                    total = parseFloat(answers.quantity)*res[0].price
                    completeSale()
                }
                else{
                    console.log("Insufficient quantity!\n")
                    console.log("Sorry for inconvenience. More coming soon!")
                    connection.end()
                }
            })
        })
    })
}

function showstock() {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw err
        for (var i=0; i<res.length; i++){
            var stock={
                ID: res[i].item_id,
                Product: res[i].product_name,
                Price: res[i].price  
            }
            console.log(stock)  
        }
    })
}

function completeSale(){
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: new_quantity
            },
            {
                item_id: chosenProduct
            }
        ],
        function (err,res){
            if (err) throw err
            console.log("Your total is: $"+ total)
            connection.end()
        }
    )
}

newOrder()