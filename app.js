var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()
var a_port = 9000

var dgram = require('dgram')
var server = dgram.createSocket('udp4')
var s_port = 41234


app.use(express.static(__dirname))
app.use(bodyParser.json())

var Schema = mongoose.Schema
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Mydb').then(()=>{
  console.log('@@@ Connect Success @@@')
}, ()=>{
  console.log('!!! Fail to connect !!!')
})

var connectSchema = new Schema({
    node:{type:String, required:true},
    addr:{type:String, required:true},
    port:{type:String, required:true},
    status:{type:String},
    date:{type:String, required:true}
})

var connection = mongoose.model('routing', connectSchema)

//HTTP JSON
app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/html/login.html')
})

app.get('/getnode/:node', (req,res)=>{
    if(req.params.node == 'all'){
        connection.find().then((docs)=>{   
            res.send(docs)
        })
    }else{
        connection.find({node:req.params.node}).then((docs)=>{   
            res.send(docs)
        })
    }
})

app.get('/command/:node/:com',(req,res)=>{
    res.send('Turn success!')
    connection.find({node:req.params.node}).then((docs)=>{
        var ack = new Buffer(req.params.com)
        server.send(ack, 0, ack.length, docs[0].port, docs[0].addr, (err,bytes)=>{})
    })
})

app.listen(a_port, ()=>{
    console.log('Listening on port ' + a_port)
})



//UDP
server.on('message',(msg, rinfo)=>{
    console.log('server got a message from ' + rinfo.address + ':' + rinfo.port);
    console.log('ASCII: ' + msg);
    connection.deleteOne({node:msg.slice(2,6)}).then((docs)=>{
        let buffer = new connection({
            node:msg.slice(2,6),
            addr:rinfo.address,
            port:rinfo.port,
            status:'',
            date:new Date()
        })
        buffer.save().then((docs)=>{
            console.log(docs)        
        })
    })

})

server.on('error',(err)=>{
    console.log('server error: \n' + err.stack)
    server.close()
})

server.on('close',()=>{
    console.log('Closed.')
})

server.bind(s_port)


