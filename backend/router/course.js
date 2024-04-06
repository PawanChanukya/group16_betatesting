// Import the required modules
const express = require("express")
const router = express.Router()

// Course Controllers Import
const {
    createCourse,
    getAllCourses,
    deleteCourseById,
    updateCourseById
  } = require("../controller/course");

  
// Importing Middlewares
const { auth,isClient, isAdmin} = require("../middleware/auth")


router.post("/createCourse", auth, isAdmin,createCourse)
router.get("/getAllCourses", auth, getAllCourses)
router.delete("/deleteCourseById/:id",auth, isAdmin,deleteCourseById)
router.post("/updateCourseById/:id",auth, isAdmin, updateCourseById);


module.exports = router;