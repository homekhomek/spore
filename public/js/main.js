var socket = io.connect(); // take your ip out for saftey when pushing

//socket.emit("Register",{username: "", password: "", email: ""}); // once emited will return with a packets also named Register (see below)

//window.navigator.standalone 

socket.on("Register",function (data) {
    /*data will be one of few things
        {
            status: "success/fail"
            type: "" //if fail, will be either "usernameNotUnique", "hasWhiteSpace", or "tooLong"
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