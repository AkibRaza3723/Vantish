import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    // In a real app, handle authentication here
    // For this mockup, navigate to the feed
    navigate('/feed');
  };

  return (
    <div className="signup-container">
      <header className="signup-header">
        <Link to="/" className="signup-logo">
          Linked<span>in</span>
        </Link>
      </header>

      <main className="signup-main">
        <h1 className="signup-title">Join LinkedIn now — it's free!</h1>
        <p className="signup-subtitle">25+ people you may know are here</p>

        <div className="signup-card">
          <form onSubmit={handleJoin}>
            <div className="signup-form-group">
              <label className="signup-label">Email or phone number</label>
              <input type="text" className="signup-input" required />
            </div>

            <div className="signup-form-group">
              <label className="signup-label">Password</label>
              <div className="signup-input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="signup-input" 
                  required 
                />
                <button 
                  type="button" 
                  className="signup-show-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="signup-checkbox-group">
              <input type="checkbox" id="remember" className="signup-checkbox" />
              <label htmlFor="remember" className="signup-checkbox-label">Remember me</label>
            </div>

            <p className="signup-terms">
              By clicking Agree & Join or Continue, you agree to the LinkedIn <a href="#">User Agreement</a>, <a href="#">Privacy Policy</a>, and <a href="#">Cookie Policy</a>.
            </p>

            <button type="submit" className="signup-btn-submit">
              Agree & Join
            </button>
          </form>

          <div className="signup-divider">or</div>

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

          <div className="signup-login-prompt">
            Already on LinkedIn? <Link to="/signup">Sign in</Link>
          </div>
        </div>

        <div className="signup-business-prompt">
          Looking to create a page for a business? <a href="#">Get help</a>
        </div>
      </main>

      <footer className="signup-footer">
        <div className="signup-footer-logo">
          Linked<span>in</span> <span>© 2026</span>
        </div>
        <a href="#" className="signup-footer-item">About</a>
        <a href="#" className="signup-footer-item">Accessibility</a>
        <a href="#" className="signup-footer-item">User Agreement</a>
        <a href="#" className="signup-footer-item">Privacy Policy</a>
        <a href="#" className="signup-footer-item">Cookie Policy</a>
        <a href="#" className="signup-footer-item">Copyright Policy</a>
        <a href="#" className="signup-footer-item">Brand Policy</a>
        <a href="#" className="signup-footer-item">Guest Controls</a>
        <a href="#" className="signup-footer-item">Community Guidelines</a>
        <a href="#" className="signup-footer-item">Language ˅</a>
      </footer>
    </div>
  );
};

export default Signup;
