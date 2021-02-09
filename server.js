const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const date = require(__dirname + "/generateDate.js");
const app = express();

app.use(express.static('public'));
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost:27017/phoneDB', {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const bookSchema = new mongoose.Schema({
    nameUser: String,
    number: String
});

const User = new mongoose.model('User', userSchema);
const Book = new mongoose.model('Book', bookSchema);

let toDoList = [];

app.get('/',(req, res) => {
    res.render('home');
});
app.get('/register',(req,res) =>{
    res.render('register');
});
app.post('/register',(req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save((error)=>{
        if(error){
            console.log(error);
        }else{
            let day = date.getDate();
            let weekday = date.getWeekDay();
            console.log(day);
            Book.find((error, books) => {
                if(!error){
                    res.render("index.ejs", {date: day, toDoItems: books});
                } else {
                    console.log("Failed to retireve data: ", error);
                }
            });
        }
    });
});
app.get('/login',(req,res)=> {
    res.render('login');

});
app.post('/login',(req,res)=> {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({
        email: userName,
        password: password
    },(error, userFound)=>{
        if(error){
            console.log(error);
        }else{
            if(userFound){
                let day = date.getDate();
                let weekday = date.getWeekDay();
                console.log(day);
                Book.find((error, books) => {
                    if(!error){
                        res.render("index.ejs", {date: day, toDoItems: books});
                    } else {
                        console.log("Failed to retireve data: ", error);
                    }
                });
            }else{
                res.render('login');
            }
        }
    });
});

app.get("/i",(req,res)=> {
    let day = date.getDate();
    let weekday = date.getWeekDay();
    console.log(day);
    Book.find((error, books) => {
        if(!error){
            res.render("index.ejs", {date: day, toDoItems: books});
        } else {
            console.log("Failed to retireve data: ", error);
        }
    });
});

app.get("/login",(req,res)=> {
    res.render("about.ejs");
});



app.post("/i", (req,res)=> {
    const newBook = new Book({
        nameUser: req.body.Fname,
        number: req.body.Pnumber
    });
    newBook.save((error)=>{
        if(error){
            console.log(error);
        }else{
            
            res.redirect("/i");
        }
    });
    

});

exports.deleteItem = (req, res) => {
    console.log("Call from delete", req.body.checkbox);
    const checkedItemId = req.body.checkbox;
    Task.findByIdAndRemove(checkedItemId, function(error) {
        if(!error){
            console.log("Successfully deleted the item.");
            res.redirect("/i");            
        } else {
            console.log(error);
        }
    });

}

app.listen(5000, ()=>{
    console.log("Server is running on port 5000");
});