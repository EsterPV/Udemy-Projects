const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
  res.sendFile(__dirname+"/index.html");
});

app.post("/", function(req, res){
  var num1 =Number(req.body.num1); //num1 es el name de mi input en el html
  var num2 = Number(req.body.num2);
  var result = num1 + num2;

  res.send("The result is "+ result);
});

app.get("/bmiCalculator", function(req, res){
  res.sendFile(__dirname+"/bmiCalculator.html");
});

app.post("/bmiCalculator", function(req, res){
  var peso = Number(req.body.peso);
  var altura = Number(req.body.altura);
  var resultado = peso/Math.pow(altura, 2);

  res.send("El resultado es " + resultado);
});


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
