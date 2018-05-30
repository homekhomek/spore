var socket = io.connect("141.126.155.58:7777"); // take your ip out for saftey when pushing

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

//socket.emit("Login",{username: user, password: pass}); // once emited will return with a packets also named Login

socket.on("Register",function (data) {
  /*data will be one of few things
    {
      status: "success/fail"
      type: "" //if fail, will be either "usernameNotUnique", "hasWhiteSpace", or "tooLong"
      key: "" //if success, will return key so you can log the user in
    }
  */
  if(data.status == "success"){
    localStorage.setItem('key', data.key);
    window.location = ""
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
});

//Prevent links from opening in safari

var a=document.getElementsByTagName("a");
for(var i=0;i<a.length;i++)
{
  a[i].onclick=function()
  {
    window.location=this.getAttribute("href");
    return false
  }
}