//Start HTTP Server & set PORT
var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var http = require('http').Server(app);
app.use("/assets", express.static(__dirname+'/assets'));
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;
var hue = require("node-hue-api");
var HueApi = require("node-hue-api").HueApi;


//Initialize hue variables
var lightState = hue.lightState;
var hostname = "";
var username = "";
var api;

//initialization
var init = function(bridge) {
    hostname = bridge[0]["ipaddress"];
    username = "USERNAME";
    api = new HueApi(hostname, username);
};
hue.nupnpSearch().then(init).done();

//create 3 lightStates, one for each light
var state1 = lightState.create().transitiontime(0);
var state2 = lightState.create().transitiontime(0);
var state3 = lightState.create().transitiontime(0);

http.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


app.post('/hueData', function(req, res){

    var hue = req.body["hue"];
    var bri = req.body["brightness"];
    if (hostname!="")
    {
    api.setLightState(1, state1.on(true).hsb(hue*360, 100, bri), function(err, lights) {
             if (err) throw err;
    });

    api.setLightState(2, state1.on(true).hsb(hue*360, 100, bri), function(err, lights) {
             if (err) throw err;
    });

    api.setLightState(3, state1.on(true).hsb(hue*360, 100, bri), function(err, lights) {
             if (err) throw err;
    });
}

    res.sendStatus(200);
});
