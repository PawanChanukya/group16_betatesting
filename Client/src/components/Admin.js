import React, { useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import './Admin.css';
import toast from 'react-hot-toast';
import { UserContext } from "../App";

const Admin = () => {
  const {state,dispatch} = useContext(UserContext);
  const navigate=useNavigate();
  const [status,  setStatus]=useState("LOADING");
  const [formData, setFormData] = useState({
    branch: '',
    courseId: '',
    courseName: '',
    credits: '',
    timing: '',
    instructor: '',
    status: 'Active', // Default status
  });
  const [courseData, setCourseData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(''); // Default branch
  const [searchText, setSearchText] = useState('');
  const [editingId, setEditingId] = useState(null);
  // const [filteredCourses, setFilteredCourses] = useState([]);

  const callAdminPage =()=>new Promise(async(resolve, reject)=>{
    let res;
    try{
      res = await fetch('/admin',{
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
        setCourseData(allCourses);
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
    callAdminPage().then(()=>fetchCoursesList()).catch((error)=>console.log(error));
  },[]);

  const handleChange = (e) => {
    let{ name, value } = e.target;
    if(name==="status" && !value) value='Active';
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleUpdate=(e)=>{
    e.preventDefault()
    if(editingId){
      console.log("updated")
      console.log(editingId);
      let url=`/updateCourseById/${editingId}`;
      handleSubmit({url, updating:true});
    }
    return;
  }

  const handleAdd=(e)=>{ 
    e.preventDefault();
    if(editingId){
      setFormData({
        ...formData,
        branch: '',
        courseId: '',
        courseName: '',
        credits: '',
        timing: '',
        instructor: '',
        status: '',
      });
      setEditingId(null);
      return;
    }
    let url="/createCourse"
    handleSubmit({url});
  }

  const handleSubmit = async(obj) => {
    // console.log(formData);
    for(let key in formData){
      //TODO: Also ensure that admin is entering the timing in correct format and correct time, like, Monday 11-12, Friday 1-3
      if(key==="credits"){
        if(!(parseInt(formData[key])>=0)){
          toast.error("Invalid value for credits!");
          return;
        }
      }else{
        if(key=="status" && !formData[key]){
          formData[key]="Active"; continue;
        }
        if(!formData[key] || !formData[key].trim()){
          toast.error("All feild are required!");
          return;
        }
      }
    }
    const toastId=toast.loading(obj.updating?"Updating": "Adding....")
    try{
      const res = await fetch(obj.url,{
        method:"POST",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json",
        },
        credentials:"include",
        body: JSON.stringify(formData)
      });
      if(res.status===200){
        toast.success((obj.updating?"Updated ":"Added ")+"successfully!",{id:toastId})
        await fetchCoursesList();
      }else if(res.status===401){
        toast.error("Unauthorized ! Please login again !")
        navigate("/login")
      }
      else{
        const error =new Error(res.error);
        throw error;
      }

    }catch(e){
      console.log(e);
      toast.error(`Something Went wrong! Unable to ${obj.updating?"update": "add"} the course.`,{id:toastId})
    }
    // Clear the form fields
    setFormData({
      ...formData,
      branch: '',
      courseId: '',
      courseName: '',
      credits: '',
      timing: '',
      instructor: '',
      status: '',
    });
    setEditingId(null);
  };


  const handleEdit = (e,id) => {
    const courseToEdit = courseData.find((course) => course._id === id);
    if(courseToEdit){
      let timing=typeof(courseToEdit.timing)===typeof("string")?courseToEdit.timing:courseToEdit.timing.map(timing => `${timing.day} ${timing.startTime}-${timing.endTime}`).join(', ')
      
      courseToEdit.timing=timing;
      setFormData(courseToEdit);
      setEditingId(id); 

    }
  };

  const handleDelete = async(e,id) => {
    const toastId=toast.loading("Deleting....");
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
        const updatedCourses = courseData.filter((course) => course._id !== id);
        setCourseData(updatedCourses);
        toast.success("Deleted Successfully!",{id:toastId})
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
      toast.error("Something Went wrong! Unable to drop the course.",{id:toastId})
    }
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };
  const handleBranchChange = (e) => {
    console.log(e.target.value)
    if(e.target.value.trim())
      setSelectedBranch(e.target.value);
  };

  let filteredCourses = courseData.filter((course) => {
    if(course){
      const name = course.courseName.toLowerCase();
      const search = searchText.toLowerCase();
      return name.includes(search);
    }
    return false;
  });
  filteredCourses=filteredCourses.filter(course=>{
    if(!selectedBranch || selectedBranch.toLocaleLowerCase().trim()=="all")return true
    if(course){
      const branch = course.branch.toLowerCase();
      const search = selectedBranch.toLowerCase();
      return branch.includes(search); 
    }  
    return false; 
  })
  

  return (
    <div className="admin-container">
      <h1>Admin Page</h1>
      <div className="branch-select">
        <label htmlFor="branch">Select Branch:</label>
        <select id="branch" name="branch" value={selectedBranch} onChange={(e)=>handleBranchChange(e)}>
          <option value="all">All</option>
          <option value="AE">AE</option>
          <option value="BSBE">BSBE</option>
          <option value="CE">CE</option>
          <option value="CSE">CSE</option>
          <option value="EE">EE</option>
        </select>
      </div>
      <div className="search-course">
        <label htmlFor="search">Search Course by Name:</label>
        <input type="text" id="search" name="search" value={searchText} onChange={(e)=>handleSearchChange(e)} />
      </div>
      <br></br>
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
            <th>Status</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {status!="SUCCESS"?<div>Loading</div>:filteredCourses.map((course, index) => (
            <tr key={course._id}>
              <td>{index + 1}</td>
              <td>{course.branch}</td>
              <td>{course.courseId}</td>
              <td>{course.courseName}</td>
              <td>{course.credits}</td>
              <td>{typeof(course.timing)===typeof("string")?course.timing:course.timing.map(timing => `${timing.day} ${timing.startTime}-${timing.endTime}`).join(', ')}</td>
              <td>{course.instructor}</td>
              <td>{course.status}</td>
              <td>
                <button className="update-button" onClick={(e) => handleEdit(e,course._id)}>Edit</button>
              </td>
              <td>
                <button className="delete-button" onClick={(e) => handleDelete(e,course._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="form-container">
        <form>
          <h2>Add/Update Course</h2>
          <div className="form-group">
            <label htmlFor="branch">Branch:</label>
            <select id="branch" name="branch" value={formData.branch} onChange={handleChange} required>
              <option value="">Select Branch</option>
              <option value="AE">AE</option>
              <option value="BSBE">BSBE</option>
              <option value="CE">CE</option>
              <option value="CSE">CSE</option>
              <option value="EE">EE</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="courseId">Course ID:</label>
            <input type="text" id="courseId" name="courseId" value={formData.courseId} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="courseName">Course Name:</label>
            <input type="text" id="courseName" name="courseName" value={formData.courseName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="credits">Credits:</label>
            <input type="number" id="credits" name="credits" value={formData.credits} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input type="text" id="time" name="timing" value={formData.timing} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="instructor">Instructor:</label>
            <input type="text" id="instructor" name="instructor" value={formData.instructor} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button className={editingId?"disabled-btn":"save-button"}
          onClick={(e)=>handleAdd(e)}
          style={{borderTopRightRadius:"0px", borderBottomRightRadius:"0px"}}
          >Add</button>

          <button className={editingId?"save-button":"disabled-btn"} 
          onClick={(e)=>handleUpdate(e)} disabled={editingId?false:true}
          style={{borderTopLeftRadius:"0px", borderBottomLeftRadius:"0px"}}          
          >update</button>
          
        </form>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Add Announcement</h2>
          <div className="form-group">
            <label htmlFor="announcementHeading">Announcement Heading:</label>
            <input type="text" id="announcementHeading" name="announcementHeading" value={formData.announcementHeading} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="announcementInfo">Announcement Information:</label>
            <textarea
              id="announcementInfo"
              name="announcementInfo"
              value={formData.announcementInfo}
              onChange={handleChange}
              required
              className="input-text" // Apply the same CSS class as input elements
            />
          </div>
          <button className="save-button" type="submit">Save Announcement</button>
        </form>
      </div>
    </div>
  );
};

export default Admin;