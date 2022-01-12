const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname+"/date.js");


const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //pasa la carpeta public (que contiene el css) por el servidor

const secrets = require(__dirname+"/secrets.js");



const itemSchema = {
  name: String
};

const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
  name: "Welcome to your todo list!"
});
const item2 = new Item({
  name: "Hit the button + to add a new item"
});
const item3 = new Item({
  name: "<---- hit this to deleten an item"
});

const defaultItems = [item1, item2, item3];



app.get("/", function(req, res){

Item.find({}, function(err, foundItems){

  if(foundItems.length === 0){ //siempre que la db esté vacía muestro los defaultItems
    Item.insertMany(defaultItems, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Succesfully saved ");
      }
    });
    res.redirect("/"); //una vez que lee el if redirige la info al inicio de este app.get y cae en el else
                        //ya que la db ya no está vacía
  }else{
    res.render("list", { listTitle: "Today", newListItems: foundItems});
  }


});

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
  const itemName= req.body.newItem;
  const item = new Item({
    name: itemName
  });

  item.save(); //añado un nuevo item a la db
  res.redirect("/"); //lo renderizo en el home de mi web
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log("Succesfully remove");
      res.redirect("/");
    }
  })
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("Server has started Succesfully");
});
