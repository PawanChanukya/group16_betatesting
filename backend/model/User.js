const mongoose =require('mongoose');
const bcrypt =require('bcryptjs');
const jwt =require('jsonwebtoken');
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        enum:['Admin','Client'],
        required:true
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }],
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ]
})

userSchema.pre("save", async function (next) {
  
    if (!this.isModified('password')) {
      return next();
    }
  
    try {
      const saltRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, saltRound);
      this.password = hashedPassword;
    } catch (error) {
      return next(error);
    }
    next();
  });
userSchema.methods.generateAuthToken =async function(){
    try{
        if(this.tokens.length>=3){
            this.tokens.shift();
        }
        let token =jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(err){
        console.log(err);
    }
};


const User =mongoose.model('User',userSchema);
module.exports=User;
