var ip = "141.126.155.58:7777";
var socket = io.connect(ip); // take your ip out for saftey when pushing
var pointss;
var myProfile = {};
var categories = ["general", "selfie", "meme"];
//pay ip: 141.126.155.58:7777
var a=document.getElementsByTagName("a");
linkFix();

function getAvatarURL(username) {
  return "http://" + ip + "/avatars/" + username + ".png?" + Date.now();
}

function sendReg(user, email, pass, pass2){
  if(pass == pass2){
    socket.emit("Register",{username: user, password: pass, email: email}); // once emited will return with a packets also named Register
  }
  else {
    alert("Passwords do not match!");
  }
}
function start () {
    if( window.navigator.standalone ) {
        startLoadAnim();
    }
    else {
        startAddAppAnim();
    }
}

function sendLogin(user, pass) {
  socket.emit("Login",{username: user, password: pass}); // once emited will return with a packets also named Login
}

socket.on("Register",function (data) {
  /*data will be one of few things
    {
      status: "success/fail"
      type: "" //if fail, will be either "usernameNotUnique", "hasWhiteSpace", or "tooLong"
      key: "" //if success, will return key so you can log the user in
    }
  */
  if(data.status == "success"){
    localStorage.setItem("key", data.key);
    window.location = "profile.html";
  }
  else {
    if(data.type == "usernameNotUnique"){
      alert("Username already taken!");
    }
    else if(data.type == "hasWhiteSpace"){
      alert("Whitespaces in the username are not permitted.");
    }
    else if(data.type == "noHyphens"){
      alert("No hyphens please lmao.");
    }
    else if(data.type == "tooLong"){
      alert("The username is too long!");
    }
    else {
      alert("Unkown error registering, please try again later.");
    }
  }
});

socket.on("Login",function (data) {
  /*data will be one of few things
    {
      status: "success/fail"
      type: "" //if fail, will be either "wrongPassword", "accountDoesntExist"
      key: "" //if success, will return key so you can log the user in
    }
  */
  if(data.status == "success"){
    localStorage.setItem("key", data.key);
    window.location = "profile.html";
  }
  else {
    if(data.type == "wrongPassword"){
      alert("Incorrect Password!");
    }
    else if(data.type == "accountDoesntExist"){
      alert("An account with this username does not seem to exist. Or your account has been decomposed by a rather large mushroom. Either way, whatever you're doing isn't working.");
    }
    else {
      alert("Unkown error logging in, please try again later.");
    }
  }
});

//Prevent links from opening in safari

function linkFix() {
  for(var i=0;i<a.length;i++){
    a[i].onclick=function(){
      window.location=this.getAttribute("href");
      return false;
    }
  }
}

function logout(){
  localStorage.removeItem("key");
  window.location = "login.html";
}

function grabProf(){
  socket.emit("Profile", {
    key: localStorage.getItem("key"), 
    username: getParameterByName("username")
  });
}

//username, admin, points, hasPoints, lastPointTime, email

socket.on("Profile", function(inf) {
 
  if(document.getElementById("prof") != null && document.getElementById("prof") != undefined){
    document.getElementById("userPlace").innerHTML = inf.profile.username;
    document.getElementById("ptsholder").innerHTML = inf.profile.scores.overall;
    document.getElementById("bio").innerHTML = inf.profile.bio;
    document.getElementById("prec").setAttribute("src", getAvatarURL(inf.profile.username));
    var finalCat = [];
      for(i = 0; categories.length > i; i++) {
        if(inf.profile.scores[categories[i]]) {
          inf.profile.scores[categories[i]].type = categories[i];
          finalCat.push(inf.profile.scores[categories[i]]);
        }
      }
      makeTiles(finalCat);
    if(getParameterByName("username") == undefined || getParameterByName("username") == null) {
      document.getElementById("editProf").innerHTML = "edit";
    }
  }  
  else if(document.getElementById("profpic") != null && document.getElementById("profpic") != undefined){
    document.getElementById("picupload").setAttribute("name", localStorage.getItem("key"));
    myProfile = inf.profile;
    document.getElementById("edprf").setAttribute("src", getAvatarURL(inf.profile.username));
  }
  else if(document.getElementById("uploadbox") != null  ){
    document.getElementById("uploadboxupload").setAttribute("name", localStorage.getItem("key"));
    myProfile = inf.profile;
  }
});

function getParameterByName(name, url) { 
  if (!url)  
    url = window.location.href; 
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url); 
  if (!results) 
    return null; 
  if (!results[2]) 
    return ''; 
  return decodeURIComponent(results[2].replace(/\+/g, " ")); 
}

$("#picupload").change(function(){
  document.getElementById("sendProf").style.backgroundColor = "#4B1B1E";
  document.getElementById("sendProf").style.display = "block";
});

$("#uploadboxupload").change(function(){
  document.getElementById("uploadboxlabel").style.opacity = "0";
  setTimeout(function(){
    document.getElementById("uploadboxlabel").style.display = "none";
    document.getElementById("uploadboxsubmit").style.display = "block";
    document.getElementById("uploadboxcancel").style.display = "block";
    
    setTimeout(function(){
      document.getElementById("uploadboxsubmit").style.opacity = "1";
      document.getElementById("uploadboxcancel").style.opacity = "1";
    }, 100);
    
  }, 1000);
  
});

$("#uploadboxcancel").click(function(){
  document.getElementById("uploadboxlabel").style.display = "block";
  document.getElementById("uploadboxsubmit").style.display = "none";
  document.getElementById("uploadboxcancel").style.display = "none";
});




$("#comparebtn").click(function(event){
  window.location = "comparemain.html";
});

$("#lowerright").click(function(event){
  window.location = "leaderboard.html";
});

function makeTiles(finalCategories){
  document.getElementById("catTiles").innerHTML = "";
  for(i = 0; finalCategories.length> i; i++){
    document.getElementById("catTiles").innerHTML += "<div id='" + finalCategories[i].type + "tile' class='catTile'>" + finalCategories[i].type.charAt(0).toUpperCase() + finalCategories[i].type.slice(1) + "<p class='tileScore'>" + finalCategories[i].score + "</p></div>";
    if((i+1)%2 == 0) {
      document.getElementById("catTiles").innerHTML += "<br>";
    }
  }
}

function updateBio(){
  socket.emit("UpdateBio", localStorage.getItem("key"), document.getElementById("newBio").value);
  document.getElementById("newBio").setAttribute("placeholder", "Bio updated!");
  document.getElementById("newBio").value = "";
  setTimeout(function(){
    document.getElementById("newBio").setAttribute("placeholder", "Enter your new bio here...");
  }, 3000);
}