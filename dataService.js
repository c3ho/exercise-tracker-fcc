const mongoose = require('mongoose')
var Schema = mongoose.Schema;
//mongoose.connect(process.env.MLAB_URI || 'mongodb://cho28:123abc@ds255332.mlab.com:55332/exercise_tracker' )

//creating schema, I think all info for exercises should be inside exercise table
var exSchema = new Schema({
  userName: {
    type: String,
    unique: true},
  exercises: [{
  description: String,
  duration: Number,
  date: {
    type: Date,
    default: Date.now}}]
});

let user;


module.exports.initialize = function(){
 let db = mongoose.createConnection('mongodb://cho28:123abc@ds255332.mlab.com:55332/exercise_tracker');
 user = db.model('Exercise', exSchema);
}

module.exports.registerUser = function(userData){
 var newUser = new user(userData);
  newUser.save((err)=>{
    if(err){
      if (err.code == 11000){
        console.log("Username already taken");
      }
      else{
        console.log("Cannot create a new user: " + err.message);
      }
    }
  })
}

module.exports.track = function(userData){
  user.find({ "user": userData.user })
    .exec()
    .then((user)=>{
      //need to find a way to include userData in here with exercise info
    })
    .catch((err)=>{
      console.log("There was an error: " + err);
    })
}