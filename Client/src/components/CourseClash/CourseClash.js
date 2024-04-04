import React ,{useEffect,useState} from 'react';
import "./CourseClash.css";
import {useNavigate} from 'react-router-dom';
const CourseClash = () => {
  const[userData,setUserData] =useState();
  const navigate =useNavigate();
  const callClash =async()=>{
    try{
       const res = await fetch('/courseclash',{
        method:"GET",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json",
        },
        credentials:"include",
       });

       const data = await res.json();
       console.log(data);
       setUserData(data);
       if(!res.status===200){
        const error =new Error(res.error);
        throw error;
       }

    }catch(err){
         console.log(err);
         navigate('/login');
    }
  }
  useEffect(()=>{
    callClash();
  },[]);
  return (
    <div>
      {}
      <button className="course-clash-button">
        <a href="https://prembharwani.github.io/clash-hai-bhai/" className="course-clash-link" target='_blank' rel='noopener noreferrer'>
          Go to Course Clash Page
        </a>
      </button>
    </div>
  );
}

export default CourseClash;
