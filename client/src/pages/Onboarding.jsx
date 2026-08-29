import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { usersApi } from '../api/users';
import './Onboarding.css';

const Onboarding = () => {
  const { sessionUser, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    role: '', // 'student' or 'employed', 'software_engineer', etc.
    organizations: '',
    organization_type: '',
    course: '',
    graduationYear: new Date().getFullYear(),
    position: '',
    Experience: 0,
  });

  const [consentChecked, setConsentChecked] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'graduationYear' || name === 'Experience' ? Number(value) : value,
    }));
    // Clear errors when typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep1 = () => {
    const errors = {};
    if (!formData.username) errors.username = 'Username is required';
    else if (formData.username.length < 3) errors.username = 'Username must be at least 3 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) errors.username = 'Only letters, numbers, and underscores are allowed';
    
    if (!formData.role) errors.role = 'Please select a role';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!formData.organizations) errors.organizations = 'Organization name is required';
    if (!formData.organization_type) errors.organization_type = 'Please select organization type';
    if (!formData.course) errors.course = 'Course/field of study is required';

    if (formData.role === 'student') {
      if (!formData.graduationYear) errors.graduationYear = 'Graduation year is required';
    } else {
      if (!formData.position) errors.position = 'Position/Title is required';
      if (formData.Experience === undefined || formData.Experience < 0) {
        errors.Experience = 'Experience cannot be negative';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentChecked) {
      setError('You must acknowledge and accept the community rules to proceed.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Build request body per Zod validator
      const payload = {
        username: formData.username,
        bio: formData.bio || undefined,
        role: formData.role,
        organizations: formData.organizations,
        organization_type: formData.organization_type,
        course: formData.course,
      };

      if (formData.role === 'student') {
        payload.graduationYear = Number(formData.graduationYear);
      } else {
        payload.position = formData.position;
        payload.Experience = Number(formData.Experience);
      }

      console.log('Submitting onboarding payload:', payload);
      const res = await usersApi.completeProfile(payload);
      console.log('Onboarding response from server:', res);
      await refreshUser(); // This triggers redirect to /feed in RouteGuards
    } catch (err) {
      console.error('Onboarding submission error:', err);
      setError(err.message || 'Failed to complete profile. Username may be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container card">
        <div className="onboarding-header">
          <h1 className="logo-text">Link<span>out</span></h1>
          <div className="step-indicator">
            <span className={step >= 1 ? 'active' : ''}>1</span>
            <span className={step >= 2 ? 'active' : ''}>2</span>
            <span className={step >= 3 ? 'active' : ''}>3</span>
          </div>
          <p className="text-secondary">Step {step} of 3</p>
        </div>

        {error && <div className="onboarding-error-alert">{error}</div>}

        {step === 1 && (
          <div className="onboarding-step animated-fade">
            <h2 className="text-h2">Tell us about yourself</h2>
            <p className="text-secondary margin-bottom">Vantish is anonymous, but we need a unique handle and basic role to customize your experience.</p>
            
            <div className="form-group">
              <label htmlFor="username" className="form-label">Choose a Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className={`form-input ${fieldErrors.username ? 'error' : ''}`}
                placeholder="e.g. anonymous_engineer"
                value={formData.username}
                onChange={handleInputChange}
              />
              {fieldErrors.username && <span className="error-text">{fieldErrors.username}</span>}
              <span className="input-hint">Letters, numbers, and underscores only. Cannot be changed easily.</span>
            </div>

            <div className="form-group">
              <label className="form-label">I am currently a...</label>
              <div className="role-selector-grid">
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'student' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                >
                  <span className="icon">🎓</span>
                  <span className="title">Student</span>
                  <span className="desc">Frustrated with coursework, exams, or internships</span>
                </button>
                
                <button
                  type="button"
                  className={`role-btn ${
                    ['employed', 'software_engineer', 'product_manager', 'designer', 'other_employed'].includes(formData.role)
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => setFormData({ ...formData, role: 'employed' })}
                >
                  <span className="icon">💼</span>
                  <span className="title">Professional</span>
                  <span className="desc">Venting about managers, compensation, or burnout</span>
                </button>
              </div>
              {fieldErrors.role && <span className="error-text">{fieldErrors.role}</span>}
            </div>

            {formData.role && formData.role !== 'student' && (
              <div className="form-group animate-slide-down">
                <label htmlFor="role-select" className="form-label">Employed Role Details</label>
                <select
                  id="role-select"
                  name="role"
                  className="form-input"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="employed">Employed (General)</option>
                  <option value="software_engineer">Software Engineer</option>
                  <option value="product_manager">Product Manager</option>
                  <option value="designer">Designer</option>
                  <option value="other_employed">Other Role</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="bio" className="form-label">Bio (Optional)</label>
              <textarea
                id="bio"
                name="bio"
                className="form-textarea"
                rows="3"
                placeholder="Say a bit about your experiences or what you want to vent about..."
                maxLength="300"
                value={formData.bio}
                onChange={handleInputChange}
              />
              <span className="input-hint">{300 - (formData.bio?.length || 0)} characters remaining</span>
            </div>

            <button type="button" className="btn-primary onboarding-next" onClick={handleNextStep}>
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step animated-fade">
            <h2 className="text-h2">Add academic/professional context</h2>
            <p className="text-secondary margin-bottom">We use this to verify relevance and contextualize your posts anonymously.</p>

            <div className="form-group">
              <label htmlFor="organizations" className="form-label">
                {formData.role === 'student' ? 'College/University Name' : 'Company/Employer Name'}
              </label>
              <input
                type="text"
                id="organizations"
                name="organizations"
                className={`form-input ${fieldErrors.organizations ? 'error' : ''}`}
                placeholder={formData.role === 'student' ? 'e.g. Stanford University' : 'e.g. Stripe'}
                value={formData.organizations}
                onChange={handleInputChange}
              />
              {fieldErrors.organizations && <span className="error-text">{fieldErrors.organizations}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="organization_type" className="form-label">Organization Type</label>
              <select
                id="organization_type"
                name="organization_type"
                className={`form-input ${fieldErrors.organization_type ? 'error' : ''}`}
                value={formData.organization_type}
                onChange={handleInputChange}
              >
                <option value="">Select organization type</option>
                {formData.role === 'student' ? (
                  <>
                    <option value="College">College</option>
                    <option value="University">University</option>
                    <option value="Other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="Startup">Startup</option>
                    <option value="MNC">MNC</option>
                    <option value="Agency">Agency</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>
              {fieldErrors.organization_type && <span className="error-text">{fieldErrors.organization_type}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="course" className="form-label">
                {formData.role === 'student' ? 'Major/Course' : 'Department/Field'}
              </label>
              <input
                type="text"
                id="course"
                name="course"
                className={`form-input ${fieldErrors.course ? 'error' : ''}`}
                placeholder="e.g. Computer Science"
                value={formData.course}
                onChange={handleInputChange}
              />
              {fieldErrors.course && <span className="error-text">{fieldErrors.course}</span>}
            </div>

            {formData.role === 'student' ? (
              <div className="form-group animate-slide-down">
                <label htmlFor="graduationYear" className="form-label">Graduation Year</label>
                <input
                  type="number"
                  id="graduationYear"
                  name="graduationYear"
                  className={`form-input ${fieldErrors.graduationYear ? 'error' : ''}`}
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                />
                {fieldErrors.graduationYear && <span className="error-text">{fieldErrors.graduationYear}</span>}
              </div>
            ) : (
              <>
                <div className="form-group animate-slide-down">
                  <label htmlFor="position" className="form-label">Position / Job Title</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    className={`form-input ${fieldErrors.position ? 'error' : ''}`}
                    placeholder="e.g. Backend Developer"
                    value={formData.position}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.position && <span className="error-text">{fieldErrors.position}</span>}
                </div>

                <div className="form-group animate-slide-down">
                  <label htmlFor="Experience" className="form-label">Years of Experience</label>
                  <input
                    type="number"
                    id="Experience"
                    name="Experience"
                    className={`form-input ${fieldErrors.Experience ? 'error' : ''}`}
                    value={formData.Experience}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.Experience && <span className="error-text">{fieldErrors.Experience}</span>}
                </div>
              </>
            )}

            <div className="onboarding-navigation-buttons">
              <button type="button" className="btn-secondary" onClick={handlePrevStep}>
                Back
              </button>
              <button type="button" className="btn-primary" onClick={handleNextStep}>
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-step animated-fade">
            <h2 className="text-h2">Community Rules & Safety</h2>
            <p className="text-secondary margin-bottom">Vantish is designed for sharing professional and student experiences and frustrations. To maintain a safe community, you must agree to these rules.</p>
            
            <div className="community-rules-box">
              <ul>
                <li>❌ <strong>No Harassment:</strong> Do not target or insult individual employees, coworkers, or classmates.</li>
                <li>❌ <strong>No Threats or Accusations:</strong> Do not post illegal threats or malicious false accusations.</li>
                <li>❌ <strong>No Doxxing:</strong> Never share private phone numbers, home addresses, or personal email addresses.</li>
                <li>❌ <strong>No Abuse of Flags:</strong> Do not abuse the reporting system to hide posts you disagree with.</li>
                <li>💡 <strong>Say what you can't say on LinkedIn:</strong> Focus on sharing workplace frustrations, burnout logs, culture critiques, and compensation logs, without losing professional integrity.</li>
              </ul>
            </div>

            <div className="consent-checkbox-container">
              <input
                type="checkbox"
                id="consent"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
              />
              <label htmlFor="consent">
                I understand that Vantish has zero tolerance for harassment and doxxing. I agree to keep my posts respectful and follow these community guidelines.
              </label>
            </div>

            <div className="onboarding-navigation-buttons">
              <button type="button" className="btn-secondary" onClick={handlePrevStep} disabled={loading}>
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading || !consentChecked}
              >
                {loading ? 'Completing Setup...' : 'Complete & Enter Feed'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
