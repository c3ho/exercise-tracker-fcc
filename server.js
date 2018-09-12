const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
var Schema = mongoose.Schema;
mongoose.connect(process.env.MLAB_URI || 'mongodb://cho28:123abc@ds255332.mlab.com:55332/exercise_tracker' )

//creating schema, I think all info for exercises should be inside exercise table
var exSchema = new Schema({
  userName: String,
  exercises: [{
  description: String,
  duration: Number,
  date: {
    type: Date,
    default: Date.now}}]
})

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//creating a new user
app.post('/api/exercise/:new_user', (req,res) => {
  var user = req.params.new_user;
  var ex = mongoose.model('Exercise', exSchema);
});

//creating exercise
app.post('/api/exercise/add', (req,res) => {
  var userId = req.params.user;
  var desc = req.params.desc;
  var time = req.params.duration;
  var date = req.params.date;
  
  ex.find({ user: userId, 
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
