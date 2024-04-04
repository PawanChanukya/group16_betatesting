const jwt =require("jsonwebtoken");
const User =require("../model/User");


exports.auth = async(req,res,next)=>{
    try{
      const token =req.cookies.jwtoken;
      const verifytoken=jwt.verify(token,process.env.SECRET_KEY);

      const  rootUser =await User.findOne({_id:verifytoken._id,"tokens.token":token},{password:0,tokens:0});
      if(!rootUser){
        throw new Error('User not Found');
      }
      req.user=rootUser;
      next();
    }catch(err){
       res.status(401).send('Unauthorized:No token Provided');
       console.log(err);
    }

}


//isStudent
exports.isClient = async (req, res, next) => {
  try{
    if(req.user.accountType !== "Client") {
      return res.status(401).json({
        success:false,
        message:'This is a protected route for Students only',
      });
    }
    next();
  }
  catch(error) {
    return res.status(500).json({
      success:false,
      message:'User role cannot be verified, please try again'
    })
  }
 }
 
 
 //isAdmin
exports.isAdmin = async (req, res, next) => {
  try{    
      console.log("Printing AccountType ", req.user.accountType);
      if(req.user.accountType !== "Admin") {
        return res.status(401).json({
          success:false,
          message:'This is a protected route for Admin only',
        });
      }
      next();
    }
    catch(error) {
      return res.status(500).json({
        success:false,
        message:'User role cannot be verified, please try again'
      })
  }
}
