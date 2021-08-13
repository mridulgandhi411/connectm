//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static(__dirname + '/assets'));

app.use(session({
    secret: "jai shree ram.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/connectDB",{useNewUrlParser:true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req,res){
    if(req.isAuthenticated()){
        res.redirect("/home");
    }
    else{
        res.render("home");
    }
});

app.get("/home", function(req,res){
    if(req.isAuthenticated()){
        res.render("index");
    }
    else{
        res.redirect("/login");
    }
});
app.get("/profile", function(req,res){
    if(req.isAuthenticated()){
        res.render("profile");
    }
    else{
        res.redirect("/login");
    }
});
app.get("/table", function(req,res){
    if(req.isAuthenticated()){
        res.render("table");
    }
    else{
        res.redirect("/login");
    }
});
app.get("/login", function(req,res){
    res.render("login");
});
app.get("/register", function(req,res){
    res.render("register");
});
app.get("/forgot-password", function(req,res){
    res.render("forgot-password");
});
app.get("/404", function(req,res){
    res.render("404");
});
app.get("/blank", function(req,res){
    res.render("blank");
});

app.post("/login", function(req, res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err){
        if(err){
            console.log(err);
            res.redirect("/login");
        }
        else{
            passport.authenticate("local")(req, res , function(){
                res.redirect("/home");
            });
        }
    });
});

app.post("/register", function(req, res){
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/home");
              });
        }
    });
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
  });

app.get('*', function(req, res){
    res.render("page_not_found");
});

app.listen(3000, function(){
    console.log("Server started at port 3000");
});
