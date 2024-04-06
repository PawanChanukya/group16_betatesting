import React,{createContext, useReducer} from 'react';
import {Route,Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './style.css';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './components/Home/Home';
import PreRegistration from './components/PreReg/PreReg';
import CourseClash from './components/CourseClash/CourseClash';
import Courses from './components/Courses/Courses';
import Login from './components/Login';
import Signup from './components/Signup';
import Announcement from './components/Announcement/Announcement';
import Admin from './components/Admin';
import Page from './components/Courses/Courses_page/Page';
import Logout from './components/Logout';
import {initialState,reducer} from '../src/reducer/UseReducer';

export const UserContext=createContext();

const App =()=>{
  const [state,dispatch] =useReducer(reducer,initialState)
  return (
    <>
    <UserContext.Provider value={{state,dispatch}}>
     <Navbar/>
    <Routes>
      <Route exact path='/' element={<Home/>}></Route>
      <Route path='/preregistration' element={<PreRegistration/>}></Route>
      <Route path='/courseclash' element={<CourseClash/>}></Route>
      <Route path='/courses' element={<Courses/>}></Route>
      <Route path='/announcement' element={<Announcement/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/admin' element={<Admin/>}></Route>
      <Route path='/page' element={<Page/>}></Route>
      <Route path='/logout' element={<Logout/>}></Route>
    </Routes>
    <Toaster containerStyle={{fontSize:"15px"}}/>
    </UserContext.Provider>
    </>
  )
}

export default App