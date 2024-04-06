import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import toast from 'react-hot-toast';

const Login = () => {
  const {state,dispatch} = useContext(UserContext);
  const [email,setEmail] =useState('');
  const [password,setPassword] =useState('');

  const navigate = useNavigate();

  const loginUser = async (e)=>{
    const toastId=toast.loading("Logging in...");
    e.preventDefault();
    try{
      const res = await fetch('/login',{
        method:"POST",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json",
        },
        credentials:"include",
        body: JSON.stringify({
          email,password
        })
      });
      const data = await res.json()
      if(res.status===200){
        toast.success("Log in Successfull!",{id:toastId});
        dispatch({type:"USER",payload:true});

        console.log("Login Successful");
        console.log(data); 

        const accountType=await data.user.accountType;
        if(accountType=='Admin')
          navigate('/Admin');
        else
          navigate('/');
      }
      else if(res.status==401) {
        toast.error("Invalid credential!",{id:toastId});
        console.log("invalid Registration");
      }
      else throw new Error(res.error);
    }catch(err){
      console.log(err);
      toast.error("Something went wrong! Please try again!",{id:toastId});
    }
  }

  return (
    <>
      <section>
        <main>
          <div className="section-registration">
            <div className="container grid grid-two-cols">
              {/* our main registration code  */}
              <div className="registration-form">
                <h1 className="main-heading mb-3">Login form</h1>
                <br />
                <form >
                  <div>
                    <label htmlFor="email">email</label>
                    <input
                      type="text"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password">password</label>
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password"
                    />
                  </div>
                  <br />
                  <button type="submit" className="btn btn-submit " onClick={loginUser}>
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
}
export default Login;
