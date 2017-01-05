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
    username = "USERNAME";
    api = new HueApi(hostname, username);
};
hue.upnpSearch().then(init).done();

//create a lightstate
var lightState = hue.lightState;
var highstate = lightState.create().transitiontime(1).on(true);
var lowstate = lightState.create().transitiontime(1).on(true);

http.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//define bool for use in post
var prev_high = true;
//post request to recieve sound frequency data
app.post('/hueData', function(req, res){

    //get color & brightness values
    var hue = req.body["hue"];
    var bri = req.body["brightness"];
    var low = req.body["low"];

    //if it's a low frequency
    if (low){
        lowstate.hue(hue*65535).bri(bri);
        //only adjust high frequency brightness if it goes from high to low
        if (prev_high){
            highstate.bri(bri-175);
            prev_high = false;
        }

    }
    //high freq
    else{
        highstate.hue(hue*65535).bri(bri);
        //only adjust low frequency brightness if it goes from low to high
        if (!prev_high)
        {
            lowstate.bri(bri-175);
            prev_high = true;
        }
    }

    //make api calls
    if (typeof api != 'undefined'){

        api.setLightState(1, highstate, function(err, lights) {
                 if (err) throw err;
        });
        api.setLightState(2, highstate, function(err, lights) {
                 if (err) throw err;
        });

        api.setLightState(3, lowstate, function(err, lights) {
                 if (err) throw err;
        });
    }
    
    //OK
    res.sendStatus(200);
});
