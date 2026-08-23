import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="landing-logo">
          Link<span style={{ backgroundColor: '#0a66c2', color: '#fff', padding: '0 4px', borderRadius: '4px', marginLeft: '2px' }}>in</span>
        </div>
        <div className="landing-nav-right">
          <ul className="landing-nav-links">
            <li className="landing-nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M23 4v12a2 2 0 01-2 2H3a2 2 0 01-2-2V4a2 2 0 012-2h18a2 2 0 012 2zM3 4v12h18V4H3zm4 3h10v2H7V7zm0 4h7v2H7v-2z" fill="currentColor"/>
              </svg>
              Articles
            </li>
            <li className="landing-nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 11a4 4 0 10-4-4 4 4 0 004 4zm0-6a2 2 0 11-2 2 2 2 0 012-2zm9 15v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1h2v-1a2 2 0 012-2h10a2 2 0 012 2v1h2z" fill="currentColor"/>
              </svg>
              People
            </li>
            <li className="landing-nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M21 4v14a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2zM5 4v14h14V4H5zm4 11h6v2H9v-2zm0-4h6v2H9v-2zm0-4h6v2H9V7z" fill="currentColor"/>
              </svg>
              Learning
            </li>
            <li className="landing-nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M17 6V4a2 2 0 00-2-2h-6a2 2 0 00-2 2v2H3v14a2 2 0 002 2h14a2 2 0 002-2V6h-4zm-8-2h6v2H9V4zm10 16H5V8h14v12z" fill="currentColor"/>
              </svg>
              Jobs
            </li>
            <li className="landing-nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M21 4v14a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2zM5 4v14h14V4H5zm4.5-9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-2.5 5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-2.5 5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="currentColor"/>
              </svg>
              Games
            </li>
          </ul>
          <div className="landing-auth-buttons">
            <Link to="/signup" className="landing-btn-join">Join now</Link>
            <Link to="/signup" className="landing-btn-signin">Sign in</Link>
          </div>
        </div>
      </nav>

      <main className="landing-main">
        <div className="landing-content">
          <h1 className="landing-title">Grow your professional network and discover jobs and career tips</h1>
          <div className="landing-auth-forms">
            <button className="btn-google">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Continue with Google
            </button>
            <Link to="/signup" className="btn-email" style={{ display: 'flex' }}>
              Sign in with email
            </Link>
            <div className="landing-terms">
              By clicking Continue to join or sign in, you agree to LinkedIn's <a href="#">User Agreement</a>, <a href="#">Privacy Policy</a>, and <a href="#">Cookie Policy</a>.
            </div>
            <div className="landing-join-prompt">
              New to LinkedIn? <Link to="/signup">Join now</Link>
            </div>
          </div>
        </div>
        <div className="landing-illustration">
          <svg viewBox="0 0 800 600" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="600" fill="#ffffff" />
            <circle cx="400" cy="300" r="250" fill="#f3f2ef" />
            {/* Simple abstract illustration resembling a person on a laptop with elements around */}
            <path d="M400 450 Q450 300 550 400 L650 500 L150 500 Z" fill="#e8e5df" />
            <rect x="550" y="200" width="150" height="200" rx="10" fill="#dce6f1" />
            <circle cx="200" cy="200" r="40" fill="#dce6f1" />
            <rect x="350" y="250" width="100" height="150" rx="50" fill="#000" />
            <rect x="300" y="400" width="200" height="100" fill="#0a66c2" />
            <rect x="320" y="380" width="80" height="50" transform="rotate(-30 320 380)" fill="#38434F" />
            <rect x="150" y="480" width="500" height="20" fill="#dce6f1" />
          </svg>
        </div>
      </main>

      <section className="landing-pills-section">
        <div className="landing-pills-container">
          <h2 className="landing-pills-title">Find the right job or internship for you</h2>
          <div className="landing-pills-list">
            <button className="landing-pill">Engineering</button>
            <button className="landing-pill">Business Development</button>
            <button className="landing-pill">Finance</button>
            <button className="landing-pill">Administrative Assistant</button>
            <button className="landing-pill">Retail Associate</button>
            <button className="landing-pill">Customer Service</button>
            <button className="landing-pill">Operations</button>
            <button className="landing-pill">Information Technology</button>
            <button className="landing-pill">Marketing</button>
            <button className="landing-pill">Human Resources</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
