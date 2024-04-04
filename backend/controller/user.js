const mongoose=require('mongoose');
const Course=require("../model/Course");
const User=require("../model/User");

exports.addCourse=async(req,res)=>{
    const {courseId}=req.body;
    const userId=req.user._id;
    try{
        const course=await Course.findById(courseId);
        if(!course){
            return res.json({
                success:false,
                message:"could not find the course!"
            });
        }

        //user already registered for the course
        const uid= new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid) ){
            return res.status(409).json({
                success:false,
                message:"Student is already enrolled"
            });
        }

        //find the course and enroll the student in it
        course.studentsEnrolled.push(userId);
        const enrolledCourse=await course.save();

        console.log(enrolledCourse);


        //find student and add the course in list of enrolled course
        const enrolledStudent=await User.findOne({_id:userId})
        enrolledStudent.courses.push(courseId);
        await enrolledStudent.save();
        console.log(enrolledStudent);

        return res.status(200).json({
            success:true,
            message:"course added!"
        });
    }catch(err){
        console.log(err)
        return res.json({
        success:false,
        message:err.message
        });
    }
}

exports.getUserCourseById=async(req, res)=>{
    try{
        let _id=req.user._id;
        if(!_id){
            return res.status(400).json({"error":"course id is missing!"});
        }
        const userCourse=await User.findOne({_id},{course:1}).populate('courses');
        if(userCourse){
            res.status(200).json({"userCourse":userCourse.courses});
        }else{
            res.status(404).json({"error":`User not found with id ${_id}`});
        }
       
    }catch(e){
        console.log(e);
        res.status(500).json({"error":"server error!"});
    }
}

