//Start HTTP Server & set PORT
var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var http = require('http').Server(app);
app.use("/assets", express.static(__dirname+'/assets'));
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

//Set up HueAPI and LightState
var hue = require("node-hue-api");
var HueApi = require("node-hue-api").HueApi;
var lightState = hue.lightState;

//Initialize API with hostname and username
var hostname = "192.168.1.64";
var username = "RVZO86tAOaakd1mfoAqLoKW0lvJlXr5Oqr1yT2ik";
var api = new HueApi(hostname, username);

//create 3 lightStates, one for each light
var state1 = lightState.create().transitiontime(2);
var state2 = lightState.create().transitiontime(2);
var state3 = lightState.create().transitiontime(2);

http.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/hueData', function(req, res){

    console.log(req.body);
    var v1 = req.body["1"]/256.0;
    var v2 = req.body["2"]/256.0;
    var v3 = req.body["3"]/256.0;

    api.setLightState(1, state1.on(true).hsb(v1*360,100, (v3*50)+50 ), function(err, lights) {
             if (err) throw err;
    });

    api.setLightState(2, state1.on(true).hsb(v2*360,100, (v1*50)+50), function(err, lights) {
             if (err) throw err;
    });

    api.setLightState(3, state1.on(true).hsb(v3*360,100,(v2*50)+50), function(err, lights) {
             if (err) throw err;
    });

    res.sendStatus(200);
});
