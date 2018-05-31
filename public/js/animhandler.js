var menuopen = false;

function startLoadAnim() {
  
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
    if(localStorage.getItem("key") != null && localStorage.getItem("key") != undefined){
      window.location = "land.html"
    }
    else {
      window.location = "login.html";
    }
  }, 2400);
}

function startAddAppAnim() {

  setTimeout(function(){
    document.getElementById("step1").style.opacity = "1";
  }, 1000);
  setTimeout(function(){
    document.getElementById("step1").style.opacity = "0";
    
  }, 6000);
  setTimeout(function(){
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.opacity = "1";

    
  }, 7000);

  setTimeout(function(){
    document.getElementById("step2").style.opacity = "0";
  }, 12000);
  setTimeout(function(){
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.opacity = "1";

    
  }, 13000);

  setTimeout(function(){
    document.getElementById("step3").style.opacity = "0";
  }, 18000);
  setTimeout(function(){
    document.getElementById("step3").style.display = "none";
    document.getElementById("step4").style.opacity = "1";

    
  }, 19000);


}

function toggleMenu(){
  if(menuopen){
    document.getElementById("lowerleft").style.setProperty("-webkit-transform", "scale(.95) translate(-100px, 0)");
    setTimeout(function(){
      document.getElementById("middleleft").style.setProperty("-webkit-transform", "scale(.95) translate(-75px, -75px)");
    },50);
    setTimeout(function(){
      document.getElementById("uppermiddle").style.setProperty("-webkit-transform", "scale(.95) translate(0, -100px)");
    },100);
    setTimeout(function(){
      document.getElementById("middleright").style.setProperty("-webkit-transform", "scale(.95) translate(75px, -75px)");
    },150);
    setTimeout(function(){
      document.getElementById("lowerright").style.setProperty("-webkit-transform", "scale(.95) translate(100px, 0)");
    },200);
    // SECONDARY ANIMATION
    setTimeout(function(){
      document.getElementById("lowerleft").style.setProperty("-webkit-transform", "scale(1.25) translate(0, 0)");
      setTimeout(function(){
        document.getElementById("middleleft").style.setProperty("-webkit-transform", "scale(1.25) translate(0, 0)");
      },50);
      setTimeout(function(){
        document.getElementById("uppermiddle").style.setProperty("-webkit-transform", "scale(1.25) translate(0, 0)");
      },100);
      setTimeout(function(){
        document.getElementById("middleright").style.setProperty("-webkit-transform", "scale(1.25) translate(0, 0)");
      },150);
      setTimeout(function(){
        document.getElementById("lowerright").style.setProperty("-webkit-transform", "scale(1.25) translate(0, 0)");
      },200);
    }, 100);
  }
  else{
    document.getElementById("lowerleft").style.setProperty("-webkit-transform", "scale(.95) translate(-100px, 0)");
    setTimeout(function(){
      document.getElementById("middleleft").style.setProperty("-webkit-transform", "scale(.95) translate(-75px, -75px)");
    },50);
    setTimeout(function(){
      document.getElementById("uppermiddle").style.setProperty("-webkit-transform", "scale(.95) translate(0, -100px)");
    },100);
    setTimeout(function(){
      document.getElementById("middleright").style.setProperty("-webkit-transform", "scale(.95) translate(75px, -75px)");
    },150);
    setTimeout(function(){
      document.getElementById("lowerright").style.setProperty("-webkit-transform", "scale(.95) translate(100px, 0)");
    },200);
    // SECONDARY ANIMATION
    setTimeout(function(){
      document.getElementById("lowerleft").style.setProperty("-webkit-transform", "scale(1.25) translate(-200px, 0)");
      setTimeout(function(){
        document.getElementById("middleleft").style.setProperty("-webkit-transform", "scale(1.25) translate(-150px, -150px)");
      },50);
      setTimeout(function(){
        document.getElementById("uppermiddle").style.setProperty("-webkit-transform", "scale(1.25) translate(0, -200px)");
      },100);
      setTimeout(function(){
        document.getElementById("middleright").style.setProperty("-webkit-transform", "scale(1.25) translate(150px, -150px)");
      },150);
      setTimeout(function(){
        document.getElementById("lowerright").style.setProperty("-webkit-transform", "scale(1.25) translate(200px, 0)");
      },200);
    }, 100);
  }
  menuopen = !menuopen;
}