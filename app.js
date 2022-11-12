require("dotenv").config();
require("./config/database").connect();

const User = require("./model/user");
const auth = require('./middleware/auth');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyPaser = require('body-parser');
const express = require('express');
const { json } = require("body-parser");
const app = express();

app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({extended: false}));

app.post('/register', async (req, res) => {
    try {
        const {first_name, last_name, email, password} = req.body;
        if(!first_name || !last_name || !email || !password){
            res.status(400).send("All data is required");
            return ;
        }

        const oldUser = await User.findOne({email});
        if(oldUser){
            res.status(409).send("Duplicate user is already existed");
            return ;
        }

        const ecryptPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            first_name,
            last_name,
            email,
            password: ecryptPassword
        });
        const token = jwt.sign({user_id: user._id, email: email}, process.env.SECURITY_KEY, {expiresIn: 10});
        user.token = token;
        res.status(200).json(user);
    } catch(err) {
        console.log(err);
    }
})

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    if(!(email && password)){
        res.status(400).send("All data is required");
        return ;
    }

    const user = await User.findOne({email});
    if(!user){
        res.status(409).send("This account doesn't exist. Please register.");
        return ;
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if(passwordCorrect){
        const token = jwt.sign({user_id: user._id, email}, process.env.SECURITY_KEY, {expiresIn: 30});
        user.token = token;
        res.status(200).send(user);
    }
    else res.status(201).send("Password is incorrect");
});

app.post('/welcome', auth, (req, res) => {
    res.status(200).send("Welcome");
})

module.exports = app;