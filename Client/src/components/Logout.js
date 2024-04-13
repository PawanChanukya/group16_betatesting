import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import toast from 'react-hot-toast';

const Logout =() =>{
    const navigate = useNavigate();
    const {state,dispatch} = useContext(UserContext);
        
    useEffect(()=> {
        fetch('http://localhost:8000/logout',{
            method:"POST",
            headers:{
                Accept:"application/json",
                "Content-Type":"application/json"
            },
            credentials:"include"
        }).then((res) =>{
            console.log("logout sucessfull")
            dispatch({type:"USER",payload:false});
            toast.success("Logged out Successfully!");
            navigate('/login',{replace:true});
            if(res.status!==200){
                const error =new Error(res.error);
                throw error;
            }
        }).catch((err)=>{
            toast.error("Unable to log out! Something went wrong!");
            console.log(err);
        })
    })
    return(<h1 style={{textAlign:"center", marginTop:"10%"}}>Loging out...</h1>)
}
export default Logout