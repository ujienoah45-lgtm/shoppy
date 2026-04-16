import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import './Signup.css';
import { signup } from '../Utils/user';

function Signup() {
  const navigate = useNavigate();
  const { saveLogin } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.warning('Passwords do not match!');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.warning('Please agree to the terms and conditions!');
      return;
    }

    try {
      const data = await signup(formData);
      if (data.status === 'success') {
        saveLogin(data.data.user);
        setSubmitted(true);
        toast.success('Account created successfully!');
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error(`Account creation failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="signup-page">
        <div className="container">
          <div className="signup-success">
            <h2>✓ Account Created Successfully!</h2>
            <p>Welcome to Shoppy! Your account is ready to use.</p>
            <p>You can now start shopping and enjoy exclusive offers.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="signup-page">
      <div className="container">
        <div className="signup-container">
          <h2>Create Your Shoppy Account</h2>
          <p className="signup-subtitle">Join us and start shopping today!</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
              />
              <label htmlFor="agreeToTerms">
                I agree to the Terms and Conditions
              </label>
            </div>

            <button type="submit" className="signup-btn">
              Create Account
            </button>
          </form>

          <p className="login-link">
            Already have an account? <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#B8860B' }}>Sign in here</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
