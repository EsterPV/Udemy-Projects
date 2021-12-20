const express = require("express"); //creo un servidor express
const https = require("https");
const bodyParser = require("body-parser"); //paquete para parsear el contenido de body en html

const app = express(); //lo almaceno en la constante app
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){ //mando el mensaje a localhost:3000/
  res.sendFile(__dirname + "/index.html"); //mando mi html al servidor

});

app.post("/", function(req, res){
  console.log(req.body.cityName); //reclamo el input de mi html
  console.log("Post recibido");
  const query = req.body.cityName; //cada vez que el usuario meta una ciudad en el html
  const apiKey ="e0b393110f6a810772405bbfb8462a26";
  const url ="https://api.openweathermap.org/data/2.5/weather?q="+query+"&APPID="+apiKey;

  https.get(url, function(response){
    console.log(response.statusCode); //comprobamos el estado de la conexion

    response.on("data", function(data){
      const weatherData=JSON.parse(data); //parseamos el JSON del API
      const tempData = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
      res.write("<h1>The temperature in " +query+ " is "+Math.round((tempData-273), 2) + " degree Celsius</h1>");
      res.write("The weather is currently "+ weatherDescription);
      res.write("<br><img src= "+iconURL+"></br>");
      res.send();
    });

    // const object ={
    //   name: "Ester",
    //   food: "Pizza"
    // }
    // console.log(JSON.stringify(object));
  });
});



app.listen(3000, function () { //mando mi app al puerto 3000
  console.log("Server is running in port 3000");
});
