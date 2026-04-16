import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../Utils/user';
import { useUser } from '../context/UserContext';
import './AdminAuth.css';

function AdminLogin() {
  const navigate = useNavigate();
  const { auth, saveLogin, clearLogout } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);
  const [now, setNow] = useState(Date.now());

  const isLocked = lockUntil > now;
  const retryInSeconds = useMemo(
    () => Math.max(0, Math.ceil((lockUntil - now) / 1000)),
    [lockUntil, now]
  );

  useEffect(() => {
    if (!isLocked) return undefined;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isLocked]);

  useEffect(() => {
    if (auth.loading) return;
    console.log(auth)
    if (auth.isAuthenticated && auth.userObj?.role === 'admin') {
      navigate('/admin', { replace: true });
      return;
    }

    if (auth.isAuthenticated && auth.userObj?.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [auth, navigate]);

  useEffect(() => {
    const existingMeta = document.querySelector('meta[name="robots"]');
    const previousContent = existingMeta?.getAttribute('content');

    let ownedMeta = existingMeta;
    if (!ownedMeta) {
      ownedMeta = document.createElement('meta');
      ownedMeta.setAttribute('name', 'robots');
      document.head.appendChild(ownedMeta);
    }

    ownedMeta.setAttribute('content', 'noindex,nofollow,noarchive');

    return () => {
      if (!ownedMeta) return;
      if (previousContent === null || previousContent === undefined) {
        ownedMeta.remove();
      } else {
        ownedMeta.setAttribute('content', previousContent);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyRetryCooldown = () => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);

    if (nextAttempts < 3) return;

    const delaySeconds = Math.min(60, 5 * (nextAttempts - 2));
    const lockTimestamp = Date.now() + delaySeconds * 1000;
    setLockUntil(lockTimestamp);
    setNow(Date.now());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      toast.info(`Too many attempts. Try again in ${retryInSeconds}s.`);
      return;
    }

    try {
      const data = await login(formData);

      if (data.status !== 'success') {
        toast.error(data.message || 'Admin login failed');
        applyRetryCooldown();
        return;
      }

      const user = data.data?.user;
      if (!user || user.role !== 'admin') {
        await clearLogout();
        toast.error('This portal is for admin accounts only.');
        applyRetryCooldown();
        return;
      }

      saveLogin(user);
      setFailedAttempts(0);
      setLockUntil(0);
      toast.success('Admin login successful');
      navigate('/admin');
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Unable to log in. Please try again.');
      applyRetryCooldown();
    }
  };

  return (
    <div className="admin-auth">
      <div className="admin-auth__shell">
        <section className="admin-auth__intro">
          <div className="admin-auth__badge">
            <span>Ops</span> Secure access
          </div>
          <h1 className="admin-auth__headline">Operations control room</h1>
          <p className="admin-auth__copy">
            Use your admin credentials to manage inventory, triage orders, and monitor performance.
          </p>
          <div className="admin-auth__meta">
            <div><strong>Role based</strong> Access enforced on every request.</div>
            <div><strong>Protection</strong> Automatic cooldown after failed attempts.</div>
            <div><strong>Session</strong> Secure cookies required.</div>
          </div>
        </section>

        <section className="admin-auth__card">
          <h2 className="admin-auth__title">Sign in</h2>
          <p className="admin-auth__subtitle">Authorized personnel only.</p>

          <form className="admin-auth__form" onSubmit={handleSubmit}>
            <div className="admin-auth__field">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter admin email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="admin-auth__field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="admin-auth__actions">
              <button type="submit" className="admin-auth__button" disabled={isLocked}>
                {isLocked ? `Retry in ${retryInSeconds}s` : 'Sign in'}
              </button>
              <div className="admin-auth__divider" />
              <span className="admin-auth__footnote">
                Need an account?{' '}
                <span className="admin-auth__link" onClick={() => navigate('/vault/ops/signup')}>
                  Request access
                </span>
              </span>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AdminLogin;
