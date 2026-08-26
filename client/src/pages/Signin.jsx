import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../lib/authClient';
import './Signup.css';

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await signIn.email({
        email,
        password,
      });
      //pehle html ko use krke email password nikal rhe then submit pe jab dono hamare pass hai tab yei execute hoga and sign in triggeer hoga // better auth use krega then better auth session store krega then user data store krega. and response mei hame data { user , session } and error message bhejega.

      if (authError) {
        setError(authError.message || 'Invalid email or password.');
        return;
      }

      navigate('/feed');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn.social({ provider: 'google', callbackURL: '/feed' });
  };

  const handleGithubSignIn = async () => {
    await signIn.social({ provider: 'github', callbackURL: '/feed' });
  };

  return (
    <div className="signup-container">
      <header className="signup-header">
        <Link to="/" className="signup-logo">
          Link<span>out</span>
        </Link>
      </header>

      <main className="signup-main">
        <h1 className="signup-title">Sign in to Linkout</h1>
        <p className="signup-subtitle">Stay updated on your professional world</p>

        <div className="signup-card">
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button className="btn-google" onClick={handleGoogleSignIn} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Continue with Google
          </button>

          <button className="btn-google" onClick={handleGithubSignIn} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>

          <div className="signup-divider">or</div>

          <form onSubmit={handleSubmit}>
            <div className="signup-form-group">
              <label className="signup-label" htmlFor="signin-email">Email</label>
              <input
                id="signin-email"
                type="email"
                className="signup-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="signup-form-group">
              <label className="signup-label" htmlFor="signin-password">Password</label>
              <div className="signup-input-wrapper">
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="signup-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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

            <button
              type="submit"
              className="signup-btn-submit"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="signup-login-prompt">
            New to Linkout? <Link to="/signup">Join now</Link>
          </div>
        </div>
      </main>

      <footer className="signup-footer">
        <div className="signup-footer-logo">Linkout <span>© 2026</span></div>
        <a href="#" className="signup-footer-item">About</a>
        <a href="#" className="signup-footer-item">Accessibility</a>
        <a href="#" className="signup-footer-item">User Agreement</a>
        <a href="#" className="signup-footer-item">Privacy Policy</a>
        <a href="#" className="signup-footer-item">Cookie Policy</a>
      </footer>
    </div>
  );
};

export default Signin;
