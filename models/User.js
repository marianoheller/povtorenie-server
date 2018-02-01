const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;
//=====================================
// Schema
const userSchema = new Schema({
  displayName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  googleID: String,
  admin: { type: Boolean, default: false },
  words: [{
      type: String
  }]
});


//=====================================
// Static methods

userSchema.statics.createUser = function(googleID, lastName, firstName, callback) {
  return User.create({
    googleID: googleID,
    displayName: firstName + " " + lastName
  })
  .then( (result) => {
    if (!result) throw new Error("Failed to create user");
    callback(null, result);
  })
  .catch((err) => {
    callback(err, null);
  })
}

userSchema.statics.findOrCreate = function(userID, googleID, lastName, firstName, callback){
  this.findOne({
    // As of right now we only support Google Oauth2, so it this checks the googleID provided by google
    // Against existing members. 
    googleID: googleID
  })
  .exec()
  .then((user) => {
    if(user) return callback(null, user);
    else {
      // No user was found, create a new one
      console.log("Creating a new user");
      User.createUser(googleID, lastName, firstName, callback)
    }
  })
  .catch((error) => {
    console.log("findOrCreate", error);
    callback(error, null)
  })
}


userSchema.statics.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


//=====================================
// Instance methods

// checking if password is valid
userSchema.methods.verifyPassword = function(password) {
  try {
    var ret = bcrypt.compareSync(password, this.password);
  } catch (error) {
    return false;
  }
  return ret;
};


const User = mongoose.model('User', userSchema);


module.exports = User;