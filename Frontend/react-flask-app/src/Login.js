import React,{useState} from "react";
import {loginUser,resendVerification} from "./api";

const Login=()=>{
    const[formData,setFormData]=useState({email:"",password:""});
    const[error,setError]=useState("");
    const[needsVerification,setNeedsVerification]=useState(false);
    const[verificationSent,setVerificationSent]=useState(false);
    
    const [showError, setShowError] = useState(false);
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError("");
        try{
            const res=await loginUser(formData);
            localStorage.setItem("token",res.data.token);
            alert("Login Successful !");
            window.location.reload();
        }
        catch(err)
        {
            //alert(err.response.data.erroe||"Login Failed");
            if (err.response?.data?.error === "Please verify your email before logging in") {
                setNeedsVerification(true);
                setError("Please verify your email before logging in");
            } else {
                setError(err.response?.data?.error || "Login Failed");
            }
            
        }
    };

    const handleResendVerification = async () => {
        try {
            // Need to get the email from the user for resending verification
            const email = prompt("Please enter your email to resend verification:");
            if (email) {
                await resendVerification(email);
                setVerificationSent(true);
            }
        } catch (err) {
            setError("Failed to resend verification email");
        }
    };
    return (
        <div className="login-form">
            <h2>USER LOGIN</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your Username"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="login-btn">Login</button>
                
                {error && <p className="error-message">{error}</p>}
                
                {needsVerification && !verificationSent && (
                    <div className="verification-message">
                        <p>Your email is not verified. Need a new verification link?</p>
                        <button
                            type="button"
                            onClick={handleResendVerification}
                            className="resend-btn"
                        >
                            Resend Verification
                        </button>
                    </div>
                )}
                
                {verificationSent && (
                    <p className="success-message">
                        Verification email sent! Please check your inbox.
                    </p>
                )}
                
                <p className="register-link">
                    Not registered? <a href="#" onClick={() => document.getElementById('register-button').click()}>Register here</a>
                </p>
            </form>
        </div>
    );
};
export default Login;
    

