import React ,{useEffect,useState} from 'react';
import './Home.css';
import {useNavigate} from 'react-router-dom';

const Home = () => {
  const[userData,setUserData] =useState();
  const navigate =useNavigate();
  const callHomePage =async()=>{
    try{
      const res = await fetch('/user',{// TODO
        method:"GET",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json",
        },
        credentials:"include",
      });
      console.log(res)
      const data = await res.json();
      const user=await data.user;
      console.log(data);
      setUserData(user);
      if(res.status!==200){
        const error =new Error(res.error);
        throw error;
      }

    }catch(err){
      console.log(err);
      navigate('/login');
    }
  }
  useEffect(()=>{
    callHomePage();
  },[]);
  return (
    <div className="container">
      <h1>Welcome to Our Web Application</h1>
      <div className="instructions">
        <h2>Introduction</h2>
        <p>
        Welcome to Smart Tutor, your ultimate solution for hassle-free pre-registration work. In the chaotic period leading up to course selection, where complexities regarding course offerings, schedules, overviews, and conflicts abound, Smart Tutor emerges as a comprehensive platform to streamline the process and ensure a smooth signup experience.
        </p>
        <h2>Overview</h2>
        <p>
        Smart Tutor addresses the myriad challenges encountered during pre-registration, simplifying tasks for both department mentors and students alike. With features tailored to meet the specific needs of each user group, our platform aims to revolutionize the way courses are managed and selected.
        </p>
        <h2>Product Functionality for Department Mentors</h2>
        <p>
        For department mentors, Smart Tutor offers a suite of functionalities designed to streamline administrative tasks:
        <li>Add or remove courses from the list of offerings.</li>
        <li>Edit course descriptions to provide accurate information.</li>
        <li>Publish or unpublish courses in preparation for pre-registration.
      </li>
        <li>Customize course details such as timings and instructors upon publication.
      </li>
        <li>Enroll in courses themselves to better understand the student experience.
      </li>
        <li>Engage with course forums, including viewing, responding, and creating discussions.
      </li>
        </p>
      </div>
      <div className="team">
        <h2>Contributions by Team_16:</h2>
        <div className="team-members">

          <div>
            <p>Ch Hemanth Kumar</p>
            <p>210277</p>
            <p>chandaka21@iitk.ac.in</p>
          </div>
          <div>
            <p>Kantule Ritesh Ramdas</p>
            <p>210488</p>
            <p>kantulerr21@iitk.ac.in</p>
          </div>
          <div>
            <p>Rishit Bhutra</p>
            <p>210857</p>
            <p>rishitb21@iitk.ac.in</p>
          </div>
          <div>
            <p>Sarthak Paswan</p>
            <p>220976</p>
            <p>sarthakp22@iitk.ac.in</p>
          </div>
          <div>
            <p>Saurav Kumar</p>
            <p>210950</p>
            <p>sauravk21@iitk.ac.in</p>
          </div>
          <div>
            <p>Sonu Kumar</p>
            <p>211052</p>
            <p>sonuk21@iitk.ac.in</p>
          </div>
          <div>
            <p>Surendra Kumar Ahirwar</p>
            <p>211083</p>
            <p>surendrak21@iitk.ac.in</p>
          </div>
          <div>
            <p>Krishna Chandu</p>
            <p>220832</p>
            <p>pkrishna22@iitk.ac.in</p>
          </div>
          <div>
            <p>Yash gothwal</p>
            <p>211189</p>
            <p>yashg21@iitk.ac.in</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
