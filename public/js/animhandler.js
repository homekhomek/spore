function startAnim() {
  
  setTimeout(function(){
    document.getElementById("entroverlayimg").style.opacity = "1";
    document.getElementById("entrload").style.opacity = "1";
  }, 1000);
  setTimeout(function(){
    document.getElementById("loadfill").style.width = "40%";
  }, 1500);
  setTimeout(function(){
    document.getElementById("loadfill").style.width = "100%";
  }, 1700);
  setTimeout(function(){
    document.getElementById("entroverlay").style.opacity = "0";
  }, 1900);
  setTimeout(function(){
    document.getElementById("entroverlay").style.display = "none";
  }, 2400);
}