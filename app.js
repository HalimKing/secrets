//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require('bcrypt');

const saltRounds = 10;



const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



const User = new mongoose.model("User",userSchema);

app.get("/", function(req,res){
    res.render("home");
})


app.get("/login", function(req,res){
    res.render("login");
});
app.post("/login", function(req, res){
    const userName = req.body.username;
    const password = req.body.password;
    User.findOne({email: userName})
    .exec()
    .then((result)=>{
        if(result){
            bcrypt.compare(password, result.password, function(err, results) {
                if(results === true){
                    res.render("secrets")
                }
            });
            
        }
    })
    .catch((err)=>{
        console.log(err);
    });
})


app.get("/register", function(req,res){
    res.render("register");
})


app.post("/register", function(req,res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const userName = req.body.username;
        const password = hash;
        const newUser = User({
            email: userName,
            password: password
        });
       
        newUser.save();
        
        res.redirect("/secrets");
    });
    
});

app.get("/secrets", function(req,res){
    res.render("secrets");
})


app.listen(3000, function(){
    console.log("Server is running on port 3000");
})
