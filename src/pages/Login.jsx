import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import './Signup.css';
import { login } from '../Utils/user';

function Login() {
    const navigate = useNavigate();
    const { saveLogin } = useUser();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

   const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(formData);
            if (data.status === "fail") {
                toast.error(`${data.message}`);
                return;
            };

            // Save user data to context
            saveLogin(data.data.user);

            toast.success('Logged in successfully!');
            navigate('/');
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occured please check your internet connection and try again.");
        }
    };

    return (
        <div className="signup-page">
            <div className="container">
                <div className="signup-container">
                    <h2>Welcome Back</h2>
                    <p className="signup-subtitle">Sign in to your Shoppy account</p>

                    <form className="signup-form" onSubmit={handleSubmit}>
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

                        <button type="submit" className="signup-btn">
                            Sign In
                        </button>
                    </form>

                    <p className="login-link">
                        Don't have an account? <span onClick={() => navigate('/signup')} style={{ cursor: 'pointer', color: '#B8860B' }}>Sign up here</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
