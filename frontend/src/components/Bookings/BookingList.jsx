import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchBookings = async () => {
      try {
        setError(null);
        console.log('🔄 Fetching user bookings...');
        const response = await bookingAPI.getAll();
        console.log('📋 API Response:', response);

        if (response.data && Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error('❌ Failed to load bookings:', err);
        setError(err.response?.data?.msg || 'Failed to connect to booking service. Please try again later.');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div style={{ padding: '2rem' }}>Please login to view your bookings.</div>;
  }

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>🔄 Loading your bookings...</div>
      <div style={{ color: '#666' }}>Please wait while we fetch your booking history</div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#dc2626',
            textAlign: 'center',
            marginBottom: '0.5rem'
          }}>📋 My Bookings</h1>
          <p style={{
            textAlign: 'center',
            color: '#666',
            fontSize: '1.1rem'
          }}>Track and manage your travel bookings</p>
        </div>

        {error ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: '#fff3cd',
            borderRadius: '12px',
            border: '1px solid #ffeeba',
            color: '#856404'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ marginBottom: '1rem' }}>Service Unavailable</h3>
            <p style={{ marginBottom: '2rem' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 2rem',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '2px dashed #dee2e6'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ color: '#6c757d', marginBottom: '1rem' }}>No Bookings Found</h3>
            <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
              You haven't made any bookings yet. Start exploring our amazing travel packages!
            </p>
            <Link
              to="/packages"
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                background: '#dc2626',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              🌟 Browse Packages
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {bookings.map((booking) => (
              <div key={booking._id} style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#333' }}>
                    {booking.package?.title || 'Package'}
                  </h3>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    background: booking.status === 'confirmed' ? '#d4edda' : '#fff3cd',
                    color: booking.status === 'confirmed' ? '#155724' : '#856404'
                  }}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Travelers</p>
                    <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{booking.travelers} people</p>
                  </div>
                  <div>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Amount</p>
                    <p style={{ fontWeight: '600', fontSize: '1.1rem', color: '#dc2626' }}>
                      ₹{booking.totalAmount?.toLocaleString('en-IN') || '0'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Booking Date</p>
                    <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                      {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  {booking.travelDate && (
                    <div>
                      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Travel Date</p>
                      <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                        {new Date(booking.travelDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  )}
                </div>

                <Link
                  to={`/bookings/${booking._id}`}
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    background: '#dc2626',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};