import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    orders: 0,
    customers: 0,
    products: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({ pending: 0, delivered: 0, failed: 0 });

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          fetch('/api/v1/products?limit=1000', { credentials: 'include' }),
          fetch('/api/v1/orders/admin?limit=1000', { credentials: 'include' }),
          fetch('/api/v1/user/admin/users?limit=1000', { credentials: 'include' }),
        ]);

        const [productsData, ordersData, usersData] = await Promise.all([
          productsRes.json(),
          ordersRes.json(),
          usersRes.json(),
        ]);

        if (productsData.status !== 'success') {
          toast.error(productsData.message || 'Failed to load products.');
        }
        if (ordersData.status !== 'success') {
          toast.error(ordersData.message || 'Failed to load orders.');
        }
        if (usersData.status !== 'success') {
          toast.error(usersData.message || 'Failed to load users.');
        }

        const products = productsData.data?.products || [];
        const orders = ordersData.data?.orders || [];
        const users = usersData.data?.users || [];

        const totalSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
        const customerCount = users.filter((user) => user.role === 'user').length;

        const sortedOrders = [...orders].sort((a, b) => {
          const aDate = new Date(a.date || a.createdAt || 0).getTime();
          const bDate = new Date(b.date || b.createdAt || 0).getTime();
          return bDate - aDate;
        });

        setStats({
          totalSales,
          orders: orders.length,
          customers: customerCount,
          products: products.length,
        });
        setRecentOrders(sortedOrders.slice(0, 5));
        setAllOrders(orders);

        const statusMap = orders.reduce(
          (acc, order) => {
            const statusKey = (order.status || 'pending').toLowerCase();
            if (statusKey in acc) {
              acc[statusKey] += 1;
            }
            return acc;
          },
          { pending: 0, delivered: 0, failed: 0 }
        );
        setStatusCounts(statusMap);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const displayStats = useMemo(
    () => [
      { label: 'Total Sales', value: `NGN ${stats.totalSales.toFixed(2)}`, icon: 'SALES' },
      { label: 'Orders', value: stats.orders.toString(), icon: 'ORD' },
      { label: 'Customers', value: stats.customers.toString(), icon: 'USR' },
      { label: 'Products', value: stats.products.toString(), icon: 'SKU' },
    ],
    [stats]
  );

  const revenueSeries = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return date;
    });

    const totalsByDay = {};
    days.forEach((day) => {
      const key = day.toISOString().slice(0, 10);
      totalsByDay[key] = 0;
    });

    allOrders.forEach((order) => {
      const rawDate = order.date || order.createdAt;
      if (!rawDate) return;
      const dateKey = new Date(rawDate).toISOString().slice(0, 10);
      if (dateKey in totalsByDay) {
        totalsByDay[dateKey] += Number(order.total || 0);
      }
    });

    return days.map((day) => {
      const key = day.toISOString().slice(0, 10);
      const label = day.toLocaleDateString(undefined, { weekday: 'short' });
      return { label, value: totalsByDay[key] };
    });
  }, [allOrders]);

  const maxRevenue = Math.max(...revenueSeries.map((item) => item.value), 1);
  const hasRevenue = revenueSeries.some((item) => item.value > 0);
  const formatAmount = (value) =>
    new Intl.NumberFormat('en-NG', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-headline">
        <div>
          <p className="dashboard-kicker">Operations Overview</p>
          <h2>Admin Dashboard</h2>
        </div>
        <div className="dashboard-chip">Live data synced</div>
      </div>

      <div className="stats-grid">
        {displayStats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Revenue (last 7 days)</h3>
              <p>Orders captured within the last week</p>
            </div>
            <div className="panel-metric">NGN {stats.totalSales.toFixed(2)}</div>
          </div>
          {hasRevenue ? (
            <div className="bar-chart">
              {revenueSeries.map((item) => (
                <div key={item.label} className="bar-wrapper">
                <div
                  className="bar"
                  style={{ height: `${(item.value / maxRevenue) * 100}%` }}
                  title={`NGN ${item.value.toFixed(2)}`}
                />
                {item.value > 0 && (
                  <span className="bar-value">NGN {formatAmount(item.value)}</span>
                )}
                <span className="bar-label">{item.label}</span>
              </div>
            ))}
          </div>
          ) : (
            <div className="activity-placeholder">
              <p>No revenue recorded in the last 7 days.</p>
            </div>
          )}
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Order Status</h3>
              <p>Distribution from recent orders</p>
            </div>
            <div className="panel-metric">{stats.orders} total</div>
          </div>
          <div className="status-grid">
            <div className="status-card">
              <span>Pending</span>
              <strong>{statusCounts.pending}</strong>
            </div>
            <div className="status-card">
              <span>Delivered</span>
              <strong>{statusCounts.delivered}</strong>
            </div>
            <div className="status-card">
              <span>Failed</span>
              <strong>{statusCounts.failed}</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-panel recent-activity">
          <div className="panel-header">
            <div>
              <h3>Recent Activity</h3>
              <p>Latest five orders</p>
            </div>
          </div>
          {loading ? (
            <div className="activity-placeholder">
              <p>Loading activity...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="activity-placeholder">
              <p>No recent orders available.</p>
            </div>
          ) : (
            <div className="activity-list">
              {recentOrders.map((order) => {
                const dateValue = new Date(order.date || order.createdAt || Date.now());
                return (
                  <div key={order._id || order.trackingId} className="activity-item">
                    <div>
                      <div className="activity-title">
                        Order {order.trackingId || order._id?.slice(0, 8)}
                      </div>
                      <div className="activity-meta">
                        {dateValue.toLocaleDateString()} - {order.customerName || 'Customer'}
                      </div>
                    </div>
                    <div className="activity-amount">NGN {Number(order.total || 0).toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
