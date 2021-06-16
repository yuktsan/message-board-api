'use strict';
const AWS = require('aws-sdk');


module.exports.getUsers = async (event, context) => {
  const payload = {
      TableName: process.env.DYNAMODB_MESSAGE_BOARD_USERS_TABLE,
  };
  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const results = await dynamoDB.scan(payload).promise();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Authorization'
      },
      body: JSON.stringify({results})
    }
  } catch(error) {
    console.log('Payload', payload);
    return new Error('There was an error in getUsers' , error);
  }


};