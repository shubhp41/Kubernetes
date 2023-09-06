const bodyParser = require("body-parser");
const express = require('express');
const axios = require('axios');
const app = express();
const fs = require('fs');
const port = 6000;
const path = '/shubh_PV_dir';
const csv = require('csv-writer');



app.use(bodyParser.json());

//Store Data
app.post('/store-file', async (req, res) => {
    const { file, data } = req.body;

    // If file name is not provided
    if (!file || Array.isArray(file) || file.length === 0) {
        res.status(400).json({ file: null, error: 'Invalid JSON input.' });
        return;
    }

    // If data is not provided
    if (!data || Array.isArray(data) || data.length === 0) {
        res.status(400).json({ file, error: 'Invalid JSON input.' });
        return;
    }

    // Store the file
    try {
        await storeFileToStorage(file, data);
        res.json({ file, message: 'Success.' });
    } catch (error) {
        res
            .status(500)
            .json({ file, error: 'Error while storing the file to the storage.' });
    }
    async function storeFileToStorage(file, data) {
        try {
            const filePath = `${path}/${file}`;
            const records = parseDataToCSV(data);
            const csvWriter = csv.createObjectCsvWriter({
                path: filePath,
                header: Object.keys(records[0]).map(key => ({ id: key, title: key })),
            });
            await csvWriter.writeRecords(records);
        } catch (err) {
            console.log(err);
        }
    }

    function parseDataToCSV(data) {
        const lines = data.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        console.log(headers)
        const records = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].split(',').map(value => value.trim());
            const record = {};
            for (let j = 0; j < headers.length; j++) {
                record[headers[j]] = line[j];
            }
            records.push(record);
            console.log(record);
        }

        return records;
    }
    // async function storeFileToStorage(file, data) {
    //     try {
    //         const filePath = `${path}/${file}`;
    //         await fs.promises.writeFile(filePath, data);
    //     }
    //     catch (err) {
    //         console.log(err);
    //     }
    // }
});

app.post('/calculate', async (req, res) => {
    const { file, product } = req.body;

    //If file name is not provided
    if (!file || Array.isArray(file) || file.length == 0) {
        res.status(400).json({ file: null, error: "Invalid JSON input." });
        return
    }
    if (!product || Array.isArray(product) || product.length == 0) {
        res.status(400).json({ file: null, error: "Invalid JSON input." });
        return
    }
    //check if file exists
    try {
        const response = await axios.get(`http://localhost:7000/file/${file}`);
    } catch (error) {
        if (error.response && error.response.status === 404) {
           return res.status(404).json({ file, error: 'File not found.' });
        }
        res.status(500).json({ file, error: 'Internal server error.' });
    }

    //send request to container 2

    try {
        const response = await axios.post('http://localhost:7000/calculate', { file, product });

        res.json({ file, sum: response.data.sum })
    } catch (error) {
        if (error.response && error.response.status === 400) {
            res.status(400).json({ file, error: 'Input file not in CSV format.' });
        } else {

            res.status(500).json({ file, error: 'Internal Server error.' });
        }
    }
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Container 1 is listening at http://0.0.0.0:${port}`);
});
