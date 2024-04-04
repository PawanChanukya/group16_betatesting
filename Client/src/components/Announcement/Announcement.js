import React ,{useEffect,useState} from 'react';
import "./Announcement.css";
import {useNavigate} from 'react-router-dom';


const Announcement = () => {
  // Sample announcement data (can be fetched from an API or stored in state)
  const[userData,setUserData] =useState();
  const navigate =useNavigate();
  const callAnnounce =async()=>{
    try{
       const res = await fetch('/announcement',{
        method:"GET",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json",
        },
        credentials:"include",
       });

       const data = await res.json();
       console.log(res);
       const user=await data.user;
       console.log(user);
       setUserData(user);
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
    callAnnounce();
  },[]);
  const announcements = [
    {
      id: 1,
      title: 'Important Announcement',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel mauris id elit molestie ultricies.',
      date: '2024-03-14',
    },
    {
      id: 2,
      title: 'Update on Schedule',
      content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      date: '2024-03-10',
    },
    // Add more announcements as needed
  ];

  return (
    <div className="announcement-container">
      <h1>Announcements</h1>
      {announcements.map((announcement) => (
        <div key={announcement.id} className="announcement">
          <h2>{announcement.title}</h2>
          <p>{announcement.content}</p>
          <p className="announcement-date">Date: {announcement.date}</p>
        </div>
      ))}
    </div>
  );
};

export default Announcement