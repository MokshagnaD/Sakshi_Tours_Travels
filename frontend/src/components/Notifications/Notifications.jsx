import { useState, useEffect } from 'react';
import { notificationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchNotifications = async () => {
      try {
        const response = await notificationAPI.getAll();
        setNotifications(response.data);
      } catch (err) {
        console.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isAuthenticated]);

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  if (!isAuthenticated) {
    return <div style={{ padding: '2rem' }}>Please login to view notifications.</div>;
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading notifications...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {notifications.map((notification) => (
            <div 
              key={notification._id} 
              style={{ 
                border: '1px solid #ccc', 
                padding: '1rem', 
                borderRadius: '8px',
                backgroundColor: notification.read ? '#f8f9fa' : '#fff3cd'
              }}
            >
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
              {!notification.read && (
                <button 
                  onClick={() => markAsRead(notification._id)}
                  style={{ 
                    marginLeft: '1rem', 
                    padding: '0.25rem 0.5rem', 
                    fontSize: '0.8rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};