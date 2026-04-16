import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './AdminOrders.css';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
];

const getStatusClass = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'pending':
      return 'status-pending';
    case 'delivered':
      return 'status-delivered';
    case 'failed':
      return 'status-failed';
    default:
      return '';
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/orders/admin?limit=1000', { credentials: 'include' });
      const data = await res.json();
      if (data.status !== 'success') {
        toast.error(data.message || 'Failed to load orders.');
        setOrders([]);
        return;
      }
      setOrders(data.data?.orders || []);
    } catch (error) {
      console.error('Order fetch error:', error);
      toast.error('Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (trackingId, newStatus) => {
    try {
      const res = await fetch(`/api/v1/orders/admin/${trackingId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.status !== 'success') {
        toast.error(data.message || 'Status update failed.');
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.trackingId === trackingId ? { ...order, status: newStatus } : order
        )
      );
      toast.success('Order status updated.');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Unable to update order status.');
    }
  };

  return (
    <div className="admin-orders">
      <h2>Order Management</h2>

      <div className="orders-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tracking</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading orders...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6">No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => {
                const dateValue = new Date(order.date || order.createdAt || Date.now());
                return (
                  <tr key={order._id || order.trackingId}>
                    <td>{order.trackingId || order._id?.slice(0, 8)}</td>
                    <td>{order.customerName || 'Customer'}</td>
                    <td>{dateValue.toLocaleDateString()}</td>
                    <td>NGN {Number(order.total || 0).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusChange(order.trackingId, e.target.value)}
                        className="status-select"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
