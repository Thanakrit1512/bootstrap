var express = require('express')
var bodyParser = require('body-parser')

var mongojs = require('./db');
var db = mongojs.connect;
var app = express()
var a_port = 9000

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var s_port = 41234

app.use(express.static(__dirname))
app.use(bodyParser.json())

app.listen(a_port, function () {
    console.log("Sample Code for RESTful API run at ", a_port)
})

// ------------------ General ------------------

app.get('/', function (req, res) {
    res.send("Sample Code for RESTful API");
})

// ------------------ Routing ------------------

app.get('/getrouting/:id', function (req, res) {
    if(req.params.id == 'all'){
        db.routing.find({}, function (err, docs) {
            if (Object.keys(docs).length != 0) {
                res.json(docs);
            } else {
                res.send('User not found');
            }
        })
    }else{
        db.routing.find({_id:req.params.id}, function (err, docs) {
            if (Object.keys(docs).length != 0) {
                res.json(docs);
            } else {
                res.send('User not found');
            }
        })
    }
})

app.post('/addrouting', function (req, res) {
    db.routing.insert(req.body, function (err, docs) {
        if(err != null){
            res.send(err)
        }else{
            res.send(docs)
        }

    })
})

app.post('/updaterouting', function (req, res) {
    db.routing.findAndModify({
        query: {
          _id: req.body['_id']
        },
        update: {
          $set: req.body
        },
        new: true
      }, function (err, docs) {
        console.log('Update Done', docs);
        res.json(docs);
      })
})

app.get('/delrouting/:id', function (req, res) {
    if(req.params.id == 'all'){
        db.routing.remove({}, function (err, docs) {
            console.log(docs)
            res.send(docs)
          })
    }else{
        db.routing.remove({_id: req.params.id}, function (err, docs) {
            console.log(docs)
            res.send(docs)
          })
    }
})

// ------------------ Place ------------------

app.get('/getplace/:id', function (req, res) {
    if(req.params.id == 'all'){
        db.place.find({}, function (err, docs) {
            if (Object.keys(docs).length != 0) {
                res.json(docs);
            } else {
                res.send('Place not found');
            }
        })
    }else{
        db.place.find({_id:req.params.id}, function (err, docs) {
            if (Object.keys(docs).length != 0) {
                res.json(docs);
            } else {
                res.send('Place not found');
            }
        })
    }
})

app.post('/addplace', function (req, res) {
    db.place.insert(req.body, function (err, docs) {
        if(err != null){
            res.send(err)
        }else{
            res.send(docs)
        }

    })
})

app.post('/updateplace', function (req, res) {
    db.place.findAndModify({
        query: {
          _id: req.body['_id']
        },
        update: {
          $set: req.body
        },
        new: true
      }, function (err, docs) {
        console.log('Update Done', docs);
        res.json(docs);
      })
})

app.get('/delplace/:id', function (req, res) {
    if(req.params.id == 'all'){
        db.place.remove({}, function (err, docs) {
            console.log(docs)
            res.send(docs)
          })
    }else{
        db.place.remove({_id: req.params.id}, function (err, docs) {
            console.log(docs)
            res.send(docs)
          })
    }
})

// ------------------ UDP ------------------

app.get('/command/:node/:com',(req,res)=>{
    res.send('Turn success!')
    connection.find({node:req.params.node}).then((docs)=>{
        if(Object.keys(docs).length != 0){
            var ack = new Buffer(req.params.com)
            server.send(ack, 0, ack.length, docs[0].port, docs[0].addr, (err,bytes)=>{})
        }
    })
})

server.on('message',(msg, rinfo)=>{
    console.log('server got a message from ' + rinfo.address + ':' + rinfo.port);
    console.log('ASCII: ' + msg);

    var udpjson={
            _id:msg.slice(0,4),
            addr:rinfo.address,
            port:rinfo.port,
            sw:msg.slice(4,5),
            ld:msg.slice(5),
            date:new Date()
    }

    db.routing.findAndModify({
        query: {
            _id: req.body['_id']
        },update: {
            $set: udpjson
        },new: true
    }, function (err, docs) {
        console.log('Update Done', docs);
            res.json(docs);
    })
   
})

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});
  
server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});
  
server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.on('close',()=>{
    console.log('Closed.')
})
  
server.bind(s_port);