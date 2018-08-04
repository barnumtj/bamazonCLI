var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "testtest",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;

});

connection.query("select * from products", function (error, results, fields) {
    if (error) throw error;
    console.log("Items currently for sale")

    for (let i = 0; i < results.length; i++) {
        const products = results[i];
        console.log(products.items_id + " "  + products.product_name + " " + products.price)
    }
    promptUser();
  
    

});

function promptUser() {

    inquirer.prompt([{
        type: "input",
        message: "What is the ID of the item you'd like to buy?",
        name: "initialPrompt"
    },
    {
        type: "input",
        message: "How many would you like to purchase?",
        name: "initialPrompt2"
    },

    ]).then(answers => {
        console.log(answers.initialPrompt, answers.initialPrompt2)

        let itemSelected = answers.initialPrompt;
        let quantityWanted = answers.initialPrompt2;
        var itemID = 'SELECT * FROM products WHERE ?';

        connection.query(itemID, { items_id: answers.initialPrompt }, function (err, data) {
           


            console.log("You'd like to buy " + quantityWanted + " " + data[0].product_name + "s at $" +data[0].price + " each" )

            let total = addTotal(parseFloat(data[0].price.toFixed(2)), parseFloat(quantityWanted))
           
            console.log("Your toal is: $" + total)
            if (data.length === 0){
                console.log("Need a valid ID")
            }
             else if (data[0].stock_quantity > quantityWanted) {
                var updateStock = 'UPDATE products SET stock_quantity = ' + (data[0].stock_quantity - quantityWanted) + ' WHERE items_id = ' + itemSelected;
                var inventory = data[0].stock_quantity;
                
                connection.query(updateStock, function (err, data) {
                    console.log("Success. We have that item in stock")
            
                })
            } else if (data[0].stock_quantity < quantityWanted) {
                    console.log("Sorry that item is not in stock in that quantity. Please try again")
            }
         connection.end();
           
        })
    });
}



function addTotal(item, quantity) {
    let total = item * quantity
    return total.toFixed(2)

}



