const bcrypt = require('bcryptjs');
const axios = require('axios');

exports.handler = async (event) => {
  const inputData = event.input.value;
  const saltRounds = 12;
  const hashedValue = await bcrypt.hash(inputData, saltRounds);

  const response = {
    banner: 'B00927948',
    result: hashedValue,
    arn: 'arn:aws:lambda:us-east-1:975080007958:function:bcryptfunction',
    action: 'bcrypt',
    value: inputData,
  };

  try {
    await axios.post(event.input.course_uri, response);
    console.log('POST request sent successfully.');
  } catch (error) {
    console.error('Error sending POST request:', error);
    // Handle the error as needed
  }

  return response;
};
