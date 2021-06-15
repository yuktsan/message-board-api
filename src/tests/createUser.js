'use strict';
const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;

let wrapped = mochaPlugin.getWrapper('createUser', '../../../src/functions/createUser', 'createUser');

const AWS = require('aws-sdk-mock');
const AWS_SDK = require('aws-sdk');
AWS.setSDKInstance(AWS_SDK);

describe('createUser', () => {
    before(done => {
        done();
    })

  it('implement test here', async () => {
    const response = await wrapped.run({});
    expect(response).to.not.be.empty;
  })
});
