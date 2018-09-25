const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
var d = new Date();

mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )
const Schema = mongoose.Schema;
const exerciseSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true},
  exercise:[{
    description: String,
    duration: Number,
    date: Date
  }]
})

const Exercise = mongoose.model('Exercise', exerciseSchema);

//adding new user
app.post('/api/exercise/new-user', (req,res)=>{
    var e1 = new Exercise({username: req.body.username});
    e1.save(function(err,data){
      if (err)
        console.log(err);
      else
        return data;
    })
})

//adding exercise
app.post('/api/exercise/add', (req,res)=>{
  if (req.body.userId)
    Exercise.find({name: req.body.userId}, (err,data)=>{
      if (err)
        console.log(err);
      else{
        if(req.body.description){
          if(req.body.duration){
            if(req.body.date){
              const ex = {description: req.body.description, duration: req.body.duration, date: req.body.date};
              data.exercise.push(ex);
              data.save((err,data)=>{
                if(err)
                  console.log(err);
                else
                  return data;
              });
            }
            else{
              data.exercise.push({
                description: req.body.description, 
                duration: req.body.duration, 
                date: d.getDate()
              });
              data.save((err,data)=>{
                if(err)
                  console.log(err);
                else
                  return data;
              });
            }
          }
        else{
          console.log("Missing duration");
      }
    }
    else{
      console.log("Missing description");
    }
   }
  })
})

app.get('/api/exercise/log?', (req,res)=>{
  if (!req.query.userId)
    console.log("Missing userId");
  else{
    var user = req.query.userId;
    if(req.body.from)
      var from = req.body.from;
    if(req.body.to)
      var to = req.body.to;
    if(req.body.limit)
      var lim = req.body.limit;
    Exercise.find({
      'username': user,
      'exercise.date': {$gte: from, $lte: to}
    }).limit(lim).exec(function (err, data){
      if (err)
        console.log(err);
      else
        return (data);
    })
  }
})
  
app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
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
