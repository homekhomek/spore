// Setup basic express servernpm install
var debug = true;

var port = debug ? 7777 : 27016;

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var dbready = false;

var LoginDB = null;

var registerOpen = true;

server.listen(port, function() {
  console.log('Server listening at port %d', port);
});
// Routing
app.use(express.static(__dirname + '/public'));

var MongoClient = require('mongodb').MongoClient;

// Connection URL 
var url = 'mongodb://localhost:27017/spore';
// Use connect method to connect to the Server 

MongoClient.connect(url, function(err, db) {
  if (err == null) {
    console.log("Connected correctly to server");
    LoginDB = db.collection('users');
    dbready = true;

  }
});

io.on('connection', function(socket) {
  console.log('User Connected');
  // when the client emits 'add user', this listens and executes
  

  socket.on('Register', function(data) {
    console.log("Register attempt");
    // Data format:  data: { username: "username", password: "password", email: "email"}
    LoginDB.findOne({username: data.username}).then(function (testProfile) { // get profile with username
      if(testProfile != null) { // does such profile exist?
        socket.emit("Register", {status: "fail", type:"usernameNotUnique", key:""}); // if yes emit a fail with non unique username
        console.log("Register Fail: usernameNotUnique");
      }
      else if (!hasWhiteSpace(data.username) && data.username.length < 15) { // if no check some parameters
        var profile = { // make account
          username: data.username,
          password: data.password,
          admin: 0,
          points: 0,
          hasPoint: true,
          lastPointTime: "",
          key: keyGen(),
          email: data.email,
        };
        LoginDB.insertOne(profile).then(function(item) { // push account
          socket.emit("Register", {status: "success", type:"", key:item.key}); // emit success
          console.log("Register Success");
        });
      } 
      else {
        if(hasWhiteSpace(data.username)) { // deal with problem
          socket.emit("Register", {status: "fail", type:"hasWhiteSpace", key:""});
          console.log("Register Fail: hasWhiteSpace");
        }
        else if (data.username.length >= 15) {
          socket.emit("Register", {status: "fail", type:"tooLong", key:""});
          console.log("Register Fail: tooLong");
        }
      }
    });
  });


  socket.on('Login', function(data) {
    LoginDB.findOne({username:data.username}).then(function(profile) {
      if(profile == null) {
        socket.emit("Login", {
          status: "fail",
          type: "accountDoesntExist",
          key: ""
        });
        console.log("Login Fail: accountDoesntExist");
      }
      else {
        if (data.password == profile.password) {
          socket.emit("Login", {
            status: "success",
            type: "",
            key: profile.key
          });
          console.log("Login Success");
        } 
        else {
          socket.emit("Login", {
            status: "fail",
            type: "wrongPassword",
            key: ""
          });
          console.log("Login Fail: wrongPassword");
        }
      }
    });
  });

  socket.on('Profile', function(data) {
    LoginDB.findOne({key:data.key}).then(function(profile) {
      if(profile == null) {
        socket.emit("Profile", {
          status: "fail",
          type: "invalidKey",
          profile: {}
        });
        console.log("Profile Fail: invalidKey");
      }
      if(data.username == "" ) {
        socket.emit("Profile", {
          status: "success",
          type: "",
          profile: profile
        });
        console.log("Profile Success");
      }
      else {
        LoginDB.findOne({username:data.username}).then(function(otherProfile) {
          if(otherProfile == null) {
            socket.emit("Profile", {
              status: "fail",
              type: "invalidUsername",
              profile: {}
            });
            console.log("Profile Fail: invalidUsername");
          }
          else  {
            otherProfile.key = "";
            otherProfile.password = "";
            socket.emit("Profile", {
              status: "success",
              type: "",
              profile: otherProfile
            });
            console.log("Profile Success");
          }
        });
      }


    });
  });

  socket.on('disconnect', function() {

  });
});



function isAdmin(key) {
  LoginDB.findOne({key: key}).then(function(item) {
    
    if (item.admin > 0) {
      return true;
    } else {
      return false;
    }

  });
}

function profileExists(username) {
  LoginDB.findOne({username: username}).then(function(item) {
    if (item == null) {
      console.log("[" + username + "] Account doesn't exist");
      return false;
    } else {
      console.log("[" + data.username + "] Account exists");
      return true;
    }
  });
}

function getProfileByKey(str) {
  LoginDB.findOne({key: key}).then(function(item) {
    return item;
  });
  return null;
}


function dayExists(day) {
  EventDB.findOne({day: day}).then(function(item) {
    if (item == null) {
      console.log("Day does not exist");
      return false;
    } else {
      console.log("Day does exist");
      return true;
    }
  });
}


function keyGen() {
  var key = "";
  for (var i = 0; i < 3; i++) {
    key += getRandomInt(1, 9);
  }

  key +=  String(Date.now());
  console.log(key);
  return key;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCarrierByIndex(bop) {
  return carriers[bop];
}

function hasWhiteSpace(str) {
  return str.indexOf(' ') >= 0;
}


function getTopTen() {
  var object = LoginDB.getData("/users");
  var board = []
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      board.push({
        name: object[property].username,
        score: object[property].hours,
        number: object[property].number,
        carrier: object[property].carrier
      });
    }
  }
  board.sort(function(a, b) {
    return b.score - a.score;
  });

  return board;
}

