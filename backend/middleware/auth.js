const jwt =require("jsonwebtoken");
const User =require("../model/User");


exports.auth = async(req,res,next)=>{
  console.log("req.auth");
    try{
      const token =req.cookies.jwtoken;
      if(!token){
        return res.status(401).json({success:false, error:'Unauthorized:No token Provided'});
      }
      const verifytoken=jwt.verify(token,process.env.SECRET_KEY);

      const  rootUser =await User.findOne({_id:verifytoken._id,"tokens.token":token},{password:0,tokens:0});
      if(!rootUser){
        return res.status(401).json({success:false, error:'Unauthorized:No token Provided'});
      }
      req.user=rootUser;
      next();
    }catch(err){
      console.log(err);
      return res.status(500).json({
        success:false,
        error:'Internal Server Error!'
      });
    }

}


//isStudent
exports.isClient = async (req, res, next) => {
  try{
    if(req.user.accountType !== "Client") {
      return res.status(401).json({
        success:false,
        error:'This is a protected route for Students only',
      });
    }
    next();
  }
  catch(error) {
    return res.status(500).json({
      success:false,
      error:'User role cannot be verified, please try again'
    })
  }
 }
 
 
 //isAdmin
exports.isAdmin = async (req, res, next) => {
  try{    
      if(req.user.accountType !== "Admin") {
        return res.status(401).json({
          success:false,
          error:'This is a protected route for Admin only',
        });
      }
      next();
    }
    catch(error) {
      return res.status(500).json({
        success:false,
        error:'User role cannot be verified, please try again'
      })
  }
}
