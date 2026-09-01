import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signIn } from '../lib/authClient';
import './Landing.css';

const SAMPLE_POSTS = [
  {
    id: 1,
    handle: '@shadow_dev',
    category: 'Red Flag',
    categoryColor: '#cc1016',
    categoryBg: '#fde8e8',
    text: '"Culture fit" just means they want someone who won\'t push back when they move goalposts every sprint.',
    votes: 847,
  },
  {
    id: 2,
    handle: '@anon_pm_43',
    category: 'Burnout Log',
    categoryColor: '#b45309',
    categoryBg: '#fef3c7',
    text: 'Day 312 of "we\'ll fix the process soon." My notice letter is already drafted.',
    votes: '2.1k',
  },
  {
    id: 3,
    handle: '@ghost_engineer',
    category: 'Compensation',
    categoryColor: '#166534',
    categoryBg: '#dcfce7',
    text: 'Asked for a 20% raise backed by market data. Got offered a "title change." Took the competing offer.',
    votes: 1543,
  },
  {
    id: 4,
    handle: '@invisible_ic',
    category: 'Expectation vs Reality',
    categoryColor: '#5b21b6',
    categoryBg: '#ede9fe',
    text: 'Job post: "fast-paced startup." Reality: 11pm Slack pings and your manager Ccs their manager on everything.',
    votes: 673,
  },
  {
    id: 5,
    handle: '@burnt_out_84',
    category: 'Culture',
    categoryColor: '#0369a1',
    categoryBg: '#e0f2fe',
    text: 'Free snacks and ping pong are a distraction tactic. I\'d trade it all for one more engineer on the team.',
    votes: 912,
  },
];

const Landing = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: window.location.origin + '/feed',
      });
    } catch (err) {
      console.error('Google sign-in failed:', err);
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">

      {/* NAV */}
      <nav className="landing-nav">
        <Link to="/" className="landing-logo-link">
          <img src="/logo.png" alt="Vantish" className="landing-logo-img" />
          <span className="landing-logo-name">Vantish</span>
        </Link>
        <div className="landing-nav-right">
          <Link to="/signin" className="landing-btn-signin">Sign in</Link>
          <Link to="/signup" className="landing-btn-join">Join now</Link>
        </div>
      </nav>

      {/* HERO */}
      <main className="landing-main">
        <div className="landing-content">
          <p className="landing-eyebrow">Anonymous · Professional · Unfiltered</p>
          <h1 className="landing-title">
            The truth about<br />work, finally.
          </h1>
          <p className="landing-subtitle">
            Glassdoor meets Reddit. Share workplace realities, red flags, and compensation truths — without risking your career.
          </p>

          <div className="landing-auth-forms">
            <button
              id="landing-google-btn"
              className="btn-google"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <GoogleIcon />
              {loading ? 'Redirecting…' : 'Continue with Google'}
            </button>

            <Link to="/signup" className="btn-email">
              Join with email
            </Link>

            <div className="landing-terms">
              By joining you agree to Vantish's{' '}
              <a href="#">User Agreement</a>,{' '}
              <a href="#">Privacy Policy</a>, and{' '}
              <a href="#">Cookie Policy</a>.
            </div>

            <div className="landing-join-prompt">
              Already on Vantish? <Link to="/signin">Sign in</Link>
            </div>
          </div>
        </div>

        {/* FLOATING CARDS */}
        <div className="landing-illustration" aria-hidden="true">
          <div className="cards-stack">
            {SAMPLE_POSTS.map((post, i) => (
              <div
                key={post.id}
                className="preview-card"
                style={{ '--card-index': i }}
              >
                <div className="preview-card-top">
                  <span className="anon-avatar">👻</span>
                  <span className="anon-handle">{post.handle}</span>
                </div>
                <span
                  className="preview-tag"
                  style={{
                    color: post.categoryColor,
                    background: post.categoryBg,
                  }}
                >
                  {post.category}
                </span>
                <p className="preview-text">{post.text}</p>
                <div className="preview-footer">
                  <span className="preview-votes">↑ {post.votes} relatable</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>



      {/* VALUE PROPS */}
      <section className="landing-values">
        {[
          { icon: '👻', title: 'Fully Anonymous', desc: 'Your name, photo, and employer are never attached to your posts. Ever.' },
          { icon: '🎯', title: 'Actually Relatable', desc: 'Vote on posts that hit close to home. The truth rises to the top.' },
          { icon: '🔒', title: 'Safe to Speak', desc: 'No professional network risks. No career consequences. Just honesty.' },
        ].map((v) => (
          <div key={v.title} className="landing-value-card">
            <span className="landing-value-icon">{v.icon}</span>
            <h3 className="landing-value-title">{v.title}</h3>
            <p className="landing-value-desc">{v.desc}</p>
          </div>
        ))}
      </section>

      <footer className="landing-footer">
        <img src="/logo.png" alt="Vantish" style={{ height: '28px' }} />
        <span>© 2026 Vantish · Anonymity guaranteed</span>
      </footer>
    </div>
  );
};

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18" style={{ flexShrink: 0 }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

export default Landing;
