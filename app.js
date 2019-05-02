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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ProjectDB').then(()=>{
  console.log('@@@ Connect Success @@@')
}, ()=>{
  console.log('!!! Fail to connect !!!')
})

var connectSchema = new Schema({
    node:{type:String, required:true, unique:true},
    addr:{type:String, required:true},
    port:{type:String, required:true},
    sw_state:{type:String, required:true},
    ld_state:{type:String, required:true},
    date:{type:String, required:true}
})

var placeSchema = new Schema({
    p_id:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    lat:{type:String, required:true},
    lng:{type:String, required:true},
})

var connection = mongoose.model('routingTable', connectSchema)
var place = mongoose.model('placeTable', placeSchema)

//HTTP JSON
app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/html/login.html')
})

app.get('/getconnection/:connection', (req,res)=>{
    if(req.params.connection == 'all'){
        connection.find().then((docs)=>{   
            res.send(docs)
        })
    }else{
        connection.find({node:req.params.node}).then((docs)=>{   
            res.send(docs)
        })
    }
})

app.post('/postconnection', (req,res)=>{
    let buffer = new connection({
        node:req.body.node,
        addr:req.body.addr,
        port:req.body.port,
        sw_state:req.body.sw_state,
        ld_state:req.body.ld_state,
        date:new Date()
    })
    buffer.save().then((docs)=>{
        res.send(docs)        
    },(err)=>{
        res.send(err)        
    })
})

app.get('/dropconnection/:connection', (req,res)=>{
    if(req.params.palce == 'all'){
        connection.remove({},(docs)=>{
            res.send(docs)
        })
    }else{
        connection.remove({node:req.params.connection},(docs)=>{
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


/*-------------------------------------------------*/

app.get('/getplace/:place', (req,res)=>{
    if(req.params.place == 'all'){
        place.find().then((docs)=>{   
            res.send(docs)
        })
    }else{
        place.find({p_id:req.params.place}).then((docs)=>{   
            res.send(docs)
        })
    }
})

app.post('/postplace', (req,res)=>{
    let buffer = new place({
        p_id:req.body.p_id,
        name:req.body.name,
        lat:req.body.lat,
        lng:req.body.lng,
    })
    buffer.save().then((docs)=>{
        res.send(docs)        
    },(err)=>{
        res.send(err)        
    })
})

app.get('/dropplace/:place', (req,res)=>{
    if(req.params.palce == 'all'){
        place.remove({},(d)=>{
            res.send(d)
        })
    }else{
        connection.remove({p_id:req.params.place},(docs)=>{
            res.send(docs)
        })
    }
})

app.listen(a_port, ()=>{
    console.log('Listening on port ' + a_port)
})


//UDP
server.on('message',(msg, rinfo)=>{
    console.log('server got a message from ' + rinfo.address + ':' + rinfo.port);
    console.log('ASCII: ' + msg);
    connection.deleteMany({node:msg.slice(0,4)}).then((docs)=>{
        let buffer = new connection({
            node:msg.slice(0,4),
            addr:rinfo.address,
            port:rinfo.port,
            sw_state:msg.slice(4,5),
            ld_state:msg.slice(5),
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