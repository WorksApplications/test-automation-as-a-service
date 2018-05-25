let mongoose = require('mongoose');
let logger = require('../logger');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  email: String,
  source: String,
  employee_id: String,
  gc_username: String,
  api_token: String
});

UserSchema.statics.findByUsername = async (username) => {
  let user = await UserModel.findOne({
    username: username
  });
  if (user) {
    logger.info(`successfully fetched user by username: ${username}`);
    return user.toObject();
  } else {
    return user;
  }
};

UserSchema.statics.findByUsernameAndPwd = async (username, pwd) => {
  let user = await UserModel.findOne({
    username: username,
    password: pwd
  });
  if (user) {
    logger.info(`successfully fetch user by username and password: ${username}`);
    return user.toObject();
  } else {
    return user;
  }
};

UserSchema.statics.createUserFromGeniusCenter = async (username, pwd, email, employeeId, gcUsername) => {
  let user = await UserModel.create({
    username: username,
    password: pwd,
    email: email,
    employee_id: employeeId,
    gc_username: gcUsername,
    source: 'genius center'
  });
  if (user) {
    logger.info(`successfully created user: ${username}`);
    return user.toObject();
  } else {
    return user;
  }
};

UserSchema.statics.updateUser = async (username, user) => {
  let updatedUser = UserModel.update({username: username}, user);
  if (updatedUser) {
    logger.info(`successfully updated user: ${username}`);
    return true;
  } else {
    return false;
  }
};

let UserModel = mongoose.model('Users', UserSchema);

module.exports.Model = UserModel;
