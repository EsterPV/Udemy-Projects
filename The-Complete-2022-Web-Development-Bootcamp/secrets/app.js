//jshint esversion:6
require('dotenv').config(); //llama y configura el modulo dotenv para poder crear variables de entorno en un archivo .env
// process.env.SECRET es una variable de entorno guardada en el archivo .env que contiene mi clave de encriptado
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// /////////////level 1 and 2 encryption ///////////
// // const encrypt = require("mongoose-encryption"); //llamo el modulo npm de encriptado mongoose
// ////////level 3 encryption: Hash function /////////
// const md5 = require("md5"); //llamo al modulo md5  para crear funciones hash
// ///////level 4 salting and hashin passwords //////////
// const bcrypt = require("bcrypt");//llamo al modulo bcrypt para "salar" las passwords
// const saltRounds = 10; //cantidad de "sal" que va a tener la password
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');


const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.SECRET_II,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB",
{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String
});



userSchema.plugin(passportLocalMongoose); //añadimos a nuestra schema el plugin passportLocalMongoose que sirve para encriptar (hash y salt) las contraseñs y guardar los usuarios en la base de datos
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
///////////level 1 and 2 encryption /////////////
// userSchema.plugin(encrypt, { secret: process.env.SECRET, //paso la clave de encriptado que está guardada en la variable de entorno SECRET en el archivo .env
//   encryptedFields: ["password"]  }); //encripto solo la contraseña



app.get("/", function(req, res){
  res.render("home");
});

app.get("/auth/google",
passport.authenticate("google", {scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secrets page.
    res.redirect('/secrets');
});


app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/secrets", function(req, res){
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if(err){
      console.log(err);
    }else{
      if(foundUsers){
        res.render("secrets", {userWithSecrets: foundUsers});
      }
    }
  })
});

app.get("/submit", function(req, res){
  if(req.isAuthenticated()){
    res.render("submit");
  }else{
    res.redirect("/login");
  }
});

app.post("/submit", function(req, res){
  const submittedSecret = req.body.secret;

  User.findById(req.user.id, function(err, foundUser){
    if(err){
      console.log(er);
    }else{
      if(foundUser){
        foundUser.secret=submittedSecret;
        foundUser.save(function(){
          res.redirect("/secrets");
        });
      }
    }
  });
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res){
  // ///////////level 4 salting and hashing passwords/////////////
  // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
  //   const newUser = new User({
  //     email: req.body.username,
  //     // /////////level 3 hash function//////////
  //     // password: md5(req.body.password) //uso la funcion hash md5 para convertir la contraseña en un hash irreversible
  //     //////level 4 ///////////
  //     password: hash
  //   });
  //   newUser.save(function(err){
  //     if(err){
  //       console.log(err);
  //     }else{
  //       res.render("secrets")
  //     }
  //   })
  // });

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req,res, function(){
        res.redirect("/secrets");
      });
    }
  });


});

app.post("/login", function(req, res){
  // const username = req.body.username;
  // // /////////level 3 hash function//////////
  // // const password = md5(req.body.password);//necesito comprobar que la contraseña hash es igual
  // ///////level 4 salting and hashing/////////
  // const password = req.body.password;
  //
  // User.findOne({email: username}, function(err, foundUser){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     if(foundUser){
  //       ////////////level 4///////////////
  //       bcrypt.compare(password, foundUser.password, function(err, result) {
  //           if(result === true){
  //             res.render("secrets");
  //           }
  //         });
  //         //////level 3 hash function///////
  //       // if(foundUser.password === password){
  //       //   res.render("secrets");
  //       // }
  //     }
  //   }
  // });
const user = new User({
  username: req.body.username,
  password: req.body.password
});

req.login(user, function(err){
  if(err){
    console.log(err);
  }else{
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secrets");
    });
  }
});

});


app.listen(3000, function(){
  console.log("Server started on port 3000");
});
