console.log(getParameterByName("cat"));
socket.emit("GetCompare", localStorage.getItem("key"), getParameterByName("cat"));
socket.on("GetCompare", function(inf){
    document.getElementById("compareOption1").style.backgroundImage = "url(http://" + ip + "/imagestorage/" + getParameterByName("cat") + "/" + inf.image1.path + ")";
    document.getElementById("compareOption2").style.backgroundImage = "url(http://" + ip + "/imagestorage/" + getParameterByName("cat") + "/" + inf.image2.path + ")";
});

function whatCat(){
    document.getElementById('catspan').innerHTML = "Category: " + getParameterByName("cat");
}

function pickPic(pic){
  socket.emit("Pick", localStorage.getItem("key"), pic);
}