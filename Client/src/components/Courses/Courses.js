import React ,{useEffect,useState} from 'react';
import './contact.css'; // Import CSS file for styling
import {useNavigate} from 'react-router-dom';

const Courses = () => {
  const[userData,setUserData] =useState();
  const [courses, setCourses] = useState({allCourse:[], filteredCourse:[]});
  const [status, setStatus]=useState("LOADING");
  const [searchTerm, setSearchTerm] = useState('');
  const navigate =useNavigate();
  const callCourse =async()=>{
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
      return user._id;
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
    setStatus("LOADING");
    //660d7aaefbe2ec59bb201e3e
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
    async function fun(){
      await callCourse();
      fetchCoursesList();

    }
    fun()
  },[]);


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredCourses = courses.filter(course =>{
            if(course)
        	return course.title.toLowerCase().includes(event.target.value.toLowerCase())
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
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul className="courses-list"> {/* Add a class for styling */}
        {status!=="SUCCESS"?<h1 style={{textAlign:"center"}}>{status}</h1>:courses.filteredCourse.map(course => (
          <li key={course._id}>
            <a href={'#'}>{course.courseId+": "+course.courseName}</a>
          </li>
        ))}
      </ul>   
    </div>
  );
};

export default Courses;
