const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app =express();
const User = require('./models/user');
const ejs = require('ejs');
const session = require('express-session');


// mongoose.connect('mongodb://localhost:27017/testApp',{useNewUrlParser:true})

// .then(()=>{

//     console.log('Mongo  connection open');

// })
// .catch(err=>{
//     console.log('Oh no error !!');
//     console.log(err);

// })

require('dotenv').config();
const dbUrl =process.env.DB_URL
console.log(dbUrl)

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
      console.log("MONGO CONNECTION OPEN!!!")
  })
  .catch(err => {
      console.log("OH NO MONGO CONNECTION ERROR!!!!")
      console.log(err)
  })

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: 'notgetguesseasy', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
  }));
  


app.get('/',(req,res)=>{
    res.render('welcome');
    
})
app.get('/register',(req,res)=>{
    res.render('register');

})
app.post('/register',async (req,res)=>{
//    res.render('register');
//     res.send(req.body);
    const {username,password,email,confirmPassword} = req.body;
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }
    const user = new User ({username,email,password,confirmPassword})
    await user.save();
    // req.session.user_id = user._id;
    req.session.user_id = user._id;
    res.redirect('/');


})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/front');
    }
    else {
        res.redirect('login')
    }
})
app.get('/front',(req,res)=>{
    res.render('front');

})
app.get('/workshop',(req,res)=>{
    res.render('workshop')
})
app.get('/training',(req,res)=>{
    res.render('training')
})
app.get('/logistic',(req,res)=>{
    res.render('logistic')
})
app.listen(3000,()=>{
    console.log('connected on port 3000');

})


