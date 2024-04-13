const dotenv=require('dotenv');
const mongoose=require('mongoose');
const express =require('express');
const cors=require('cors');
const cookieParser = require('cookie-parser');
const app=express();

dotenv.config({path:'./config.env'});
require('./db/conn');


app.use(cors({
    origin:"http://localhost:3000",
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
    credentials: true 
}));


app.use(cookieParser());

app.use(express.json());

app.use(require('./router/auth'));
app.use(require("./router/course"));
app.use(require("./router/user"));
const PORT=process.env.PORT;


app.listen(PORT,()=>{
    console.log(`server is running at no ${PORT}`);
})