'use strict';
const AWS = require('aws-sdk');


module.exports.getBoards = async (event, context) => {
  const payload = {
      TableName: process.env.DYNAMODB_MESSAGE_BOARD_TABLE,
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
    console.log('User payload', payload);
    return new Error('There was an error in getBoards' , error);
  }


};