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
var hostname = "";
var username = "";
var api;

//initialization
var init = function(bridge) {
    hostname = bridge[0]["ipaddress"];
    username = "RVZO86tAOaakd1mfoAqLoKW0lvJlXr5Oqr1yT2ik";
    api = new HueApi(hostname, username);
};
hue.nupnpSearch().then(init).done();

//create a lightstate
var lightState = hue.lightState;
var state = lightState.create().transitiontime(5).on(true);


http.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//post request to recieve sound frequency data
app.post('/hueData', function(req, res){

    //get color & brightness values
    var hue = req.body["hue"];
    var bri = req.body["brightness"];

    //make api calls
    if (typeof api != 'undefined'){
        api.setLightState(1, state.hue(Math.round(hue*65535)), function(err, lights) {
                 if (err) throw err;
        });

        api.setLightState(2, state, function(err, lights) {
                 if (err) throw err;
        });

        api.setLightState(3, state, function(err, lights) {
                 if (err) throw err;
        });
    }

    res.sendStatus(200);
});
