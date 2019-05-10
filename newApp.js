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

// ------------------ Routing ------------------

app.get('/', function (req, res) {
    res.send("Sample Code for RESTful API");
})

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
        db.routing.find({id:req.params.id}, function (err, docs) {
            if (Object.keys(docs).length != 0) {
                res.json(docs);
            } else {
                res.send('User not found');
            }
        })
    }
})

app.post('/postrouting', function (req, res) {
    db.routing.find({}, function (err, docs) {
        if (Object.keys(docs).length != 0) {
            db.routing.findAndModify({
                query: {
                  id: req.body['id']
                },
                update: {
                  $set: req.body
                },
                new: true
              }, function (err, docs) {
                console.log('Update Done', docs);
                res.json(docs);
              })
        } else {
            db.routing.insert(req.body, function (err, docs) {
                res.send(docs);
            })
        }
    })

})

app.get('/delrouting/:id', function (req, res) {
    if(req.params.id == 'all'){
        db.routing.remove({}, function (err, docs) {
            console.log(docs)
            res.send(docs)
          })
    }else{
        db.routing.remove({id: req.params.id}, function (err, docs) {
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
        db.place.find({id:req.params.id}, function (err, docs) {
            if (Object.keys(docs).length != 0) {
                res.json(docs);
            } else {
                res.send('Place not found');
            }
        })
    }
})

app.post('/postplace', function (req, res) {
    db.place.find({}, function (err, docs) {
        if (Object.keys(docs).length != 0) {
            db.place.findAndModify({
                query: {
                  id: req.body['id']
                },
                update: {
                  $set: req.body
                },
                new: true
              }, function (err, docs) {
                console.log('Update Done', docs);
                res.json(docs);
              })
        } else {
            db.place.insert(req.body, function (err, docs) {
                res.send(docs);
            })
        }
    })

})

app.get('/delplace/:id', function (req, res) {
    if(req.params.id == 'all'){
        db.place.remove({}, function (err, docs) {
            console.log(docs)
            res.send(docs)
          })
    }else{
        db.place.remove({id: req.params.id}, function (err, docs) {
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
            id:msg.slice(0,4),
            addr:rinfo.address,
            port:rinfo.port,
            sw:msg.slice(4,5),
            ld:msg.slice(5),
            date:new Date()
    }

    db.routing.find({}, function (err, docs) {
        if (Object.keys(docs).length != 0) {
            db.routing.findAndModify({
                query: {
                    id: req.body['id']
                },update: {
                    $set: udpjson
                },new: true
            }, function (err, docs) {
                console.log('Update Done', docs);
                    res.json(docs);
                  })
        } else {
            db.routing.insert(udpjson, function (err, docs) {
                res.send(docs);
            })
        }
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
// Prints: server listening 0.0.0.0:41234
