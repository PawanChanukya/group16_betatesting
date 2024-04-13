const mongoose=require('mongoose');
const Course=require("../model/Course");
const User=require("../model/User");
const TimeTable=require("../model/TimeTable");

//createCourse handler function
exports.createCourse=async(req,res)=>{
    try{
        //fetch data
        const{
            courseId,
            courseName,
            credits,
            branch,
            timing,
            instructor,
            status
        }=req.body;
        console.log(courseId,
            courseName,
            credits,
            branch,
            timing,
            instructor,
            status)
        //validation
        if(!courseName || !credits || !courseId || !branch || !timing || !status){
            return res.status(400).json({
                success:false,
                message:"All feilds are required,"
            });
        }
        //creating time table 
        let arr=timing.split(',')
        const timeTable=[];
        for(let element of arr){
            element=element.trim();
            
            let day=element.split(" ")[0].trim();
            let startTime=element.split(" ")[1].split('-')[0].trim();
            let endTime=element.split(" ")[1].split('-')[1].trim();
            let newTimeTable= await TimeTable.create({
                day,
                startTime,
                endTime
            })
            timeTable.push(newTimeTable);
        }
       const newCourse=await Course.create({
            courseId,
            courseName,
            credits,
            instructor,
            branch,
            timing:timeTable.map((t)=>(t._id)),
            status
        });
        //add the new course to time table
        for(let t of timeTable){
            t.course=newCourse._id;
            t.save();
        }
        //return response
        return res.status(200).json({
            success:true,
            message:"Course created successfully!",
            data:newCourse
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Failed to create course!",
            error:err.message,
        });
        
    }
}

//getAllCourses handler function...........................
exports.getAllCourses=async (req,res)=>{
    try{
        const allCourses=await Course.find({},{
            studentsEnrolled:0,
            __v:0
        }).populate('timing').
        exec();

        return res.status(200).json({
            success:true,
            message:"Data fetched successfully!",
            allCourses
        });

    }catch(err){
        return res.json({
            success:false,
            message:"Can't fetch course data",
            error:err.message,
        });
    }
}


exports.deleteCourseById=async(req,res)=>{
    try{
        let id=req.params.id;
        if(!id){
            return res.status(400).json({"error":"course id is missing!"});
        }
        let deletedCourse=await Course.findByIdAndDelete({_id:id});
        if(deletedCourse){
            console.log(deletedCourse);
            let timeTableIds=deletedCourse.timing;
            let studentsEnrolledIds=deletedCourse.studentsEnrolled;
            
            if(studentsEnrolledIds)
                for(let _id of studentsEnrolledIds){
                    await User.findByIdAndUpdate(
                        _id,
                        {
                            $pull:{courses:deletedCourse._id}
                        }
                    )
                }

            if(timeTableIds)
                for(let _id of timeTableIds)
                    await TimeTable.findByIdAndDelete(_id);
                

            res.status(204).json({"message":"Successfully deleted"});
        }else{
            res.status(404).json({"error":`course not found with id ${id}`});
        }
        
    }catch(e){
        console.log(e);
        res.status(500).json({"error":"server error!"});
    }
}

exports.updateCourseById=async(req, res)=>{
    try{
        const id=req.params.id;
        if(!id){
            return res.status(400).json({
                success:false,
                message:"course id is missing!"
            });
        }
        //fetch data
        const{
            courseId,
            courseName,
            credits,
            branch,
            timing,
            instructor,
            status
        }=req.body;

        //validation
        if(!courseName || !instructor || !credits || !courseId || !branch || !timing || !status){
            return res.status(400).json({
                success:false,
                message:"All feilds are required,"
            });
        }
        
        const course=await Course.findOne({_id:id});
        
        if(!course){
            return res.status(400).json({
                success:false,
                message:"course not found !"
            });
        }
        const prevTimeTable=course.timing;

        //creating time table 
        console.log(timing);
        let arr=timing.split(',')
        const timeTable=[];
        for(let element of arr){
            element=element.trim();
            
            let day=element.split(" ")[0].trim();
            let startTime=element.split(" ")[1].split('-')[0].trim();
            let endTime=element.split(" ")[1].split('-')[1].trim();
            let newTimeTable= await TimeTable.create({
                day,
                startTime,
                endTime
            })
            timeTable.push(newTimeTable);
        }

        const deletedTimeTable=await TimeTable.deleteMany({ _id: { $in: prevTimeTable } });
        // console.log(timeTable)
        // console.log(deletedTimeTable);
        course.courseId=courseId;
        course.courseName=courseName;
        course.branch=branch;
        course.instructor=instructor;
        course.timing=[]
        course.status=status;
        course.credits=credits;
        const updatedCourse=await Course.findByIdAndUpdate(course._id,
            {
                $push:{
                    timing:timeTable.map((t)=>(t._id))
                }
            },
            {
                new:true
            }
        )
        // console.log(updatedCourse)
        res.status(200).json({success:false,message:"course updated successfully", updatedCourse:course})

    }catch(err){
        res.status(500).json({success:false,error:"server error!"})
    }
}
