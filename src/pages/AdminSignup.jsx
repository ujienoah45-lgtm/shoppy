import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signupAdmin } from '../Utils/user';
import { useUser } from '../context/UserContext';
import './AdminAuth.css';

function AdminSignup() {
  const navigate = useNavigate();
  const { auth, saveLogin } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (auth.loading) return;
    if (auth.isAuthenticated && auth.userObj?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [auth, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.warning('Passwords do not match.');
      return;
    }

    try {
      const data = await signupAdmin(formData);
      if (data.status !== 'success') {
        toast.error(data.message || 'Admin signup failed.');
        return;
      }

      const user = data.data?.user;
      saveLogin(user);
      toast.success('Admin account created.');
      navigate('/admin');
    } catch (error) {
      console.error('Admin signup error:', error);
      toast.error('Unable to create admin account.');
    }
  };

  return (
    <div className="admin-auth">
      <div className="admin-auth__shell">
        <section className="admin-auth__intro">
          <div className="admin-auth__badge">
            <span>Ops</span> Secure provisioning
          </div>
          <h1 className="admin-auth__headline">Register an operations account</h1>
          <p className="admin-auth__copy">
            Admin credentials grant access to product operations, order triage, and reporting.
            Use this form only for trusted staff.
          </p>
          <div className="admin-auth__meta">
            <div><strong>Access</strong> Restricted to verified personnel.</div>
            <div><strong>Audit</strong> All changes are tracked in the backend logs.</div>
            <div><strong>Support</strong> Contact engineering for onboarding.</div>
          </div>
        </section>

        <section className="admin-auth__card">
          <h2 className="admin-auth__title">Create admin profile</h2>
          <p className="admin-auth__subtitle">Fill in the official details used for access control.</p>
          <form className="admin-auth__form" onSubmit={handleSubmit}>
            <div className="admin-auth__field">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Ada Lovelace"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="admin-auth__field">
              <label htmlFor="email">Work email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="admin-auth__field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="admin-auth__field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="admin-auth__field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="admin-auth__actions">
              <button type="submit" className="admin-auth__button">Create admin account</button>
              <div className="admin-auth__divider" />
              <span className="admin-auth__footnote">
                Already provisioned?{' '}
                <span className="admin-auth__link" onClick={() => navigate('/vault/ops/login')}>
                  Sign in here
                </span>
              </span>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AdminSignup;
