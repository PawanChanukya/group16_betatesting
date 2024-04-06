import React, { useState,useEffect, useContext } from 'react';
import "./PreReg.css";
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast'
import { UserContext } from "../../App"

const PreRegistration = () => {
  const {state,dispatch} = useContext(UserContext);
  const [status, setStatus]=useState("LOADING");
  const[userData,setUserData] =useState();
  const [allCourses, setAllCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  
  const navigate =useNavigate();

  const callPrePage =()=>new Promise(async(resolve, reject)=>{
    let res;
    try{
      res = await fetch('/preRegistration',{
        method:"GET", 
        headers:{
        Accept:"application/json",
        "Content-Type":"application/json",
        },
        credentials:"include",
      });
      
      if(res.status===200){
        dispatch({type:"USER",payload:true});
        const data = await res.json();
        const user=await data.user;
        console.log(user); 
        resolve(data);
      }
    }catch(err){
      reject(err);// show server error page
    }finally{
      if(res && res.status==401){
        toast.error("Unauthorised! please login");
        reject(res.error);
        navigate("/login");
      }else if(!res || res.status!==200){
        toast.error("Internal server error !");
        reject("internal server error !");// show server error page
      }
    }
  });

  const fetchCoursesList=async()=>{
    try{
      setStatus("LOADING");
      const res = await fetch(`/getAllCourses`,{
        method:"GET",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json",
        },
        credentials:"include",
      });
      if(res.status===200){
        const data = await res.json();
        const allCourses=await data.allCourses;
        console.log(allCourses)
        setAllCourses(allCourses);
        setStatus("SUCCESS");
      }else if(res.status===401){
        toast.error("Unauthorized ! Please Login !")
        navigate("/login");
      }
      else  throw new Error(res.error);
    }catch(err){
      toast.error("something went wrong! Unable to load the course list !");
      setStatus("ERROR");
      console.log(err);
    }
  }
 
  useEffect(()=>{
    callPrePage().then(()=>fetchCoursesList()).catch((error)=>console.log(error));
  },[]);
 
  const handleAddCourseToUser=async(e, id)=>{
    const toastId=toast.loading("Adding...");
    e.preventDefault();      
    try{
      const res = await fetch(`/addCourse`,{
        method:"POST",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json",
        },
        credentials:"include",
        body: JSON.stringify({"courseId":id})
      });
      if(res.status===200){
        toast.success("course successfully  added",{id:toastId});
        console.log("course successfully has been added");
        navigate("/courses");
      }
      else if(res.status===409){
        toast.error("The course already has been registered to you!",{id:toastId});
        navigate("/courses");
      }else if(res.status===401){
        toast.error("Unautorized! Please Login!",{id:toastId});
        navigate("/login");
      }
      else{
        const error =new Error(res.error);
        throw error;
      }
    }catch(e){
      console.log(e);
      toast.error("Something Went wrong! Unable to add the course.",{id:toastId})
    }
  }

  // Function to filter courses based on search query
  const filterCourse =allCourses.filter(course =>{
    if(course){
      let bool=(course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return bool;
    }
    else return false;
  });

  const generateTimetableGrid = () => {
    // Weekdays array
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    // Initialize the timetable grid
    const timetableGrid = [];
    // Generate rows for each hour
    for (let i = 8; i < 19; i++) {
      const timeSlot = `${i.toString().padStart(2, '0')}:00`;
      const row = (
        <tr key={timeSlot}>
          <td>{timeSlot}</td>
          {status==="SUCCESS"?weekdays.map((day, index)=>{
              const courseInTimeSlot=filterCourse.filter(course=>{
                return course.timing.some(timing=>timing.day==day && timing.startTime<=i && i<timing.endTime)
              });
              const isClash=courseInTimeSlot.length>1;
              return(
                <td key={index} className={`timetable-cell ${isClash?'clash-cell':''}`}>
                  {
                    courseInTimeSlot.map((course,index)=>(
                      <div key={index} className='course-info'>
                        {course.courseId}
                      </div>
                    ))
                  }
                </td>
              );
            })
          :""}
        </tr> 
      );
      timetableGrid.push(row);
    }
    return timetableGrid;
  };
  
  
  return (
    <div className="pre-registration">
      <h1>Pre-Registration Page</h1>
      <div className="course-list">
        <h2>Course List</h2>
        {/* Search input field */}
        <input
          type="text"
          placeholder="Search courses"
          // value={searchQuery}
          onChange={(e) =>setSearchQuery(e.target.value)}
        />
        {/* Course list table */}
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Branch</th>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Time slot</th>
              <th>Instructor</th>
              <th>Add</th> 
            </tr>
          </thead>
          <tbody>
          {status!=="SUCCESS"?<tr style={{fontSize:"30px"}}>{status}</tr>:
            filterCourse.map((course, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{course.branch}</td>
                <td>{course.courseId}</td>
                <td>{course.courseName}</td>
                <td>{course.credits}</td> 
                <td>{course.timing.map(timing => `${timing.day} ${timing.startTime}-${timing.endTime}`).join(', ')}</td>
                <td>{course.instructor}</td>
                <td>
                <button onClick={(e) => handleAddCourseToUser(e,course._id)}>Add</button>
                </td>
              </tr>
            ))}
          </tbody> 
        </table>
      </div>
      <div className="timetable">
        <h2>Timetable</h2>
        <table>
          <thead>
            <tr>
              <th>Time/Day</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
              <th>Sunday</th>
            </tr>
          </thead>
          <tbody>
            {status!=="SUCCESS"?<h1 style={{fontSize:"30px"}}>{status}</h1>:generateTimetableGrid()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreRegistration;
