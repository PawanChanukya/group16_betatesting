import React ,{useEffect,useState, useContext} from 'react';
import './contact.css'; // Import CSS file for styling
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserContext } from "../../App"
 
const Courses = () => {
  const {state,dispatch} = useContext(UserContext);
  // const[userData,setUserData] =useState();
  const [courses, setCourses] = useState({allCourse:[], filteredCourse:[]});
  const [status, setStatus]=useState("LOADING");
  // const [searchTerm, setSearchTerm] = useState('');
  const navigate =useNavigate();

  const callCoursePage =()=>new Promise(async(resolve, reject)=>{
    let res;
    try{
      res = await fetch('/user',{
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
    setStatus("LOADING");
    try{
      const res = await fetch(`/getUserCourseById`,{
        method:"POST",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json",
        },
        credentials:"include",
      });
      if(res.status===200){
        const data = await res.json();
        const allCourses=await data.userCourse;
        console.log(allCourses)
        setCourses({allCourse:allCourses, filteredCourse:allCourses});
        setStatus("SUCCESS");
      }
      else if(res.status===401){
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
    callCoursePage().then(()=>fetchCoursesList()).catch((error)=>console.log(error));
  },[]);


  const handleSearch = (event) => {
    const filteredCourses = courses.allCourse.filter(course =>{
      if(course)
        return course.courseName.toLowerCase().includes(event.target.value.toLowerCase())
      else
        return false
    });
    setCourses((prev)=>({allCourse:prev.allCourse, filteredCourse:filteredCourses}));
  };

  return (
    <div className="courses-container"> {/* Add a class for styling */}
      <h1>Courses</h1>
      <input
        type="text"
        placeholder="Search course..."
        onChange={handleSearch}
      />
      <ul className="courses-list"> {/* Add a class for styling */}
        {status!=="SUCCESS"?
        <h1 style={{textAlign:"center"}}>{status}</h1>:
        (
          courses.filteredCourse.length===0?<span>No course found</span>:
          courses.filteredCourse.map(course => (
            <li key={course._id}>
              <a href={'#'}>{course.courseId+": "+course.courseName}</a>
            </li>
          ))
        )
      }
      </ul>   
    </div>
  );
};

export default Courses;
