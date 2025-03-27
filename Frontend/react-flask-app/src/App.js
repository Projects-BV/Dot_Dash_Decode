import React, { useEffect, useState } from 'react';
import './App.css'; 
import mainLogo from './assets/images/main_logo.PNG';
import dotdashLogo from './assets/images/Logo_dotdash.PNG';
import axios from 'axios';
import MorseCodeFlashcards from './flashcards.js';
import './flashcards.css';
import MorseCodeEyeFlashcards from './tutorial.js'
import './tutorial.css';
import './login_register.css';

import VerifyEmail from './VerifyEmail';

import Video from './assets/DSC_4403.MOV';




function App() {
  
  useEffect(() => {
    setupIntersectionObservers();
    setupSmoothScroll();
    setupScrollIndicator();
  }, []);

  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);
  
  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    // Reset message when switching forms
    setMessage('');
  };
  
  const handleRegister = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          username, 
          email,  
          password 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Registration failed:', data);
        setMessage("Registration Failed");
        return;
      }
      
      console.log('Registration successful:', data);
      setMessage("Registration successful. Please Log in!")
      setIsLoginForm(true); // Switch back to login form after successful registration
    } catch (error) {
      console.error('Network error:', error);
      setMessage("Network error. Please try again.");
    }
  };

  
  const handleLogin = async () => {
    try {
      setIsLoading(true); // Set loading state at the beginning
      setShowError(false); // Reset error state
      
      const response = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.needsVerification) {
          setMessage(`Please verify your email before logging in. Verification link was sent to ${data.email}`);
        } else {
          setMessage(data.error || "Login failed. Please check your credentials.");
        }
        return;
      }
      
      // Success - handle login
      localStorage.setItem('token', data.token);
      setMessage("Login successful!");
      
      // Redirect to main app if needed
      // window.location.href = '/dashboard'; // Uncomment if you want to redirect
      
    } catch (error) {
      console.log("Network error:", error);
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false); // Always set loading state back to false
    }
  };
  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get-history');
      setHistory(response.data);
      setShowHistory(true);
    } catch (error) {
      console.error('Error fetching history:', error);
      setMessage("Failed to fetch history");
    }
  };

  const redirectToTest = () => {
    window.location.href = 'http://127.0.0.1:5000';
  };
  
  const setupIntersectionObservers = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));

    const sections = document.querySelectorAll('.section');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentSection = entry.target;
          document.querySelectorAll('.nav-content a').forEach(navItem => {
            const sectionId = navItem.getAttribute('href');
            if (sectionId === `#${currentSection.id}`) {
              navItem.classList.add('active');
            } else {
              navItem.classList.remove('active');
            }
          });

          const sectionColors = {
            'hero': '#20B2AA',
            'login-section': '#050505',
            'tutorial-section': '#ffffff',
            'history-section': '#050505',
            'about-section': '#FFA500'
          };

          document.body.style.transition = 'background-color 1.2s ease-in-out';
          document.body.style.backgroundColor = sectionColors[currentSection.id] || '#050505';
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(section => sectionObserver.observe(section));
  };

  const setupSmoothScroll = () => {
    document.querySelectorAll('.nav-content a').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const navbarHeight = document.querySelector('.topbar').offsetHeight;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  const setupScrollIndicator = () => {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-progress';
    document.body.appendChild(scrollIndicator);

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      scrollIndicator.style.width = `${scrolled}%`;
    });
  };

  if (currentPath.startsWith('/verify/')) {
    const token = currentPath.split('/verify/')[1];
    return <VerifyEmail token={token} />;
  }

  return (
    <div className="App">
      <nav className="topbar">
        <div className="nav-container">
          <div className="logo-container">
            <img src={mainLogo} alt="Logo" className="topbar-logo" />
          </div>
          <div className="nav-content">
            <a href="#login-section" className="nav-item">Login</a>
            <a href="#login-section" className="nav-item">Register</a>
            <a href="#tutorial-section" className="nav-item">Tutorial</a>
            <a href="#history-section" className="nav-item">History</a>
            <a href="#about-section" className="nav-item">About</a>
          </div>
        </div>
      </nav>

      <section id="hero" className="section hidden">
        <div className="content">
          <h1>Dot Dash Decode</h1>
          <img src={dotdashLogo} alt="Logo" className="hero-image" />
          <div className="button-group">
            <button className="btn" onClick={redirectToTest}>Start</button>
          </div>
        </div>
      </section>

      <section id="login-section" className="section hidden">
        <div className="content">
          <div className="auth-container">
            <div className={`form-container ${isLoginForm ? 'login-active' : 'register-active'}`}>
              <div className="login-form">
                <h2>User Login</h2>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="button-group">
                  <button className="btn" onClick={handleLogin} disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</button>
                </div>
                
                <div className="form-toggle">
                  {/*Not registered? <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }}>Register here</a>*/}
                  Not registered? <button type="button" className="link-button" onClick={toggleForm}>Register here</button>
                </div>
                
                <p className="message">{message}</p>
              </div>

              <div className="register-form">
                <h2>Registration</h2>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-username">Username</label>
                  <input
                    id="reg-username"
                    type="text"
                    placeholder="Choose a Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="reg-password">Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="Create a Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="button-group">
                  <button className="btn" onClick={handleRegister}>Register</button>
                </div>
                
                <div className="form-toggle">
                  {/*Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }}>Login here</a>*/}
                  Already have an account? <button type="button" className="link-button" onClick={toggleForm}>Login here</button>
                </div>
                
                <p className="message">{message}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tutorial-section" className="section hidden">
        <div className="content">
          <h2>Tutorial</h2>
          <MorseCodeEyeFlashcards />
        </div>
      </section>

      <section id="history-section" className="section hidden">
        <div className="content">
          <h2>Video Tutorial </h2>
          <video width="640" height="360" controls>
            <source src={Video} type="MOV" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>


      <section id="about-section" className="section">
        <div className="content">
          <h2>About</h2>
          <MorseCodeFlashcards />
        </div>
      </section>
    </div>
  );
}

export default App;