const mongoose=require("mongoose");

const courseSchema=new mongoose.Schema({
    courseId:{
        type: String,
        trim: true,
        required: true
    },
    courseName:{
        type:String,
        trim:true,  
    },
    credits:{
        type:Number,
        required: true
    },
    instructor:{
        type:String,
        trim:true, 
    },    
    branch:{
        type:String,
        trim:true, 
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }
    ],
    timing:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"TimeTable",
            required:true,
        }
    ] ,
    status:{
        type:String,
        require: true,
        default: "Active"
    }

});

module.exports=mongoose.model("Course",courseSchema);
