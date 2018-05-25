let logger = require('../logger');
let crypto = require('crypto');

let UserModel = require('../models/users').Model;

const service = {
  resetPwd: (username, oldPwd, newPwd) => {
    // reset password

  },
  getUserByUsername: async (username) => {
    let user = await UserModel.findOne({username: username}, {
      password: 0,
      api_token: 0
    });
    if (user) {
      return user.toObject();
    } else {
      logger.warn(`Unable to find a user with username ${username}`);
      return null;
    }
  },
  getUsers: async (limit) => {
    let users = await UserModel.find({}, {
      password: 0,
      api_token: 0
    }).sort({username: 1});
    if (users) {
      return users;
    } else {
      logger.debug('Unable to list users');
      return null;
    }
  },
  getApiToken: async (username) => {
    let fetchedUser = await UserModel.findOne({username: username});
    if (fetchedUser && fetchedUser.api_token) {
      return fetchedUser.api_token;
    } else {
      return null;
    }
  },
  generateApiToken: async (username) => {

    let apiToken = crypto.randomBytes(16).toString('hex');

    try {
      let result = await UserModel.findOneAndUpdate({username: username}, {$set: {api_token: apiToken}});

      if (result) {
        return apiToken;
      } else {
        return null;
      }

    } catch (e) {
      logger.error(`Failed to create api token for user ${username}, ${e}`);
    }
  },

};

module.exports = service;
