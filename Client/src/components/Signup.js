import { useState } from "react";
import {useNavigate} from "react-router-dom";

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
    console.log(e);
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
  };
  const PostData = async (e)=>{
    e.preventDefault();
    const {name,email,phone,password,cpassword} =user;
 
    const res = await fetch('/signup',{
       method:"POST",
       headers:{
           "Content-Type":"application/json"
       },
       body: JSON.stringify({
         name,email,phone,password,cpassword
       })
    });
    const data = await res.json()
     if(data.status===422 || !data){
       window.alert("Invalid Registration");
       console.log("invalid Registration");
     }else {
       navigate('/login');
       window.alert("Registration Successful");
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
                    />
                  </div>
                  <div>
                    <label htmlFor="email">email</label>
                    <input
                      type="text"
                      name="email"
                      value={user.email}
                      onChange={handleInput}
                      placeholder="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone">phone</label>
                    <input
                      type="number"
                      name="phone"
                      value={user.phone}
                      onChange={handleInput}
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
                  <button type="submit" className="btn btn-submit" onClick={PostData} >
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