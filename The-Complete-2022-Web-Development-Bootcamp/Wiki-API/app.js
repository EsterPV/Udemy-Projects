const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express(); //creamos una nueva app instantáneamente gracias a express

app.set("view engine", "ejs"); //configuramos motor de vista para usar ejs

app.use(bodyParser.urlencoded({ //bodyparser para parsear las solicitudes de la app
  extended:true
}));

app.use(express.static("public")); //usamos el directorio publico para almacenar nuestros archivos estáticos como imágenes y codigo


mongoose.connect("mongodb://localhost:27017/wikiDB", //conectamos con la base de datos wikiDB usando mongoose
{useNewUrlParser: true}); // useNewUrlParser sirve para manejar los errores que mongodb suele arrojar

const articleSchema = {
  title: String,
  content: String
}; // el esquema de cada documento dentro de nuestra coleccion articles

const Article = mongoose.model("Article", articleSchema);

/////////////////solicitudes dirigidas a todos los artículos/////////////////////
app.route("/articles")
.get(function(req, res){ //Muestra todo el contenido de la base de datos en la direccion /articles
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})

.post(function(req, res){ //Añade nuevo contenido a la base de datos usando Postman
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
newArticle.save(function(err){
  if (!err){
    res.send("Succesfully added a new article");
  }else{
    res.send(err);
  }
});
})

.delete(function(req, res){ //elimina TODO el contenido de la coleccion
  Article.deleteMany(function(err){
    if(!err){
      res.send("Succesfully deleted all articles");
    }else{
      res.send(err);
    }
  })
});

/////////////////solicitudes dirigidas a un artículo específico/////////////////////
app.route("/articles/:articleTitle")
.get(function(req, res){ //busca un articulo por su titulo
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticles){
    if(foundArticles){
      res.send(foundArticles);
    }else{
      res.send("No articles match");
    }
  });
})

.put(function(req, res){ //modifica un articulo segun el titulo
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {upsert: true},
    function(err){
      if(!err){
        res.send("Succesfully updated!")
      }else{
        res.send(err);
      }
    }
  )
})

.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Succesfully updated!");
      }else{
        res.send(err);
      }
}
)
})

.delete(function(req, res){ //elimina un solo articulo de la coleccion
  Article.deleteOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err){
      if(!err){
        res.send("Succesfully deleted!");
      }else{
        res.send(err);
      }
    }
  )
});


app.listen(3000, function(){ //conectado al puerto 3000
  console.log("Server started on port 3000");
});
