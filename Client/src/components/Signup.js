import { useState } from "react";
import {useNavigate} from "react-router-dom";
import toast from 'react-hot-toast';
import 'react-phone-number-input/style.css'
import PhoneInput,{isValidPhoneNumber} from 'react-phone-number-input'

// import "./Signup.css";


 const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cpassword:"",
    // people:""
  });

  const handleInput = (e) => {
    // console.log(e);
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };
  // handle form on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);
    const userData=Object.fromEntries(
      Object.entries(user).map(([key, value]) => [key, value.trim()])
    );
    if(userData.name==null || userData.name=='' || userData.name==undefined){
      toast.error("User name is required!");
      return;
    }
    if(userData.email==null || userData.email=='' || userData.email==undefined){
      toast.error("User email is required!");
      return;
    }
    if(userData.phone==null || userData.phone=='' || userData.phone==undefined){
      toast.error("Phone nu is required!");
      return;
    }
    if(userData.password==null || userData.password=='' || userData.password==undefined){
      toast.error("Password is required!");
      return;
    }
    if(userData.cpassword==null || userData.cpassword=='' || userData.cpassword==undefined){
      toast.error("Re-enter password is required!");
      return;
    }
    if(userData.password!==userData.cpassword){
      toast.error("Password and Confirm Pasword is not matching!");
      return;
    }
    var pattern = new RegExp(/^[0-9\b]+$/);
    if (!pattern.test(userData.phone) || userData.phone.length!==10){
      toast.error("Invalid Phone nu!");
      return;
    }
    setUser({
      name: "",
      email: "",
      phone: "",
      password: "",
      cpassword:"",
      // people:""
    });
    PostData(userData);
  };
  const PostData = async (userData)=>{
    const res = await fetch('/signup',{
       method:"POST",
       headers:{
           "Content-Type":"application/json"
       },
       body: JSON.stringify(userData)
    });
    const data = await res.json()
     if(data.status===422 || !data){
       toast.error("Invalid Registration");
       console.log("invalid Registration");
     }else {
       navigate('/login');
       toast.success("Registration Successful");
       console.log("Registration Successful");
     }
 }
 

  return (
    <>
      <section>
        <main>
          <div className="section-registration">
            <div className="container">
              
              {/* our main registration code  */}
              <div className="registration-form">
                <h1 className="main-heading mb-3">registration form</h1>
                <br />
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name">name</label>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleInput}
                      placeholder="name"
                      required={true}
                    />
                  </div>
                  <div>
                    <label htmlFor="email">email</label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInput}
                      placeholder="email"
                      required={true}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone">phone</label>
                    <input
                      type="number"
                      name="phone"
                      value={user.phone}
                      onChange={handleInput}
                      required={true}
                    />
                  </div>
                  <div>
                    <label htmlFor="password">password</label>
                    <input
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleInput}
                      placeholder="password"
                      required={true}
                    />
                  </div>
                  <div>
                    <label htmlFor="password">Re-enter password</label>
                    <input
                      type="password"
                      name="cpassword"
                      value={user.cpassword}
                      onChange={handleInput}
                      placeholder="password"
                      required={true}
                    />
                  </div>
                  {/* <div>
                    <label htmlFor="type">Type</label>
                    <select id="type" name="people" value={user.type} onChange={handleInput}>
                      <option value="Admin">Admin</option>
                      <option value="Client">Client</option>
                    </select>
                  </div> */}
                  <br />
                  <button type="submit" className="btn btn-submit">
                    Register Now
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
export default Signup