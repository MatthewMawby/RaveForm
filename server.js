var hue = require("node-hue-api");
var HueApi = require("node-hue-api").HueApi;
var lightState = hue.lightState;

var hostname = "HOSTNAME";
var username = "USERNAME";
var api = new HueApi(hostname, username);

var state1 = lightState.create();
var state2 = lightState.create();
var state3 = lightState.create();

var num = 0;
while(num<120)
{
    api.setLightState(1, state1.on(true).hsb(0+num,100,100), function(err, lights) {
        if (err) throw err;
    });

    api.setLightState(2, state2.on(true).hsb(120+num,100,100), function(err, lights) {
        if (err) throw err;
    });

    api.setLightState(3, state3.on(true).hsb(240+num,100,100), function(err, lights) {
        if (err) throw err;
    });
    num+=1;
}
