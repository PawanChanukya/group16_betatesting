// Import the required modules
const express = require("express")
const router = express.Router()

// Course Controllers Import
const {
    addCourse,
    getUserCourseById
  } = require("../controller/user");
  
// Importing Middlewares
const { auth,isClient} = require("../middleware/auth")


router.post("/addCourse", auth, isClient,addCourse)
router.post("/getUserCourseById", auth,isClient,getUserCourseById)

module.exports = router;