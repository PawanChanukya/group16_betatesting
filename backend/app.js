const dotenv=require('dotenv');
const mongoose=require('mongoose');
const express =require('express');
const cors=require('cors');//TODO
const cookieParser = require('cookie-parser');//TODO
const app=express();

dotenv.config({path:'./config.env'});
require('./db/conn');

// Middleware to handle CORS
app.use(cors({//TODO
    origin:"http://localhost:3000",
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
    credentials: true 
}));

// Middleware to handle CORS
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // Replace with your frontend's origin
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials
//     next();
//   });
  
//   // Preflight request handling
//   app.options('*', (req, res) => {
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.status(200).end();
//   });

app.use(cookieParser());//TODO

app.use(express.json());

app.use(require('./router/auth'));
app.use(require("./router/course"));
app.use(require("./router/user"));
const PORT=process.env.PORT;


// app.get('/',(req,res)=>{
//     res.send("Hello World");
// });



app.listen(PORT,()=>{
    console.log(`server is running at no ${PORT}`);
})