const mongoose=require('mongoose');
const Course=require("../model/Course");
const User=require("../model/User");

exports.addCourse=async(req,res)=>{
    const {courseId}=req.body;
    const userId=req.user._id;
    try{
        //find the course and enroll the student in it
        const course=await Course.findById(courseId);
        console.log("Course: ", course);
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
            return res.status(400).json({"error":"user id is missing!"});
        }
        const userCourse=await User.findOne({_id},{course:1}).populate('courses').populate({
            path: 'courses',
            populate: { path: 'timing'}
        }).exec();
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

exports.dropCourseById=async(req, res)=>{
    try{
        let courseId=req.params.id;
        if(!courseId){
            return res.status(400).json({"error":"course id is missing!"});
        }
        courseId= new mongoose.Types.ObjectId(courseId);
         //find the course and unenroll the student from it
         const course=await Course.findById(courseId);
         console.log("Course: ", course);
         if(!course){
             return res.json({
                 success:false,
                 message:"could not find the course!"
             });
        }
        const updatedCourse=await Course.findByIdAndUpdate(courseId,
            {
                $pull:{
                    studentsEnrolled:req.user._id
                }
            },
            {
                new:true
            }
        );
        console.log(updatedCourse);

        // remove course from student db
        const updatedUser=await User.findByIdAndUpdate(req.user._id,
            {
                $pull:{
                    courses:courseId
                }
            },
            {
                new:true
            }
        );
        console.log("updated user",updatedUser);
        res.status(200).json({success:true,message:"course has been successfully dropped!"});
    }catch(err){
        console.log(err.message);
        res.status(500).json({success:true, message:"Internal Server Error!"});
    }
}

exports.getAllUser=async(req, res)=>{
    const email=req.body.email;
    const allUser=await User.find({email},{tokens:1});
    res.status(200).json({success:true, allUser});
}
