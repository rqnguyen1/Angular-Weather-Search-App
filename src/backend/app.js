const express = require('express');
const app = express();
const urlencode = require('urlencode');
const request = require('sync-request')
const https = require('https');

const PORT = process.env.PORT || 8080;

app.set('port', PORT);
const server = https.createServer(app);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

forecastAPIkey = "867924d1d2f24523faa389acd833851a";
googleAPIkey = "AIzaSyDtUJvYsprcnqn7-AkWkxeN6Hu8QX3kSJ4";
searchEngineID = "008016494828327990319:ccodh8uvzav";


app.get('/weather', (req, res) => {

    try
    {
        res.setHeader("Access-Control-Allow-Origin","*");
        res.setHeader("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATH, DELETE, OPTIONS");
        var street = req.query.street;
        var city = req.query.city;
        var state = req.query.state;
        var lat = req.query.lat;
        var lng = req.query.lng;
        
        if (!lat && !lng)
        {
            var geocodeJson = request("GET", "https://maps.googleapis.com/maps/api/geocode/json?address="
                +urlencode(street) + "," + urlencode(city) + "," + urlencode(state) + "&key=" + googleAPIkey,{JSON: true});
            geocodeJson = JSON.parse(geocodeJson.getBody());
            lat = geocodeJson.results[0].geometry.location.lat;
            lng = geocodeJson.results[0].geometry.location.lng;
        }
        
        var forecastJson = request("GET","https://api.darksky.net/forecast/"+ forecastAPIkey + "/" + urlencode(lat) + "," + urlencode(lng),{JSON: true});
        forecastJson = JSON.parse(forecastJson.getBody());
        
        var customSearchJson = request("GET","https://www.googleapis.com/customsearch/v1?q="+state+"%20State%20Seal&cx="+searchEngineID+"&imgSize=huge&imgType=photo&num=1&searchType=image&key=AIzaSyDtUJvYsprcnqn7-AkWkxeN6Hu8QX3kSJ4",{JSON: true});
        customSearchJson = JSON.parse(customSearchJson.getBody());

        var combinedJson = {forecast: forecastJson, customSearch: customSearchJson};
        
        console.log(forecastJson);
        console.log(customSearchJson);
        res.write(JSON.stringify(combinedJson));
        res.end();
    }

    catch (err)
    {
        console.log("There was an error!");
        res.send(JSON.stringify("error"))
    }

  });


  app.get('/modalData', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATH, DELETE, OPTIONS");

    var time = req.query.time;
    var street = req.query.street;
    var city = req.query.city;
    var state = req.query.state;
    var lat = req.query.lat;
    var lng = req.query.lng;

    if (lat == "null" && lng == "null")
    {
        var geocodeJson = request("GET", "https://maps.googleapis.com/maps/api/geocode/json?address="
            +urlencode(street) + "," + urlencode(city) + "," + urlencode(state) + "&key=" + googleAPIkey,{JSON: true});
        geocodeJson = JSON.parse(geocodeJson.getBody());
        lat = geocodeJson.results[0].geometry.location.lat;
        lng = geocodeJson.results[0].geometry.location.lng;
    }

    var modalJson = request("GET","https://api.darksky.net/forecast/"+ forecastAPIkey + "/" + urlencode(lat) + "," + urlencode(lng) + "," +urlencode(time),{JSON: true});
    modalJson = JSON.parse(modalJson.getBody());

    res.send(modalJson);

  });

  app.get('/autoComplete', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATH, DELETE, OPTIONS");

    var city = req.query.city;

    var autoCompleteJson = request("GET","https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+urlencode(city)+"&types=(cities)&language=en&key="+ "AIzaSyBVes5oRqjQdL6tok8DQ62Up-Z65_uXd2g",{JSON: true});
    autoCompleteJson= JSON.parse(autoCompleteJson.getBody());
    
    res.send(autoCompleteJson);
    });
  
  app.get('/', function (req, res) {
    res.send("You are connected to the Node.js server!")
  });


