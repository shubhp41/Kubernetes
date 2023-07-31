const express = require('express');
const multer = require('multer');
require('dotenv').config();
const path = require('path');

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
});

const bodyParser = require('body-parser');
const cors = require('cors');
const dynamoDB = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
app.get('/', (req, res) => {
    res.json("Running");
    console.log("HITT")
});
const s3 = new AWS.S3();
const textract = new AWS.Textract();

const storage = multer.memoryStorage();
const upload = multer({ storage });
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const file = req.file; // Assuming the file is sent as "file" in the request body
        console.log("THis is the file in the server", file)
        // Upload the file to S3 bucket
        const s3UploadResult = await s3
            .upload({
                Bucket: 'uploadimage001',
                Key: file.originalname,
                Body: file.buffer,
            })
            .promise();

        // Start Textract job
        const textractStartResult = await textract
            .startDocumentTextDetection({
                DocumentLocation: {
                    S3Object: {
                        Bucket: s3UploadResult.Bucket,
                        Name: s3UploadResult.Key,
                    },
                },
            })
            .promise();

        const jobId = textractStartResult.JobId;

        // Wait for Textract job completion
        let textractJobResult;
        do {
            textractJobResult = await textract.getDocumentTextDetection({ JobId: jobId }).promise();
        } while (textractJobResult.JobStatus === 'IN_PROGRESS');

        if (textractJobResult.JobStatus === 'SUCCEEDED') {
            const extractedText = textractJobResult.Blocks
                .filter(block => block.BlockType === 'LINE')
                .map(block => block.Text)
                .join('\n');
            console.log("Textract Response", extractedText)

            res.status(200).json({ extractedText });
        } else {
            throw new Error('Textract job failed');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing the file.' });
    }
});

app.get('/todos', (req, res) => {
    const user_id = req.query.uniqueId;
    const params = {
        TableName: 'Todos', // Replace with your DynamoDB table name
        FilterExpression: 'user_id = :user_id', // Filter records based on user_id
        ExpressionAttributeValues: { ':user_id': user_id }, // Define the user_id value
    };

    dynamoDB.scan(params, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error retrieving tasks' });
        } else {
            res.json(data.Items);
        }
    });
});

app.post('/todo/new', (req, res) => {
    const { title, description, user_id } = req.body;
    console.log(user_id)

    const params = {
        TableName: 'Todos', // Replace with your DynamoDB table name
        Item: {
            id: Date.now().toString(),
            user_id,
            title,
            description,
            completed: false,
        },
    };

    dynamoDB.put(params, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error creating task' });
        } else {
            res.json(params.Item);
        }
    });
});

app.put('/api/status/:id', (req, res) => {
    const { id } = req.params;
    const { completed, user_id } = req.body;

    const params = {
        TableName: 'Todos', // Replace with your DynamoDB table name
        Key: {
            id,
        },
        UpdateExpression: 'set completed = :completed',
        ExpressionAttributeValues: {
            ':completed': completed,
        },
        ReturnValues: 'ALL_NEW',
    };

    dynamoDB.update(params, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error updating task' });
        } else {
            res.json(data.Attributes);
        }
    });
});
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, completed, user_id } = req.body;

    const params = {
        TableName: 'Todos', // Replace with your DynamoDB table name
        Item: {
            id,
            title,
            description,
            completed,
            user_id
        },
    };

    dynamoDB.put(params, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error updating task' });
        } else {
            res.json(params.Item);
        }
    });
});


app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;

    const params = {
        TableName: 'Todos', // Replace with your DynamoDB table name
        Key: {
            id,
        },
    };

    dynamoDB.delete(params, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error deleting task' });
        } else {
            res.json({ result: 'Task deleted' });
        }
    });
});
app.listen(3001, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:3001`);
});
