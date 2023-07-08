const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const AWS = require('aws-sdk');

const app = express();
app.use(bodyParser.json());

// Set AWS credentials
AWS.config.update({
    accessKeyId: 'ASIA6GB2MFELJEBR3XEK',
    secretAccessKey: 'tcxJYnCzj0XSeoGvyKtWV5jQ3Y1Afuc4+im5ouHz',
    sessionToken: 'FwoGZXIvYXdzEA4aDJtne6vtMupGZGPp6iLAAV/fdQUjJrFKknQzjHnxlQbLSGs/08AjbJKReafGqc3/nTOmhWVdtpVRv3CBGcAd2XecoQNNwAQNGFi+C7yPUBqSuffp6032PaU/o5BrqJOgYMHeZcUqiZRdWU5KWOn/gQu7VFoDm0+94dDzETuZnRICPAgMXzSf0tH//L6gRJSJc/mGy23iRv07lUO8UMMaKE/p4KAlnwfuHEEN7kmponL/x9Ff8hH+iOYq4fq65kjX2D5zRD2uciCtKyaexpOtmSiFp6WlBjItjTvi6XAxvZVScl6nQaEhK5ZUHDGB95DlydKlAkt+eO6pEfeBiS1hyKbMEIS+'
});
const dbConfig = {
    host: 'newadmin-rds.cw3xdel4ssnx.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'root1234',
    database: 'mydatabase',
};



// Create a database connection pool
const pool = mysql.createPool(dbConfig);
pool.getConnection((error, connection) => {
    if (error) {
        console.error('Error connecting to the database:', error);
        return;
    }
    console.log('Database connection successful!');
    connection.release(); // Release the connection
});
// POST /store-products endpoint
app.post('/store-products', (req, res) => {
    const products = req.body.products;

    if (!products || !Array.isArray(products)) {
        return res.sendStatus(400); // Bad request
    }

    // Insert products into the database
    const query = 'INSERT INTO products (name, price, availability) VALUES ?';
    const values = products.map((product) => [product.name, product.price, product.availability]);

    pool.query(query, [values], (error) => {
        if (error) {
            console.error('Error storing products:', error);
            return res.sendStatus(500); // Internal server error
        }

        res.json({ message: 'Success.' });
    });
});

// GET /list-products endpoint
app.get('/list-products', (req, res) => {
    // Retrieve products from the database
    const query = 'SELECT name, price, availability FROM products';

    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error retrieving products:', error);
            return res.sendStatus(500); // Internal server error
        }
        console.log(results);
        const products = results.map((row) => ({
            name: row.name,
            price: row.price,
            availability: row.availability,
        }));
        console.log({ products });

        res.json({ products });
    });
});

// Start the server
app.listen(80, () => {
    console.log('Server is running on port 80');
});
