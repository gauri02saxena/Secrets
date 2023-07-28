require("dotenv").config();
const express= require("express");
const ejs=require("ejs")
const bodyParser= require("body-parser");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const saltRounds= 10;

// const md5=require("md5");
// const encrypt=require("mongoose-encryption");

const app=express();


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true, useUnifiedTopology:true});

const userSchema= new mongoose.Schema ({
    email: String,
    password: String
});


// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User= mongoose.model("User", userSchema);


app.get("/", function(req,res)
{
    res.render("home");
});

app.get("/login", function(req,res)
{
    res.render("login");
});

app.get("/register", function(req,res)
{
    res.render("register");
});

app.post("/register", function(req,res)
{

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            const newUser= new User({
                email:req.body.username,
                password:hash
            });
        
            newUser.save()
            .then(()=>{res.render("secrets")})
            .catch((err)=>console.log(err));


        });
    });

   
});

app.post("/login", function(req,res)
{
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username})
    .then((foundUser)=>{
        bcrypt.compare(password, foundUser.password, function(err, result) {
            if(result===true)
            {
                res.render("secrets");
            }
    });


        
    })
    .catch((err)=>console.log(err));


});

app.listen(3000,function(){
    console.log("Server started on port 3000");
});