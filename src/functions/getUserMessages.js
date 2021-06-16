'use strict';
const AWS = require('aws-sdk');


module.exports.getUserMessages = async (event, context) => {
  const userId = event.pathParameters.userId;
  const body = JSON.parse(event.body);
  const {startTime, endTime} = body;
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
    const { Items } = results ;
    const filterResults = Items.filter(
        board => {
          return board.messages.createdAt >= startTime
              && board.messages.createdAt <=  endTime
        }).map( board => board.messages);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Authorization'
      },
      body: JSON.stringify({results:filterResults})
    }
  } catch(error) {
    console.log('User payload', payload);
    return new Error('There was an error in getUserMessages' , error);
  }


};