import React,{useState} from "react";
import {registerUser} from "./api"

const Register=()=>{
    const [formData,setFormData]=useState({username:"",email:"",password:""})
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    };
    //i changed it to console log but the output did not change. previously it was not in the console log format.
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response=await registerUser(formData);
            console.log(response.data);
            alert(response.data.message);
        }
        catch(err)
        {
            alert(err.response?.data?.error||"Registration failed");
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;