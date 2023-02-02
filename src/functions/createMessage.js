'use strict';
const AWS = require('aws-sdk');
const moment = require('moment');


module.exports.index = async function (req, res) {
  const value = req.query.value;

  res.setHeader("Set-Cookie", value);  // Noncompliant
  res.cookie("connect.sid", value);  // Noncompliant
};

module.exports.createMessage = async (event, context) => {
  const boardId = event.pathParameters.boardId;
  const body = JSON.parse(event.body);

  const { message, userId } = body;
  const newMessage = {
    userId,
    body: message,
    createdAt: moment().unix()
  };
  const payload = {
    TableName: process.env.DYNAMODB_MESSAGE_BOARD_TABLE,
    Key: {pk: boardId},
    ReturnValues: 'ALL_NEW',
    UpdateExpression: 'set #messages = list_append(if_not_exists(#messages,:empty_list), :newMessage)',
    ExpressionAttributeNames: {
      '#messages': 'messages'
    },
    ExpressionAttributeValues: {
      ':newMessage': [newMessage],
      ':empty_list': []
    }
  };
  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    await dynamoDB.update(payload).promise();
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Authorization'
      }
    }
  } catch(error) {
    console.log('Payload', payload);
    return new Error('There was an error in createMessage' , error);
  }


};
