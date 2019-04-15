var d = new Date()
var dt1 = document.getElementById('dt1')
var dt2 = document.getElementById('dt2')
var sw1 = document.getElementById('sw1')
var sw2 = document.getElementById('sw2')
var ld1 = document.getElementById('ld1')
var ld2 = document.getElementById('ld2')
var nw1 = document.getElementById('nw1')
var nw2 = document.getElementById('nw2')



ut()
updateState()
update_LS()
window.setInterval(ut, 15000);
window.setInterval(updateState, 5000);
window.setInterval(update_LS, 5000);

function ut() {
    $.ajax({
        url: "/getnode/0001",
        type: 'GET',
        dataType:'json',
        success: function(res){
            document.getElementById('dt1').innerHTML = res[0].date
        }
    })
    $.ajax({
        url: "/getnode/0002",
        type: 'GET',
        dataType:'json',
        success: function(res){
            document.getElementById('dt2').innerHTML = res[0].date
        }
    })
}

function updateState(){
    if(d.getTime() - new Date(dt1.innerHTML).getTime() <= 35000){
        nw1.innerHTML = 'Online'
        nw1.style.backgroundColor='#418d52';
    }else if(d.getTime() - new Date(dt1.innerHTML).getTime() > 35000 && d.getTime() - new Date(dt1.innerHTML).getTime() <= 60000){
        nw1.innerHTML = 'Reconnecting...'
        nw1.style.backgroundColor='#d8cc41';
    }else{
        nw1.innerHTML = 'Offline'
        nw1.style.backgroundColor='#ff5151';
    }
    if(d.getTime() - new Date(dt2.innerHTML).getTime() <= 35000){
        nw2.innerHTML = 'Online'
        nw2.style.backgroundColor='#418d52';
    }else if(d.getTime() - new Date(dt2.innerHTML).getTime() > 35000 && d.getTime() - new Date(dt2.innerHTML).getTime() <= 60000){
        nw2.innerHTML = 'Reconnecting'
        nw2.style.backgroundColor='#d8cc41';
    }else{
        nw2.innerHTML = 'Offline'
        nw2.style.backgroundColor='#ff5151';
    }
}

function update_LS(){
    $.ajax({
        url: "/getnode/0001",
        type: 'GET',
        dataType:'json',
        success: function(res){
            console.log(res)
            if(res[0].sw_state == 'T'){
                sw1.innerHTML = 'On'
                sw1.style.backgroundColor = '#418d52'
            }else{
                sw1.innerHTML = 'Off'
                sw1.style.backgroundColor = '#ff5151'
            }
            if(res[0].ld_state == 'T'){
                ld1.innerHTML = 'On'
                ld1.style.backgroundColor = '#418d52'
            }else{
                ld1.innerHTML = 'Off'
                ld1.style.backgroundColor = '#ff5151'
            }
        }
    })
    $.ajax({
        url: "/getnode/0002",
        type: 'GET',
        dataType:'json',
        success: function(res){
            console.log(res)
            if(res[0].sw_state == 'T'){
                sw2.innerHTML = 'On'
                sw2.style.backgroundColor = '#418d52'
            }else{
                sw2.innerHTML = 'Off'
                sw2.style.backgroundColor = '#ff5151'
            }
            if(res[0].ld_state == 'T'){
                ld2.innerHTML = 'On'
                ld2.style.backgroundColor = '#418d52'
            }else{
                ld2.innerHTML = 'Off'
                ld2.style.backgroundColor = '#ff5151'
            }
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