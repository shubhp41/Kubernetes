const crypto = require('crypto');
const axios = require('axios');

const handler = async (event) => {
    const inputData = event.value;
    const hashedValue = crypto.createHash('md5').update(inputData, 'utf8').digest('hex');

    const response = {
        banner: 'B00927948',
        result: hashedValue,
        arn: 'arn:aws:lambda:us-east-1:975080007958:function:md5',
        action: 'md5',
        value: inputData
    };

    try {
        console.log("in1")
        await axios.post(event.course_uri, response);
        console.log('POST request sent successfully.');
    } catch (error) {
        console.log("in2")
        console.error('Error sending POST request:', error);
        // Handle the error as needed
    }

    return response;
};

module.exports = {
    handler
};
