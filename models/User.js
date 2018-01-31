const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
//=====================================
// Schema
const userSchema = new Schema({
  displayName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  googleID: String,
  admin: { type: Boolean, default: false },
  words: [{ word: String, date: Date }]
});


//=====================================
// Static methods

userSchema.statics.createUser = function(googleID, lastName, firstName, callback) {
  User.create({
    googleID: googleID,
    displayName: firstName + " " + lastName
  })
  .then( (result) => {
    if (!result) throw new Error("Failed to create user");
    callback(null, result);
  })
  .catch((err) => {
    console.log(err);
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


const User = mongoose.model('User', userSchema);


module.exports = User;