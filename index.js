// Setup basic express servernpm install
var debug = true;

var port = debug ? 7777 : 27016;

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var Jimp = require("jimp");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
var formidable = require('express-formidable');

var dbready = false;

var LoginDB = null;
var ImageDB = null;

var registerOpen = true;

server.listen(port, function() {
  console.log('Server listening at port %d', port);
});
// Routing
app.use('/', express.static(__dirname + '/public')); 

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 

  
var avatarConfig = {
    
  storage: multer.diskStorage({
  destination: function(req, file, next){
    next(null, './public/avatars');
  },   

  filename: function(req, file, next){
      LoginDB.findOne({key:file.fieldname}).then(function(profile) {
         if(profile != null) {
         const ext = file.mimetype.split('/')[1];
            next(null, profile.username + '.'+ext);
          }
        });
      }
    }),   

  fileFilter: function(req, file, next){
    if(!file){
      next();
    }
    const image = file.mimetype.startsWith('image/');
    if(image){
      
      next(null, true);
    }else{
     console.log("file not supported");
        //TODO:  A better message response to user on failure.
      return next();
    }
  }
};

var generalConfig = {
  
  storage: multer.diskStorage({
  destination: function(req, file, next){
    console.log("place is good");
    next(null, './public/imagestorage/general');
  },   

  filename: function(req, file, next){
    console.log("name is good");
      LoginDB.findOne({key:file.fieldname}).then(function(profile) {
        if(profile != null) {
        const ext = file.mimetype.split('/')[1];
          var name =profile.username + "-" + Date.now() + '.'+ext;
            next(null,name);
            //refineUploadImage(name,'./public/imagestorage/general/',profile );
          }
        });
      }
    }),   

  fileFilter: function(req, file, next){
    if(!file){
      next();
    }
    const image = file.mimetype.startsWith('image/');
    if(image){
      
      next(null, true);
    }else{
    console.log("file not supported");
        //TODO:  A better message response to user on failure.
      return next();
    }
  }
};

function refineUploadImage(imageName,imagePath) {
  LoginDB.findOne({username:imageName.split("-")[0]}).then(function(profile) {
    Jimp.read(imagePath + imageName, function (err, image) {
      if (err) throw err;


      var w = image.bitmap.width; 
      var h = image.bitmap.height;

      console.log(w + " " + h);

      image.cover(640,640 )
      .write(imagePath + imageName.split(".")[0] + ".png"); 

      var imageObject = {
        id: keyGen(),
        path: imageName.split(".")[0] + ".png",
        type: imagePath.split("/")[3],
        ownerKey: profile.key
      };

      if (profile.scores.general) {

      }
      else if (!profile.scores.general){
        profile.scores.general = {
          score: 1000,
          imageIDs: []
        };
      }

      profile.scores.general.imageIDs.push(imageObject.id);

      LoginDB.update({username:imageName.split("-")[0]}, profile);
      ImageDB.insertOne(imageObject);



      fs.unlinkSync(imagePath + imageName);

    });
  });
  
}
  
function sendIt(res) {
  res.send("image uploaded");
}
 
app.post('/avatar',multer(avatarConfig).any(),function(req,res){
  Jimp.read('./public/avatars/' + req.files[0].filename, function (err, image) {
    if (err) throw err;


    var w = image.bitmap.width; 
    var h = image.bitmap.height;

    console.log(w + " " + h);

    image.cover(333,333 )
    .write('./public/avatars/' + req.files[0].filename.split(".")[0] + ".png",sendIt(res)); 

    fs.unlinkSync('./public/avatars/' + req.files[0].filename);

  });
  
 console.log("image uploaded");
});

app.post('/upload/general',multer(generalConfig).any(),function(req,res){
  refineUploadImage(req.files[0].filename,'./public/imagestorage/general/');
  res.redirect('../profile.html');
});

var MongoClient = require('mongodb').MongoClient;

// Connection URL 
var url = 'mongodb://localhost:27017/spore';
// Use connect method to connect to the Server 

MongoClient.connect(url, function(err, db) {
  if (err == null) {
    console.log("Connected correctly to server");
    LoginDB = db.collection('users');
    ImageDB = db.collection('images');
    dbready = true;

  }
});

io.on('connection', function(socket) {
  console.log('User Connected');
  // when the client emits 'add user', this listens and executes
  

  socket.on('Register', function(data) {
    console.log("Register attempt");

    if ( data.username.includes("-")) {
      socket.emit("Register", {status: "fail", type:"noHyphens", key:""}); // no hyphens
      return;
    }
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
          bio: "I like shrooms",
          title: data.username,
          hasPoint: true,
          lastPointTime: "",
          key: keyGen(),
          email: data.email,
          scores: {
            overall: 1000,
          }
        };

        Jimp.read('./public/images/dfuser.png', function (err, image) {
          if (err) throw err;
          console.log(image);

          var w = image.bitmap.width; 
          var h = image.bitmap.height;

          console.log(w + " " + h);
      
          image.cover(333,333 )      
          .write('./public/avatars/' + profile.username + ".png"); 
      
        });
        LoginDB.insertOne(profile).then(function(item) { // push account
          socket.emit("Register", {status: "success", type:"", key:profile.key}); // emit success
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

  socket.on('Pick', function(currentKey, pick) {
    LoginDB.findOne({key:currentKey}).then(function(profile) {
      if(profile != null) {
        ImageDB.findOne({id: profile.currentPick.option1}).then(function(image1) {
          if(image1 != null) {
            ImageDB.findOne({id: profile.currentPick.option2}).then(function(image2) {
              if(image2 != null) {
                LoginDB.findOne({key: image1.ownerKey}).then(function(person1) {
                  if(person1 != null){
                    LoginDB.findOne({key: image2.ownerKey}).then(function(person2) {
                      if(person2 != null){
                        if(pick == 1) {
                          var WinnerR = Math.pow(10, person1.scores[image1.type].score / 1000);
                          var LoserR = Math.pow(10, person2.scores[image2.type].score / 1000);
                          var WinnerE = WinnerR / (LoserR + WinnerR);
                          var LoserE = LoserR / (LoserR + WinnerR);
                          person1.scores[image1.type].score += Math.floor(100 * (1 - WinnerE));
                          person2.scores[image2.type].score  += Math.floor(100 * (0 - LoserE));

                          WinnerR = Math.pow(10, person1.scores.overall / 400);
                          LoserR = Math.pow(10, person2.scores.overall / 400);
                          WinnerE = WinnerR / (LoserR + WinnerR);
                          LoserE = LoserR / (LoserR + WinnerR);
                          person1.scores.overall += Math.floor(100 * (1 - WinnerE));
                          person2.scores.overall  += Math.floor(100 * (0 - LoserE));

                          LoginDB.update({key:image1.ownerKey}, person1);
                          LoginDB.update({key:image2.ownerKey}, person2);
                        }
                        else if(pick == 2) {
                          var WinnerR = Math.pow(10, person2.scores[image1.type].score / 400);
                          var LoserR = Math.pow(10, person1.scores[image2.type].score / 400);
                          var WinnerE = WinnerR / (LoserR + WinnerR);
                          var LoserE = LoserR / (LoserR + WinnerR);
                          person2.scores[image1.type].score += Math.floor(100 * (1 - WinnerE));
                          person1.scores[image2.type].score  += Math.floor(100 * (0 - LoserE));

                          WinnerR = Math.pow(10, person2.scores.overall / 400);
                          LoserR = Math.pow(10, person1.scores.overall / 400);
                          WinnerE = WinnerR / (LoserR + WinnerR);
                          LoserE = LoserR / (LoserR + WinnerR);
                          person2.scores.overall += Math.floor(100 * (1 - WinnerE));
                          person1.scores.overall  += Math.floor(100 * (0 - LoserE));

                          LoginDB.update({key:image1.ownerKey}, person1);
                          LoginDB.update({key:image2.ownerKey}, person2);
                        }

                        getTwoImages(profile,image1.type,function(img1,img2) {
                          if(!profile.currentPick) {
                            profile.currentPick = {
                              option1: "",
                              option2: ""
                            };
                          }
                
                          profile.currentPick.option1 = img1.id;
                          profile.currentPick.option2 = img2.id;
                
                          socket.emit("GetCompare",{image1: {path: img1.path, type: img1.type},image2: {path: img2.path, type: img2.type}});
                          LoginDB.update({key:currentKey}, profile);
                
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });

  socket.on('GetCompare', function(data) {
    console.log("test");
    LoginDB.findOne({key:data}).then(function(profile) {
      if(profile != null) {
        getTwoImages(profile,"general",function(image1,image2) {
          console.log(image1);
          console.log(image2);
          if(!profile.currentPick) {
            profile.currentPick = {
              option1: "",
              option2: ""
            };
          }

          profile.currentPick.option1 = image1.id;
          profile.currentPick.option2 = image2.id;

          socket.emit("GetCompare",{image1: {path: image1.path, type: image1.type},image2: {path: image2.path, type: image2.type}});
          LoginDB.update({key:data}, profile);

        });
      }
    });
  });

  socket.on('Leaderboard', function(type) { 
    getBoard(type, function (board) {
      socket.emit("Leaderboard", board);
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
      if(data.username == "" || !data.username ) {
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

function hasWhiteSpace(str) {
  return str.indexOf(' ') >= 0;
}


function getTwoImages(profile, type, send) {
  ImageDB.aggregate([{
    $match: {'type': type}}, {
    $match: {ownerKey: {$ne: profile.key}}}, {
		$sample: {size: 1}
	}], function(err, result1) {
		if (result1.length == 1) {
      ImageDB.aggregate([{
        $match: {'type': type}}, {
        $match: { ownerKey: {$ne: profile.key}}},  {
        $match: { ownerKey: {$ne: result1[0].ownerKey}}},  {
        $sample: {size: 1}
      }], function(err, result2) {
    
        if (result2.length == 1) {
          send(result1[0], result2[0]);
        }
        else {
          send("haha", "lmao");
        }
      });
		}
		else {
			send("haha", "lmao");
		}
	});
	return null;
}

function getBoard (type,withBoard) {
  if(type == "overall") {
    LoginDB.find().sort({'scores.overall': -1}).toArray(function(err,board) {
      var actualBoard = [];
      for(var i = 0; i < board.length; i++) {
        actualBoard[i] = {
          username: board[i].username,
          score: board[i].scores.overall,
          place: (i+1)
        };
      }
  
      withBoard(actualBoard);
    });
  }
  else if (type == "general"){
    LoginDB.find({ "scores.general" : { $exists: true } }).toArray(function(err,board) {
      board.sort(function(a,b) {
        return b.scores[type].score - a.scores[type].score;
      }); 
      var actualBoard = [];
      for(var i = 0; i < board.length; i++) {
        actualBoard[i] = {
          username: board[i].username,
          score: board[i].scores["general"].score,
          place: (i+1)
        };
      }

      actualBoard.sort(function(a,b) {
        return b.score - a.score;
      }); 
  
      withBoard(actualBoard);
    });
  }
  else if (type == "selfie"){
    LoginDB.find({ "scores.selfie" : { $exists: true } }).toArray(function(err,board) {
      board.sort(function(a,b) {
        return b.scores[type].score - a.scores[type].score;
      }); 
      var actualBoard = [];
      for(var i = 0; i < board.length; i++) {
        actualBoard[i] = {
          username: board[i].username,
          score: board[i].scores["selfie"].score,
          place: (i+1)
        };
      }

      actualBoard.sort(function(a,b) {
        return b.score - a.score;
      }); 
  
      withBoard(actualBoard);
    });
  }
  else if (type == "meme"){
    LoginDB.find({ "scores.meme" : { $exists: true } }).toArray(function(err,board) {
      board.sort(function(a,b) {
        return b.scores[type].score - a.scores[type].score;
      }); 
      var actualBoard = [];
      for(var i = 0; i < board.length; i++) {
        actualBoard[i] = {
          username: board[i].username,
          score: board[i].scores["meme"].score,
          place: (i+1)
        };
      }

      actualBoard.sort(function(a,b) {
        return b.score - a.score;
      }); 
  
      withBoard(actualBoard);
    });
  }
}