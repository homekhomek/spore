console.log(getParameterByName("cat"));
socket.emit("GetCompare", localStorage.getItem("key"), getParameterByName("cat"), true);
socket.on("GetCompare", function(inf, inf2){
  if(inf2 == null){
    document.getElementById("compareOption1").style.backgroundImage = document.getElementById("compareOption1pre").style.backgroundImage;
    document.getElementById("compareOption2").style.backgroundImage = document.getElementById("compareOption2pre").style.backgroundImage;
    document.getElementById("compareOption1pre").style.backgroundImage = "url(http://" + ip + "/imagestorage/" + getParameterByName("cat") + "/" + inf.image1.path + ")";
    document.getElementById("compareOption2pre").style.backgroundImage = "url(http://" + ip + "/imagestorage/" + getParameterByName("cat") + "/" + inf.image2.path + ")";
  }
  else {
    document.getElementById("compareOption1").style.backgroundImage = "url(http://" + ip + "/imagestorage/" + getParameterByName("cat") + "/" + inf.image1.path + ")";
    document.getElementById("compareOption2").style.backgroundImage = "url(http://" + ip + "/imagestorage/" + getParameterByName("cat") + "/" + inf.image2.path + ")";
    document.getElementById("compareOption1pre").style.backgroundImage = "url(http://" + ip + "/imagestorage/" + getParameterByName("cat") + "/" + inf2.image1.path + ")";
    document.getElementById("compareOption2pre").style.backgroundImage = "url(http://" + ip + "/imagestorage/" + getParameterByName("cat") + "/" + inf2.image2.path + ")";
  }
});

function whatCat(){
  document.getElementById('catspan').innerHTML = "Category: " + getParameterByName("cat");
}

function pickPic(pic){
  socket.emit("Pick", localStorage.getItem("key"), pic);
}