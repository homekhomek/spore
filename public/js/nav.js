
document.getElementById("navHolder").innerHTML = '<div class="blobs">' +
'<div class="blob" id="navTop" onclick="logout();"><i class="fas fa-sign-out-alt"></i></div>' +  
'<div class="blob" id="navUpperright" ><i class="fas fa-user-alt"></i></div>' +  
'<div class="blob" id="navLowerright"><i class="fas fa-chart-line"></i></div>' + 
'<div class="blob" id="navRight"><i class="fa fa-cloud-upload-alt"></i></div>' + 
'<div class="blob" onclick="toggleMenu()"><i class="fas fa-bars"></i></div>' +
'</div>' +
'<div id="compareBtn"><i class="fa fa-balance-scale" aria-hidden="true"></i></div>';

$("#compareBtn").click(function(event){
  window.location = "comparemain.html";
});

$("#navUpperright").click(function(event){
  window.location = "profile.html";
});

$("#navLowerright").click(function(event){
  window.location = "leaderboard.html";
});

$("#navRight").click(function(event){
  window.location = "uploadmain.html";
});
