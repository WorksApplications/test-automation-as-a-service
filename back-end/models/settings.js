let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SettingSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  testcases: Array
});

let SettingModel = mongoose.model('Settings', SettingSchema);

module.exports.Model = SettingModel;