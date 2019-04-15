var d = new Date()
var dt1 = document.getElementById('dt1')
var dt2 = document.getElementById('dt2')
var sw1 = document.getElementById('sw1')
var sw2 = document.getElementById('sw2')
var ld1 = document.getElementById('ld1')
var ld2 = document.getElementById('ld2')
var nw1 = document.getElementById('nw1')
var nw2 = document.getElementById('nw2')



updateState()
window.setInterval(updateState, 1500);

function updateState(){

    $.ajax({
        url: "/getnode/0001",
        type: 'GET',
        dataType:'json',
        success: function(res){
            dt1.innerHTML = res[0].date
            if(res[0].sw_status == 'T'){
                sw1.innerHTML = 'On'
                sw1.style.backgroundColor = "#2add4e"
            }else{
                sw1.innerHTML = 'Off'
                sw1.style.backgroundColor = "#dd2a2a"
            }
            if(res[0].ld_status == 'T'){
                ld1.innerHTML = 'On'
                ld1.style.backgroundColor = "#2add4e"
            }else{
                ld1.innerHTML = 'Off'
                ld1.style.backgroundColor = "#dd2a2a"
            }
        }
    })
    $.ajax({
        url: "/getnode/0002",
        type: 'GET',
        dataType:'json',
        success: function(res){
            dt2.innerHTML = res[0].date
            if(res[0].sw_status == 'T'){
                sw2.innerHTML = 'On'
                sw2.style.backgroundColor = "#2add4e"
            }else{
                sw2.innerHTML = 'Off'
                sw2.style.backgroundColor = "#dd2a2a"
            }
            if(res[0].ld_status == 'T'){
                ld2.innerHTML = 'On'
                ld2.style.backgroundColor = "#2add4e"
            }else{
                ld2.innerHTML = 'Off'
                ld2.style.backgroundColor = "#dd2a2a"
            }
        }
    })

    if(d.getTime() - new Date(dt1.innerHTML).getTime() <= 35000){
        nw1.innerHTML = 'Online'
        nw1.style.backgroundColor='green';
    }else if(d.getTime() - new Date(dt1.innerHTML).getTime() > 35000 && d.getTime() - new Date(dt1.innerHTML).getTime() <= 60000){
        nw1.innerHTML = 'Reconnecting...'
        nw1.style.backgroundColor='yellow';
    }else{
        nw1.innerHTML = 'Offline'
        nw1.style.backgroundColor='red';
    }
    if(d.getTime() - new Date(dt2.innerHTML).getTime() <= 35000){
        nw2.innerHTML = 'Online'
        nw2.style.backgroundColor='green';
    }else if(d.getTime() - new Date(dt2.innerHTML).getTime() > 35000 && d.getTime() - new Date(dt2.innerHTML).getTime() <= 60000){
        nw2.innerHTML = 'Reconnecting'
        nw2.style.backgroundColor='yellow';
    }else{
        nw2.innerHTML = 'Offline'
        nw2.style.backgroundColor='red';
    }

    
}





function turnOff(node){
    $.ajax({
        url: "/command/" + node + "/00",
        type: 'GET',
        dataType:'text',
        success: function(res){
            console.log(res)
        }
    })
}
function turnOn(node){
    $.ajax({
        url: "/command/" + node + "/01",
        type: 'GET',
        dataType:'text',
        success: function(res){
            console.log(res)
        }
    })
}
