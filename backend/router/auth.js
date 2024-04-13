const express=require('express');
const jwt=require('jsonwebtoken');
const router =express.Router();
const bcrypt=require('bcryptjs');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
require('../db/conn');
const {auth, isAdmin, isClient}= require("../middleware/auth");

const User= require("../model/User");

router.get('/user',auth,async(req,res)=>{
    try{
        let user=req.user;
        res.status(200).json({success:true, user});
    }catch(e){
        console.log(e);
        res.status(500).json({success:false, error:"Server Error!"});
    }
});

router.post('/signup', async (req,res)=>{
    let {name,email,phone,password,cpassword}=req.body;
    password=password.trim();

    if(!name|| !email || !phone || !password || !cpassword)
    return res.status(422).json({success:false, error:"plzz fiels the field"});


    try {
      const userExist=  await User.findOne({email:email});
        if(userExist){
            return res.status(422).json({success:false, error:"plzz fiels the field"}); 
        }else if(password!=cpassword){
            return res.status(422).json({success:false, error:"plzz fiels the field"}); 
        }else {
            let accountType=req.body.accountType||"Client";
            // console.log(accountType);
            const user= new User({name,email,phone,password, accountType});
            await user.save();
            user.password=null;
            user.tokens=null;
            // console.log(user);
            res.status(201).json({success:true, message:"succesfully registered", user});
        }

    } catch(err){
        console.log(err);
        res.status(500).json({success:false, error:"Server Error"});
    }
});

router.post('/login', async (req,res)=>{
    try{

        //TODO: check if user is already signed in, if yes then then don't generate new token
        

        let {email,password} =req.body;
        password=password.trim();
        if(!email || !password){
            return res.status(401).json({success:false, error:"plzz filled the data"});
        }
        const userLogedIn =await User.findOne({email:email});
        if(userLogedIn){
            const isMatch =await bcrypt.compare(password,userLogedIn.password);
                    
            if(!isMatch){
                console.log("password incorrect");
                return res.status(401).json({success:false, error:"Invalid Credential"});
            }
            else {
                console.log("user logged in successfully");
               

                const token= await userLogedIn.generateAuthToken();
                userLogedIn.password=null;
                userLogedIn.tokens=null;
                return res.cookie("jwtoken",token,{
                    expires:new Date(Date.now()+25892000000),
                    httpOnly: true
                }).status(200).json({success:true, message:"Login successfully","user":userLogedIn});
            }
        }else {
            console.log("Invalid credential");
            res.status(401).json({success:false,  error:"Invalid Credential"});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({success:false, error:"Server Error!"});
    }
})
router.post('/logout' , async (req,res)=>{
    //TODO: if cookies is not expired, then before clearing token from cookie , remove the token from user db
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).json({sucess:true, message:"user logout successfull"});
})

router.get('/preRegistration',auth,(req,res)=>{
    try{
        let user=req.user;
        res.status(200).json({success:true, user});
    }catch(e){
        console.log(e);
        res.status(500).json({success:false, error:"Server Error!"});
    }
});

router.get('/admin',auth,isAdmin,(req,res)=>{
    try{
        let user=req.user;
        res.status(200).json({success:true, user});
    }catch(e){
        console.log(e);
        res.status(500).json({success:false, error:"Server Error!"});
    }
});
router.get('/courseclash',auth,(req,res)=>{
    try{
        let user=req.user;
        res.status(200).json({success:true, user});
    }catch(e){
        console.log(e);
        res.status(500).json({success:false, error:"Server Error!"});
    }
});
router.get('/courses',auth,(req,res)=>{
    try{
        let user=req.user;
        res.status(200).json({success:true, user});
    }catch(e){
        console.log(e);
        res.status(500).json({success:false, error:"Server Error!"});
    }
});
router.get('/announcement',auth,(req,res)=>{
    try{
        let user=req.user;
        res.status(200).json({success:true, user});
    }catch(e){
        console.log(e);
        res.status(500).json({success:false, error:"Server Error!"});
    }
});


module.exports = router;
