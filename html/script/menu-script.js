//RTC
window.setInterval(ut, 1000);
function ut() {
  var d = new Date();
  document.getElementById("dtStr").innerHTML = d.toString();
}

//script
function gotoHome(){
  $('#resFrame').attr('src','/html/node-tracker.html')
}

function openMap(){
  $('#resFrame').attr('src','/html/openmap.html')
}

function callData(api){
  if(api=='getnodeall'){
    $('#resFrame').attr('src','/getnode/all')
  }else if('node-tracker'){
    $('#resFrame').attr('src','/html/node-tracker.html')
  }
}

function callMap(zone){
  if(zone == 'z1'){
    $('#resFrame').attr('src','/html/img/map1.html')
  }else if(zone == 'z2'){
    $('#resFrame').attr('src','/html/img/map2.html')
  }else if(zone == 'z3'){
    $('#resFrame').attr('src','/html/img/map3.html')
  }else if(zone == 'z4'){
    $('#resFrame').attr('src','/html/img/map4.html')
  }else if(zone == 'z5'){
    $('#resFrame').attr('src','/html/img/map5.html')
  }else if(zone == 'z6'){
    $('#resFrame').attr('src','/html/img/map6.html')
  }else if(zone == 'z7'){
    $('#resFrame').attr('src','/html/img/map7.html')
  }
}