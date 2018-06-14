var i = 0;
var degs = $("#prec").attr("class").split(' ')[1];
var activeBorder = $("#activeBorder");

function loopit(dir){
    if (dir == "c")
        i = i + 8;
    else
        i--;
    if (i < 0)
        i = 0;
    
    if (i<=180){
      activeBorder.css('background-image','linear-gradient(' + (90+i) + 'deg, transparent 50%, #FFF 50%),linear-gradient(90deg, #FFF 50%, transparent 50%)');
    }
    else{
      activeBorder.css('background-image','linear-gradient(' + (i-90) + 'deg, transparent 50%, #834B2D 50%),linear-gradient(90deg, #FFF 50%, transparent 50%)');
    }
    
    setTimeout(function(){
      if (i < degs){
        loopit("c");
      }
    },1);
    
}