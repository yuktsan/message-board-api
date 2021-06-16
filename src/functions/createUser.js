'use strict';
const AWS = require('aws-sdk');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');


module.exports.createUser = async (event, context) => {
  const body = JSON.parse(event.body);
  const userId = uuidv4();
  const name = body.name;
  const email = body.email;
  const payload = {
    TableName: process.env.DYNAMODB_MESSAGE_BOARD_USERS_TABLE,
    Item: {
      pk: userId,
      email,
      name,
      createdAt: moment().unix()
    }
  };
  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    await dynamoDB.put(payload).promise();
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Authorization'
      }
    }
  } catch(error) {
    console.log('Payload', payload);
    return new Error('There was an error in createUser' , error);
  }


};