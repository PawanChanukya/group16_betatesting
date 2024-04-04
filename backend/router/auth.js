const express=require('express');
const jwt=require('jsonwebtoken');
const router =express.Router();
const bcrypt=require('bcryptjs');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
require('../db/conn');
const {auth}= require("../middleware/auth");

const User= require("../model/User");

router.get('/user',auth,async(req,res)=>{
    try{
        let user=req.user;
        res.status(200).json({user});
    }catch(e){
        console.log(e);
        res.status(500).json({error:"Server Error!"});
    }
});

router.post('/signup', async (req,res)=>{
    let {name,email,phone,password,cpassword}=req.body;
    console.log("password",password);
    password=password.trim();

    if(!name|| !email || !phone || !password || !cpassword)
    return res.status(422).json({error:"plzz fiels the field"});


    try {
      const userExist=  await User.findOne({email:email});
        if(userExist){
            return res.status(422).json({error:"plzz fiels the field"}); 
        }else if(password!=cpassword){
            return res.status(422).json({error:"plzz fiels the field"}); 
        }else {
            let accountType=req.body.accountType||"Client";
            console.log(accountType);
            const user= new User({name,email,phone,password, accountType});//TODO
            await user.save();
            user.password=null;
            console.log(user);
            res.status(201).json({message:"succesfully registered", user});
        }

    } catch(err){
        console.log(err);
        res.status(500).json({error:"Server Error"});
    }
});

router.post('/login', async (req,res)=>{
    try{
        let {email,password} =req.body;
        console.log(email, password);
        password=password.trim();
        if(!email || !password){
            return res.status(400).json({error:"plzz filled the data"});
        }
        const userLogin =await User.findOne({email:email});
        if(userLogin){
            console.log(userLogin.password);
            const isMatch =await bcrypt.compare(password,userLogin.password);
                    
            if(!isMatch){
                console.log(userLogin);
                console.log("password incorrect");
                return res.status(401).json({error:"Invalid Credential"});
            }
            else {
                console.log(userLogin);
                console.log("logged in successful");
                const token= await userLogin.generateAuthToken();
                console.log("Token: ",token);
                return res.cookie("jwtoken",token,{
                    expires:new Date(Date.now()+25892000000),
                    httpOnly: true
                }).status(200).json({message:"Login successfully"});
            }
        }else {
            console.log("Invalid credential");
            console.log(userLogin);
            res.status(401).json({error:"Invalid Credential"});
        }
    }catch(e){
        console.log(err);
        res.status(500).json({"error":"Server Error!"});
    }
})
router.post('/logout' , async (req,res)=>{
        res.clearCookie('jwtoken',{path:'/'});
        res.status(200).send("user logout");
})

router.get('/preregistration',auth,(req,res)=>{
    try{
        let user=req.user;
        res.status(200).json({user});
    }catch(e){
        console.log(e);
        res.status(500).json({error:"Server Error!"});
    }
});
router.get('/courseclash',auth,(req,res)=>{
    try{
        let user=req.user;
        res.status(200).json({user});
    }catch(e){
        console.log(e);
        res.status(500).json({error:"Server Error!"});
    }
});
router.get('/courses',auth,(req,res)=>{
    try{
        let user=req.user;
        res.status(200).json({user});
    }catch(e){
        console.log(e);
        res.status(500).json({error:"Server Error!"});
    }
});
router.get('/announcement',auth,(req,res)=>{
    try{
        let user=req.user;
        res.status(200).json({user});
    }catch(e){
        console.log(e);
        res.status(500).json({error:"Server Error!"});
    }
});


module.exports = router;
