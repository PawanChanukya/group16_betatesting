// Import the required modules
const express = require("express")
const router = express.Router()

// Course Controllers Import
const {
    addCourse,
    getUserCourseById,
    dropCourseById,
    getAllUser
  } = require("../controller/user");
  
// Importing Middlewares
const { auth,isClient} = require("../middleware/auth");
const User = require("../model/User");


router.post("/addCourse", auth, isClient,addCourse)
router.post("/getUserCourseById", auth,getUserCourseById)
router.put("/dropCourse/:id",auth,dropCourseById);

router.get("/getAllUser",getAllUser);
router.delete("/deleteUserById/:id",async (req,res)=>{
  const deletedUser=await User.findByIdAndDelete(req.params.id);
  res.status(204).json({sucess:true, deletedUser});
})

module.exports = router;