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
  socket.on('SendMessageTo', function(data) {
    LoginDB.findOne({username:data.user}).then(function (account) {

      let mailOptions = {
        from: 'paytonbrennanstuco@gmail.com', // sender address
        to: account.number + getCarrierByIndex(account.carrier), // list of receivers
        subject: data.subject,
        text: data.message, // plain text body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
      });
    });
  });

  socket.on('DatabaseClear', function(data) {
    LoginDB.remove();
    PostDB.remove();
    EventDB.remove();
    console.log("Db Cleared");
  });

  socket.on('LogUser', function(data) {
    LoginDB.findOne({username:data}).then(function (account) {
      if(account != null) {
        console.log("[" + data + "] Logging Account...");
        console.log( account.avatar.length);
      }
    });
  });

  socket.on('SetAdmin', function(data) {
    LoginDB.findOne({username:data.username}).then(function (account) {
      if(account != null) {
        account.admin = data.level;
        LoginDB.update({username:data.username},account);
        console.log( "[" + account.username + "] Admin Level set to " + data.level);
      }
      else
        console.log( "Rip");
    });

  });

  socket.on('SendMessagesNow', function(data) {
    console.log("Messages Sent Out");
    var d = new Date();
    var n = d.toISOString();
    var message = "Todays Events:\n";
    if (dayExists(n)) {
      var day = LoginDB.getData("/events/" + n);
      for (var y in day) {
        message += day[y].title + "\n";
      }
    } else {
      message += "Nothing";
    }
    LoginDB.find().toArray(function(err, object) {
      for (var property in object) {
        var person = object[property];


        let mailOptions = {
          from: 'paytonbrennanstuco@gmail.com', // sender address
          to: person.number + getCarrierByIndex(person.carrier), // list of receivers
          text: message, // plain text body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
        });
        
      }
    });
  });

  socket.on('IsOn', function(data) {
    socket.emit("ItsOn","lol");
  });

  socket.on('ChangeAccount', function(data) {
    LoginDB.findOne({key:data.key}).then(function (account) {
      if (data.changetype == "username" && !hasWhiteSpace(data.newvalue)) {
        account.username = data.newvalue;

      } else if (data.changetype != "username") {
        account[data.changetype] = data.newvalue;
      }

      LoginDB.update({key:data.key},account).then(function(result) {
        console.log("[" + account.username + "] Changing " + data.changetype);
        socket.emit("ChangeSuccess", data.changetype);
      });
    });
  });

  socket.on("CreatePost", function(inf){
    LoginDB.findOne({key:inf.key}).then(function (account) {
      var newpost = {
        pid: keyGen() ,
        username: account.username,
        message: inf.message,
        date: Date.now(),
        likes: [],
        replies: []
      };
      
      PostDB.insertOne(newpost).then(function(item) {
        console.log("[" + account.username + "] Posted Something");
        PostDB.find().toArray().then(function(posts) {
          io.sockets.emit("HerePosts", posts);
        });
      });
    });
  });

  socket.on("CreateReply", function(inf){
    LoginDB.findOne({key:inf.key}).then(function (account) {
      var newreply = {
        rid: keyGen(),
        username: account.username,
        message: inf.message,
        date: Date.now()
      };

      PostDB.findOne({pid:inf.pid}).then(function (post) {
        post.replies.push(newreply);
        PostDB.update({pid:inf.pid}, post).then(function(post1) {
          console.log("[" + account.username + "] Replied Something");
          PostDB.find().toArray().then(function(posts) {
            io.sockets.emit("HerePosts", posts);
          });
        });
      });
    });
  });

  socket.on("ReqPosts", function(inf){
    LoginDB.findOne({key:inf.key}).then(function (account) {
      PostDB.find().toArray().then(function(posts) {
        io.sockets.emit("HerePosts", posts);
      });
    });
  });

  socket.on("RemovePost", function(inf){
    LoginDB.findOne({key:inf.key}).then(function (account) {
      if(account.admin > 1)
      {
        PostDB.remove({pid:inf.pid}).then(function(){
          
          console.log("[" + account.username + "] Deleted a Post");
          PostDB.find().toArray().then(function(posts) {
            io.sockets.emit("HerePosts", posts);
          });
        });
      }
    });
  });

  socket.on("LikePost", function(inf){
    LoginDB.findOne({key:inf.key}).then(function (account) {
      PostDB.findOne({pid:inf.pid}).then(function (post) {
        if(post.likes.includes(account.username)) {
          for(var i = 0 ; i < post.likes.length ; i++) {
            if(account.username ==  post.likes[i]) {
              console.log("[" + account.username + "] Unliked a post");
              post.likes.splice(i,1);
            }
          }
        }
        else if (!post.likes.includes(account.username)) {
          console.log("[" + account.username + "] Liked a post");
          post.likes.push(account.username);
        }

        PostDB.update({pid:inf.pid}, post).then(function(post1) {
          
          PostDB.find().toArray().then(function(posts) {
            io.sockets.emit("HerePosts", posts);
          });
        });
      });
    });
  });

  socket.on("RemoveReply", function(inf){
    LoginDB.findOne({key:inf.key}).then(function (account) {
      PostDB.findOne({pid:inf.pid}).then(function (post) {
        if(account.admin > 1)
        {
          for(var i = 0; i < post.replies.length ; i++) {
            if(inf.rid == post.replies[i].rid) {
              post.replies.splice(i, 1);
            }
          }

          PostDB.update({pid:inf.pid}, post).then(function(post1) {
            console.log("[" + account.username + "] Removed a Reply");
            PostDB.find().toArray().then(function(posts) {
              io.sockets.emit("HerePosts", posts);
            });
          });
        }
      });
    });
  });

  socket.on('GetCalendar', function(data) {
    LoginDB.findOne({key:data.key}).then(function (account) {
      if (account != "" ) {
        EventDB.find().toArray().then(function(currentevents) {
          socket.emit("Calendar", currentevents);
        });
      }
    });
  });

  socket.on('SendEvent', function(data) {
   
    LoginDB.findOne({key:data.key}).then(function (account) {
      if (account  && account.admin > 0) {
        var event = {
          day: data.day,
          title: data.title,
          start: data.start,
          description: data.description
        };

        EventDB.insertOne(event).then(function(item) {
          console.log("[" + account + "] Created Event");
        });
      }
    });
  });

  socket.on('ForgotPassword', function(data) {

    LoginDB.findOne({username: data}).then(function(profile) {
      if(profile == null) {
        socket.emit("DoesntExist", true);
      }
      else {
        let mailOptions = {
          from: 'paytonbrennanstuco@gmail.com', // sender address
          to: profile.number + getCarrierByIndex(profile.carrier), // list of receivers
          subject: "Password Reset",
          text: "You have requested a password reset, if you have not, ignore this message. Your password is:" + profile.password // plain text body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
        });
      }
    });
  });

  socket.on('Profile', function(data) {
    LoginDB.findOne({key:data}).then(function(pro) {
      console.log(pro);
      socket.emit("Profile", pro);
    });
    //.limit(10)
    LoginDB.find().sort({hours:-1}).toArray(function(err,board) {
      for (var i in board) {
        var newshit =  {
          name: board[i].username,
          score: board[i].hours,
          number: board[i].number,
          carrier: board[i].carrier
        };
        board[i] = newshit;
      }
      socket.emit("Leaderboard", board);
    });
    
    //socket.emit("Leaderboard", getTopTen());
  });

  socket.on('GetUsername', function(data) {
    if (profileExists(data)) {
      var pro = LoginDB.getData("/users/" + data);
      pro.key = "0";
      pro.password = "";

      socket.emit("GetUsername", pro);

    }
  });

  socket.on('CheckPermission', function(data) {
    LoginDB.findOne({key:data}).then(function(profile) {
      if(profile.admin > 0)
        socket.emit("CheckPermission", true);
      else
        socket.emit("CheckPermission", false);
    });
    

  });

  socket.on('RegisterStatus', function(data) {
    socket.emit("RegisterStatus",registerOpen);
  });

  socket.on('ToggleRegister', function(data) {
    LoginDB.findOne({key:data}).then(function (account) {
      if(account.admin > 4)
      {
        registerOpen = !registerOpen;
      }
    });
  });

  socket.on('Register', function(data) {

    if(registerOpen) {

    
      LoginDB.findOne({username: data.username}).then(function (item) {

        if(item != null) {
          console.log("[" + item.username + "] Username Taken");
          socket.emit("AccountCreated", false);
        }
        else if (!hasWhiteSpace(data.username)) {
          var profile = {
            username: data.username,
            password: data.password,
            avatar:data.avatar,
            admin: 0,
            hours: 0,
            key: keyGen(),
            number: data.number,
            carrier: data.carrier
          };
          LoginDB.insertOne(profile).then(function(item) {
            console.log("[" + profile.username + "] Account Created");
            socket.emit("AccountCreated", true);
          });
          
        } else {
          console.log("Has whitespace");
          socket.emit("HasWhitespace", false);
        }
      
        
      
      });
    }
    else if (!registerOpen) {
      socket.emit("RegisterClose",true);
    }

  });

  socket.on('UserGrab', function(data) {
    LoginDB.findOne({key:data}).then(function(account) {
      LoginDB.find().sort({hours:-1}).toArray(function(err,people) {
        for (var i in people) {
          var newshit =  {
            username: people[i].username,
            hours: people[i].hours,
            admin: people[i].admin
          };
          people[i] = newshit;
        }
        socket.emit("UserGrab", people);
      });
    });
  });

  socket.on('AddHours', function(data) {
    LoginDB.findOne({key:data.key}).then(function(account) {
      if(account.admin > 3) {
        LoginDB.findOne({username:data.username}).then(function(change) {
          change.hours += data.hours;
          LoginDB.update({key: change.key},change).then(function(change) {
            console.log( "[" + data.username + "] " + data.hours + " added");
            LoginDB.find().sort({hours:-1}).toArray(function(err,people) {
              for (var i in people) {
                var newshit =  {
                  username: people[i].username,
                  hours: people[i].hours,
                  admin: people[i].admin
                };
                people[i] = newshit;
              }
              socket.emit("UserGrab", people);
            });
          });
        });
      }
    });
  });

  socket.on('SetHours', function(data) {
    LoginDB.findOne({key:data.key}).then(function(account) {
      if(account.admin > 3) {
        LoginDB.findOne({username:data.username}).then(function(change) {
          change.hours = data.hours;
          LoginDB.update({key: change.key},change).then(function(change) {
            console.log( "[" + data.username + "] Hours set to " + data.hours);
            LoginDB.find().sort({hours:-1}).toArray(function(err,people) {
              for (var i in people) {
                var newshit =  {
                  username: people[i].username,
                  hours: people[i].hours,
                  admin: people[i].admin
                };
                people[i] = newshit;
              }
              socket.emit("UserGrab", people);
            });
          });
        });
      }
    });
  });

  socket.on('Login', function(data) {
    LoginDB.findOne({username:data.username}).then(function(item) {
      if(item == null) {
        socket.emit("DoesntExist", "username");
        console.log("[" + data.username + "] Username Incorrect");
      }
      else {
        console.log("Checking " + data.password + " to " + item.password);
        if (data.password == item.password) {
          socket.emit("LoginSuccess", {
            key: item.key,
            username: item.username,
            admin: item.admin
          });
          console.log("[" + data.username + "] Login Successful");
        } else {
          socket.emit("DoesntExist", "password");
          console.log("[" + data.username + "] Password Incorrect");
        }
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

