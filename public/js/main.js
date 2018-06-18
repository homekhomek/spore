var socket = io.connect("141.126.155.58:7777"); // take your ip out for saftey when pushing
var pointss;
var myProfile = {};

var a=document.getElementsByTagName("a");
linkFix();

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
    document.getElementById("ptsholder").innerHTML = inf.profile.points;
    document.getElementById("bio").innerHTML = inf.profile.bio;
    document.getElementById("prec").setAttribute("src", "http://141.126.155.58:7777/avatars/" + inf.profile.username + ".png");
    if(getParameterByName("username") == undefined || getParameterByName("username") == null) {
      document.getElementById("editProf").innerHTML = "edit";
      document.getElementById("givept").style.backgroundColor = "#a0a0a0";
      document.getElementById("givept").setAttribute("onClick", "alert('You cant give a point to yourself you buffoon!')");
    }
  }  
  if(document.getElementById("profpic") != null && document.getElementById("profpic") != undefined){
    document.getElementById("picupload").setAttribute("name", localStorage.getItem("key"));
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
});



function startLoad() {
  document.getElementById("fakeloadlmao").style.opacity = "1";
  document.getElementById("sendProf").style.display = "none";
  document.getElementById("fakeloadlmao").innerHTML = "<div id='loadfiller'></div>";
  document.getElementById("loadfiller").style.opacity = "1";
  document.getElementById("loadfiller").style.width = "0";
  setTimeout(function(){
    document.getElementById("loadfiller").style.width = "20%";
  },1200);
  setTimeout(function(){
    document.getElementById("loadfiller").style.width = "65%";
  },2500);
  setTimeout(function(){
    document.getElementById("loadfiller").style.width = "100%";
  },4000);
  setTimeout(function(){
    document.getElementById("fakeloadlmao").style.opacity = "0";
  },4600);
  setTimeout(function(){
    document.getElementById("loadfiller").style.display = "none";
    document.getElementById("fakeloadlmao").style.opacity = "1";
    document.getElementById("fakeloadlmao").style.border = "none";
    document.getElementById("fakeloadlmao").innerHTML = "Profile Picture Updated!";
    document.getElementById("edprf").src = "http://141.126.155.58:7777/avatars/" + myProfile.username + ".png";
  },4600);
  setTimeout(function(){
    document.getElementById("fakeloadlmao").style.opacity = "0";
    
  },6000);
  setTimeout(function(){
    document.getElementById("sendProf").style.display = "block";
    document.getElementById("sendProf").style.backgroundColor = "grey";

  }, 6500);
}