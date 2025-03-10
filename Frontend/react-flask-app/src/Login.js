import React,{useState} from "react";
import {loginUser} from "./api";

const Login=()=>{
    const[formData,setFormData]=useState({email:"",password:""});

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const res=await loginUser(formData);
            localStorage.setItem("token",res.data.token);
            alert("Login Successful !");
        }
        catch(err)
        {
            alert(err.response.data.erroe||"Login Failed");
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;