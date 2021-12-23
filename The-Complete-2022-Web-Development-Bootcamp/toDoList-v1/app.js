const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //pasa la carpeta public (que contiene el css) por el servidor

let items = ["Buy Food", "Eat Food"];
let workItems = [];

app.get("/", function(req, res){
  let today = new Date();
  let currentDay= today.getDay();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

let date = today.toLocaleDateString("en-US", options);

  res.render("list", {
    listTitle: date,
    newListItems: items}
  );
});

app.get("/work", function(req, res){
  res.render("list", {
    listTitle: "Work list",
    newListItems: workItems
  });
});

app.get("/about", function(req, res){
  res.render("about");
});

app.post("/", function(req, res){
  let item =  req.body.newItem;
  if(req.body.button === "Work"){
    workItems.push(item);
    res.redirect("/work");
  }else{
    items.push(item);
    res.redirect("/");
  }



});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
