'use strict';
const AWS = require('aws-sdk');


module.exports.getUserBoards = async (event, context) => {
  const userId = event.pathParameters.userId;

  const payload = {
      TableName: process.env.DYNAMODB_MESSAGE_BOARD_TABLE,
      FilterExpression: "#messages.#userId = :keyUserId",
      ExpressionAttributeNames: {
        '#messages': 'messages',
        '#userId': 'userId',
      },
      ExpressionAttributeValues: { ':keyUserId': userId}
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
    return new Error('There was an error in getUserBoards' , error);
  }


};