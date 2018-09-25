const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

//using bodyParser for req.body
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const mongoose = require('mongoose')
var d = new Date();

mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )
const Schema = mongoose.Schema;
const exerciseSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true},
  exerciseCount: Number,
  exercise:[{
    description: String,
    duration: Number,
    date: Date
  }]
})

const Exercise = mongoose.model('Exercise', exerciseSchema);

//adding new user
app.post('/api/exercise/new-user', (req,res)=>{
  Exercise.find({'username': req.body.username})
    .exec(function (err,data){
    if (err)
      console.log(err);
    if (data.username != null){
      res.send("Username already exists!");
    }
    else{
      var e1 = new Exercise({'username': req.body.username, 'exerciseCount': 0, 'exercise': []});
      e1.save(function(err,data){
        if (err)
          console.log("There was an error with creating the user");
        else
          res.redirect('/');
      })
    }
  })
})

//adding exercise
//fix required
app.post('/api/exercise/add', (req,res)=>{
  if (req.body.userId)
    Exercise.find({username: req.body.userId})
      .exec(function(err,data){
      if (err)
        console.log(err);
      else{
        console.log(data);
        res.redirect('/');
      }
    })
  else
    console.log("No username found");
});
      /*else{
        if(req.body.description){
          if(req.body.duration != parseInt(req.body.duration)){
            if(req.body.date){
              //converting string to date
              const ex = {description: req.body.description, duration: req.body.duration, date: new Date(req.body.date)};
              res.json(ex);
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
          console.log("Missing/Invalid duration");
      }
    }
    else{
      console.log("Missing description");
    }
   }
  })
})*/

//finding exercises
app.get('/api/exercise/log?', (req,res)=>{
  if (!req.query.userId)
    console.log("Missing userId");
  else{
    var user = req.query.userId;
    var from = req.body.from;
    var to = req.body.to;
    var lim = req.body.limit;
    Exercise.find({
      'username': user
    }).exec(function (err, data){
      if (err)
        console.log("There was an issue finding the user");
      else
        if(to && from){
          Exercise.find({
            'username': user,
            'exercise.date': {$gte: from, $gte: to}
          }).exec(function (err, data){
            if (err)
              console.log("There was an issue finding the data");
            else
              return data;
          })
        }
        else if (to){
            Exercise.find({
            'username': user,
            'exercise.date': {$gte: to}
          }).exec(function (err, data){
            if (err)
              console.log("There was an issue finding the data");
            else
              return data;
          })
        }
        else if (from){
          Exercise.find({
            'username': user,
            'exercise.date': {$gte: from}
          }).exec(function (err, data){
            if (err)
              console.log("There was an issue finding the data");
            else
              return data;
          }) 
       }
       else{
         Exercise.find({
           'username': user,
           'exercise.date': {$gte: from, $gte: to}
         }).exec(function (err, data){
           if (err)
             console.log("There was an issue finding the data");
           else
             return data;
        }) 
      }      
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
