var express = require('express')
var app = express()
var port = 9000


app.use(express.static(__dirname))

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/html/login.html')
})

app.listen(port, ()=>{
    console.log('Listening on port ' + port)
})