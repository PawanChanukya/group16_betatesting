import React, { useState,useEffect } from 'react';
import "./PreReg.css";
import {useNavigate} from 'react-router-dom';

// "_id": "660d7a9afbe2ec59bb201e3b",
// "_id": "660d7aaefbe2ec59bb201e3e",
// 660d7d62a1e15ec50049b45b
 

const PreRegistration = () => {
  const [status, setStatus]=useState("LOADING");
  const[userData,setUserData] =useState();
  const [allCourses, setAllCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  
  // State to hold the input values for adding a new course
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseId, setNewCourseId] = useState('');
  const [newCourseTiming, setNewCourseTiming] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('');
  const [newCourseBranch, setNewCourseBranch] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState('');

  // State to manage the visibility of the add course form
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  
  const navigate =useNavigate();

  const callPrePage =async()=>{
    try{
       const res = await fetch('/user',{
        method:"GET",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json",
        },
        credentials:"include",
       });
      if(res.status===200){
        const data = await res.json();
        const user=await data.user;
        console.log(user); 
        setUserData(user);
      }
      else{
        const error =new Error(res.error);
        throw error;
      }

    }catch(err){
      navigate('/login');
    }
  }

  const fetchCoursesList=async()=>{
    try{
      setStatus("LOADING");
      const url=`/getAllCourses`;
      const res = await fetch(url,{
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
      }
      else{
        const error =new Error(res.error);
        throw error;
      }

    }catch(e){
      setStatus("ERROR");
      console.log(e);
      window.alert("Something Went wrong! Unable to load the course List.")
    }
  }

  useEffect(()=>{
    let fun=async()=>{
      await callPrePage();
      fetchCoursesList();
    }
    fun();
    
  },[]);
 
  const handleAddCourseToUser=async(e, id)=>{
    console.log("adding");
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
        console.log("course successfully has been added");
        window.alert("course successfully has been added")
        // navigate();
      }
      else if(res.status===409){
        window.alert("The course already has been registred by you!")
      }
      else{
        const error =new Error(res.error);
        throw error;
      }

    }catch(e){
      console.log(e);
      window.alert("Something Went wrong! Unable to add the course.")
    }
  }
  
 
  // Function to handle add a new course
  const handleAddNewCourse = async(e) => {
    e.preventDefault();
    if (newCourseName.trim() === '' && newCourseId.trim() === '' && newCourseTiming.trim() === '' && newCourseInstructor.trim() === '' && newCourseBranch.trim() === '' && newCourseCredits.trim() === '') {
    window.alert("All feilds are required!");
      return null;
    }  
      
    const newCourse = {
      courseName: newCourseName.trim(),
      courseId: newCourseId.trim(),
      timing: newCourseTiming.trim(),
      instructor: newCourseInstructor.trim(),
      branch: newCourseBranch.trim(),
      credits: newCourseCredits.trim()
    };
      
    try{
      const res = await fetch(`/createCourse`,{
        method:"POST",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json",
        },
        credentials:"include",
        body: JSON.stringify(newCourse)
      });
      if(res.status===200){
        await fetchCoursesList();
      }
      else{
        const error =new Error(res.error);
        throw error;
      }

    }catch(e){
      console.log(e);
      window.alert("Something Went wrong! Unable to add the course.")
    }

    // Reset input fields
    setNewCourseName('');
    setNewCourseId('');
    setNewCourseInstructor('');
    setNewCourseBranch('');
    setNewCourseCredits('');
    setNewCourseTiming('');

    // Hide the add course form after adding the course
    setShowAddCourseForm(false);
  }
  

  // Function to handle drop a course
  const handleDropCourse = async(e,id) => { 
    e.preventDefault();
    try{
      const res = await fetch(`/deleteCourseById/${id}`,{
        method:"DELETE",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json",
        },
        credentials:"include",
      });
      if(res.status===204){
        setAllCourses(allCourses.filter((c)=>(c._id!==id)));
      }
      else{
        const error =new Error(res.error);
        throw error;
      }
 
    }catch(e){
      console.log(e);
      window.alert("Something Went wrong! Unable to drop the course.")
    }
  };
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

      {/* Button to toggle the visibility of the add course form */}
      {
        userData && userData.accountType &&
        userData.accountType==="Admin"?
        <div className="add-course-button">
          <button onClick={() => setShowAddCourseForm(!showAddCourseForm)}>New Course</button>
        </div>:""
      }
      
      {/* Add course form */}
      {showAddCourseForm && (
        <div className="add-course">
          <input
            type="text"
            placeholder="Course ID"
            value={newCourseId}
            onChange={(e) => setNewCourseId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Course Name"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Timings (Day HH:MM-HH:MM, Day HH:MM-HH:MM, ...)"
            value={newCourseTiming}
            onChange={(e) => setNewCourseTiming(e.target.value)}
          />
          <input
            type="text"
            placeholder="Instructor"
            value={newCourseInstructor}
            onChange={(e) => setNewCourseInstructor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Branch"
            value={newCourseBranch}
            onChange={(e) => setNewCourseBranch(e.target.value)}
          />
          <input
            type="number"
            placeholder="Credits"
            value={newCourseCredits}
            onChange={(e) => setNewCourseCredits(e.target.value)}
          />
          <button onClick={handleAddNewCourse}>Add Course</button>
        </div>
      )}
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
              <th>{userData && userData.accountType?(
                  userData.accountType==="Admin"?"Drop":"Add"):""}</th> 
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
                {userData && userData.accountType?
                    userData.accountType==="Admin"?
                    <button onClick={(e) => handleDropCourse(e,course._id)}>Drop</button>
                    :
                    <button onClick={(e) => handleAddCourseToUser(e,course._id)}>Add</button>
                  :
                  ""
                } 
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
