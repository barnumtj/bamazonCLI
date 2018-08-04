var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "testtest",
    database: "bamazon"
});


function promptUser() {

    inquirer.prompt([{
        type: "list",
        choices: ["View Inventory", "View Low Inventory", "Add to inventory", "Add new product"],
        name: "initialPrompt"
    },


    ]).then(answers => {
        if (answers.initialPrompt === "View Inventory") {
            console.log("success")
            viewInventory();
            connection.end();
        }
        else if (answers.initialPrompt === "View Low Inventory") {
            lowInventory();
            connection.end();
        } else if (answers.initialPrompt === "Add to inventory") {
            addInventory();
            // connection.end();
        } else if (answers.initialPrompt === "Add new product") {
            addProduct();
            // connection.end();
        }


    }); 
}


function viewInventory() {
    connection.query("select * from products", function (error, results, fields) {
        if (error) throw error;
        console.log("Items currently for sale")

        for (let i = 0; i < results.length; i++) {
            const products = results[i];
            console.log(products.items_id + " " + products.product_name + " " + products.stock_quantity + " in stock")

        }
        // connection.end();
    });
}

function lowInventory() {
    connection.query("select * from products", function (error, results, fields) {
        if (error) throw error;


        for (let i = 0; i < results.length; i++) {
            const products = results[i];

            if (products.stock_quantity < 5) {
                console.log(products.product_name + " is running low");
                // connection.end();
            }
        }

    });
}

function addInventory(productID, quantityAdded) {

    inquirer.prompt([{
        type: "input",
        message: "What is the ID of item you'd like to add",
        name: "inventoryPrompt"
    },
    {
        type: "input",
        message: "How many would would you like to add?",
        name: "inventoryPrompt2"
    }]).then(answers => {
        let item = answers.inventoryPrompt;
        let amountToAdd = answers.inventoryPrompt2;
        connection.query("SELECT * FROM products WHERE ?", { items_id: item }, function (err, data) {
            if (err) throw err;

            console.log("Updating Stock")



            connection.query('UPDATE products SET stock_quantity = ' + (data[0].stock_quantity + parseInt(amountToAdd)) + ' WHERE items_id = ' + item), function (err, data) {
                if (err) throw err;


                // connection.end();
            }
        })
    })
}

function addProduct() {
    inquirer.prompt([{
        type: "input",
        message: "What product would you like to add?",
        name: "addPrompt"
    }, {
        type: "input",
        message: "What department would you like item to be listed under",
        name: "addPrompt1"
    }, {
        type: "input",
        message: "What is the price of the item?",
        name: "addPrompt2"
    }, {
        type: "input",
        message: "What is the inventory of item?",
        name: "addPrompt3"
    }


    ]).then(answers => {
  
        connection.query("INSERT INTO products SET ?",  {
           product_name: answers.addPrompt,
           department_name: answers.addPrompt1,
           price: answers.addPrompt2,
           stock_quantity: answers.addPrompt3
        }), function(err, data) {
            if (error) throw error;
            console.log("Successfully added " + answers.addPrompt)
            
        }
    });
}
promptUser();

