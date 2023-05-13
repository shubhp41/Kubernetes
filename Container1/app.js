const bodyParser = require("body-parser");
const express = require('express');
const axios = require('axios');
const app = express();
const port = 6000;


app.use(bodyParser.json());

app.post('/calculate', async (req, res) => {
    const { file, product } = req.body;

    //If file name is not provided
    if (!file) {
        res.status(400).json({ file: null, error: "Invalid JSON input." });
    }

    //check if file exists
    try {
        const response = await axios.get(`http://container2:7000/file/${file}`);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ file, error: 'File not found.' });
        }
        res.status(500).json({ file, error: 'Internal server error.' });
    }

    //send request to container 2

    try {
        const response = await axios.post('http://container2:7000/calculate', { file, product });

        res.json({ file, sum: response.data.sum })
    } catch (error) {
        if (error.response && error.response.status === 400) {
            res.status(400).json({ file, error: 'Input file not in CSV format.' });
        } else {

            res.status(500).json({ file, error: 'Internal Server error.' });
        }
    }
})

app.listen(port, () => {
    console.log(`Container 1 is listening at http://localhost:${port}`);
});
