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
      window.location = "profile.html";
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
    document.getElementById("top").style.setProperty("-webkit-transform", "scale(.95) translate(-2px, -85px)");
    setTimeout(function(){
      document.getElementById("upperright").style.setProperty("-webkit-transform", "scale(.95) translate(47px, -77px)");
    },50);
    setTimeout(function(){
      document.getElementById("lowerright").style.setProperty("-webkit-transform", "scale(.95) translate(87px, -46px)");
    },100);
    setTimeout(function(){
      document.getElementById("right").style.setProperty("-webkit-transform", "scale(.95) translate(100px, 2px)");
    },150);
    // SECONDARY ANIMATION
    setTimeout(function(){
      document.getElementById("top").style.setProperty("-webkit-transform", "scale(1.25) translate(0, 0)");
      setTimeout(function(){
        document.getElementById("upperright").style.setProperty("-webkit-transform", "scale(1.25) translate(0, 0)");
      },50);
      setTimeout(function(){
        document.getElementById("lowerright").style.setProperty("-webkit-transform", "scale(1.25) translate(0, 0)");
      },100);
      setTimeout(function(){
        document.getElementById("right").style.setProperty("-webkit-transform", "scale(1.25) translate(0, 0)");
      },150);
    }, 100);
  }
  else{
    document.getElementById("top").style.setProperty("-webkit-transform", "scale(.95) translate(-2px, -85px)");
    setTimeout(function(){
      document.getElementById("upperright").style.setProperty("-webkit-transform", "scale(.95) translate(47px, -77px)");
    },50);
    setTimeout(function(){
      document.getElementById("lowerright").style.setProperty("-webkit-transform", "scale(.95) translate(87px, -46px)");
    },100);
    setTimeout(function(){
      document.getElementById("right").style.setProperty("-webkit-transform", "scale(.95) translate(100px, 2px)");
    },150);
    // SECONDARY ANIMATION
    setTimeout(function(){
      document.getElementById("top").style.setProperty("-webkit-transform", "scale(1.25) translate(-5px, -170px)");
      setTimeout(function(){
        document.getElementById("upperright").style.setProperty("-webkit-transform", "scale(1.25) translate(90px, -160px)");
      },50);
      setTimeout(function(){
        document.getElementById("lowerright").style.setProperty("-webkit-transform", "scale(1.25) translate(154px, -90px)");
      },100);
      setTimeout(function(){
        document.getElementById("right").style.setProperty("-webkit-transform", "scale(1.25) translate(170px, 5px)");
      },150);
    }, 100);
  }
  menuopen = !menuopen;
}
