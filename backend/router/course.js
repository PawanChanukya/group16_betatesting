// Import the required modules
const express = require("express")
const router = express.Router()

// Course Controllers Import
const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    deleteCourseById,
  } = require("../controller/course");

  
// Importing Middlewares
const { auth,isClient, isAdmin} = require("../middleware/auth")


router.post("/createCourse", auth, isAdmin,createCourse)
router.get("/getAllCourses", getAllCourses)
router.delete("/deleteCourseById/:id",auth, isAdmin,deleteCourseById)


module.exports = router;