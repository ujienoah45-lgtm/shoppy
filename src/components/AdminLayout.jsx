import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';
import './AdminLayout.css';

const AdminLayout = () => {
    const { auth } = useUser();
    const navigate = useNavigate();
    const user = auth.userObj;
    const loading = auth.loading;

    useEffect(() => {
        if (!loading && (!auth.isAuthenticated || !user || user.role !== 'admin')) {
            navigate('/vault/ops/login', { replace: true });
        }
    }, [auth.isAuthenticated, user, loading, navigate]);

    if (loading) return <div>Loading Admin Panel...</div>;
    if (!auth.isAuthenticated || !user || user.role !== 'admin') return null;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h3>Admin Panel</h3>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>
                        Products
                    </NavLink>
                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
                        Orders
                    </NavLink>
                </nav>
            </aside>
            <main className="admin-main-content">
                <div className="admin-role-banner">
                    Access confirmed: {user?.role} · Signed in as {user?.name || 'admin'}
                </div>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
