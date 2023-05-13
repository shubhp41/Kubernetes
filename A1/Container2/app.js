const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const app = express();
const port = 7000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

// GET /file/:filename
app.get('/file/:filename', (req, res) => {
    const { filename } = req.params;
    const filepath = `/usr/files/${filename}`;

    // Check if file exists
    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ file: filename, error: 'File not found.' });
    }

    // Read file and return contents
    const stream = fs.createReadStream(filepath);
    stream.pipe(res);
});
app.post('/calculate', (req, res) => {
    const { file, product } = req.body;
    const filepath = `/usr/files/${file}`;
    let sum = 0;

    // Check if file exists
    if (!fs.existsSync(filepath)) {
        res.status(404).json({ file, error: 'File not found.' });
    }

    // Parse CSV file and calculate sum
    let valid = true;
    fs.createReadStream(filepath)
        .pipe(csv())
        .on('data', (data) => {
            if (!data.product || !data.amount || isNaN(data.amount)) {

                valid = false;
            } else {
                // Calculate the sum
                if (data.product === product) {
                    sum += parseInt(data.amount);
                }
            }

        })
        .on('end', () => {
            if (valid) {
                res.json({ file, sum });
            } else {
                res.status(400).json({ file, error: 'Input file not in CSV format.' });
            }
        })
        .on('error', (error) => {
            res.status(400).json({ file, error: 'Input file not in CSV format.' });
        });
});


app.listen(port, () => {
    console.log(`Container 2 listening at http://localhost:${port}`)
})