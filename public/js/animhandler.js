function startAnim() {
  setTimeout(function(){
    document.getElementById("loadfill").style.width = "40%";
  }, 100);
  setTimeout(function(){
    document.getElementById("loadfill").style.width = "100%";
  }, 300);
  setTimeout(function(){
    document.getElementById("entroverlay").style.opacity = "0";
  }, 500);
  setTimeout(function(){
    document.getElementById("entroverlay").style.display = "none";
  }, 7580);
}