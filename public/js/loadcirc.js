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
      else {
        document.getElementById("ptsholder").style.display = "block";
        $('.count').each(function () {
          $(this).prop('Counter',0).animate({
              Counter: $(this).text()
          }, {
              duration: 350,
              easing: 'swing',
              step: function (now) {
                  $(this).text(Math.ceil(now));
              }
          });
      });
      document.getElementById("prec").style.setProperty("-webkit-transform", "translate(-70%, 0)");
      document.getElementById("prec").style.border = "5px solid #834B2D";
      document.getElementById("ptsholder").style.setProperty("-webkit-transform", "translate(70%, 0)");
      document.getElementById("activeBorder").style.backgroundColor = "white";
      document.getElementById("activeBorder").style.backgroundImage = "none";
      }
    },1);
}