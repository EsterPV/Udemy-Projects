const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");

app.use(express.static("public")); //muestra los contenidos de la carpeta public(css e imagenes)
app.use(bodyParser.urlencoded({extended: true})); //parsea los datos que introduce el usuario

app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName; //usando bodyparser recoge los datos introducidos en el formulario
  const lastName = req.body.lName; // input last Name
  const email = req.body.email; //input email

const data = {
  members: [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
  ]
};

const jsonData = JSON.stringify(data);

const secretos = require(__dirname+"/secrets.js")
const request = https.request(secretos.url, secretos.options, function(response){
if(response.statusCode===200){
  res.sendFile(__dirname+"/success.html");
}else{
  res.sendFile(__dirname+"/failure.html");
}

  response.on("data", function(data){
    console.log(JSON.parse(data));
  });

});
request.write(jsonData);
request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
