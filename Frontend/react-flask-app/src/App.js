


import React, { useEffect, useState } from 'react';
import './App.css'; 
import mainLogo from './assets/images/main_logo.PNG';
import dotdashLogo from './assets/images/Logo_dotdash.PNG';
import morseCodeChart from './assets/images/morsecode.png';
import axios from 'axios';

//new line 1

import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
//till here
function App() {
  
  useEffect(() => {
    setupIntersectionObservers();
    setupSmoothScroll();
    setupScrollIndicator();
  }, []);

  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleRegister = async () => {
    const response = await fetch('http://127.0.0.1:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    setMessage(data.message);
  };
  const handleLogin = async () => {
    const response = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.access_token);
      setMessage('Login successful!');
    } else {
      setMessage(data.message);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get-history'); // Call Flask API
      setHistory(response.data);
      setShowHistory(true); // Show history section
    } catch (error) {
      console.error('Error fetching history:', error);
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

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
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
          <h2>A Morse code decoding website</h2>
          <div className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="email"
                placeholder="Enter your email"
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
              <button className="btn" onClick={handleLogin}>Login</button>
              <button className="btn" onClick={handleRegister}>Register</button>
            </div>
            <p className="message">{message}</p>
          </div>
        </div>
      </section>

      <section id="tutorial-section" className="section hidden">
        <div className="content">
          <h2>Tutorial</h2>
          <img src={morseCodeChart} alt="Morse Code Chart" className="tutorial-image" />
        </div>
      </section>

      <section id="history-section" className="section hidden">
        <div className="content">
          <h2>Previous Conversation</h2>
          <button className="btn" onClick={fetchHistory}>View History</button>
          
          {showHistory && (
            <ul className="history-list">
              {history.length > 0 ? (
                history.map((entry, index) => (
                  <li key={index}>
                    {new Date(entry.timestamp).toLocaleString()} - {entry.action}
                  </li>
                ))
              ) : (
                <p>No history available.</p>
              )}
            </ul>
          )}
        </div>
      </section>

      <section id="about-section" className="section hidden">
        <div className="content">
          <h2>Interactive things</h2>
        </div>
      </section>
      </div>
    </Router>
  );
}

export default App;



