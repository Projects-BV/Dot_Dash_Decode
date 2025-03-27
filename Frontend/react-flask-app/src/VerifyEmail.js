

// VerifyEmail.js
import React, { useState, useEffect } from 'react';
import './login_register.css'; // Add your styles

function VerifyEmail({ token }) {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }
    
    // Verify the token
    fetch(`http://127.0.0.1:5000/auth/verify/${token}`)
      .then(response => {
        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully! You can now log in.');
          // Redirect to login after 3 seconds
          setTimeout(() => {
            window.location.href = '/'; // Go to homepage/login page
          }, 3000);
        } else {
          return response.json().then(data => {
            throw new Error(data.error || 'Failed to verify email');
          });
        }
      })
      .catch(error => {
        setStatus('error');
        setMessage(error.message || 'An error occurred during verification.');
        console.error('Verification error:', error);
      });
  }, [token]);
  
  return (
    <div className="verify-email-container">
      <h2>Email Verification</h2>
      
      {status === 'verifying' && (
        <div className="verifying">
          <div className="spinner"></div>
          <p>Verifying your email...</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="success">
          <p>{message}</p>
          <p>Redirecting to login page...</p>
          <button onClick={() => window.location.href = '/'}>Go to Login</button>
        </div>
      )}
      
      {status === 'error' && (
        <div className="error">
          <p>{message}</p>
          <button onClick={() => window.location.href = '/'}>Go to Login</button>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;