const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  twitter: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  userimage: {
    type: Buffer,
    default: null
  },
  userimagetype: {
    type: String,
    default: ""
  }

}, {timestamps: true});

//plug in passport-local-mongoose into the schema
userSchema.plugin(passportLocalMongoose, {usernameField: "email"});

const User = mongoose.model("User", userSchema);

module.exports = User;