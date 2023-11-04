//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");



const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] })

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
            if(result.password === password){
                res.render("secrets");
            }else{
                
            }
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
    const userName = req.body.username;
    const password = req.body.password;
    const newUser = User({
        email: userName,
        password: password
    });
   
    newUser.save();
    
    res.redirect("/secrets");
});

app.get("/secrets", function(req,res){
    res.render("secrets");
})


app.listen(3000, function(){
    console.log("Server is running on port 3000");
})
