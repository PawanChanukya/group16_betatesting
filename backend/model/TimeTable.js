const mongoose=require("mongoose");

const timeTableSchema=new mongoose.Schema({
    day:{
        type:String,
        required:true,
        trim:true,
    },
    startTime:{
        type:String,
        required:true,
        trim:true,
    },
    endTime:{
        type:String,
        required:true,
        trim:true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }
})

module.exports=mongoose.model("TimeTable",timeTableSchema);