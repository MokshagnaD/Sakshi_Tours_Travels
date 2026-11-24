import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchBookings();
    }
  }, [isAdmin]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/bookings?all=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data || []);
      } else {
        // Demo data fallback
        setBookings([
          { _id: '1', user: { name: 'John Doe' }, package: { title: 'Goa Package' }, travelers: 2, totalAmount: 15000, status: 'pending', createdAt: new Date() },
          { _id: '2', user: { name: 'Jane Smith' }, package: { title: 'Kerala Package' }, travelers: 4, totalAmount: 25000, status: 'confirmed', createdAt: new Date() }
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      // Demo data fallback
      setBookings([
        { _id: '1', user: { name: 'John Doe' }, package: { title: 'Goa Package' }, travelers: 2, totalAmount: 15000, status: 'pending', createdAt: new Date() },
        { _id: '2', user: { name: 'Jane Smith' }, package: { title: 'Kerala Package' }, travelers: 4, totalAmount: 25000, status: 'confirmed', createdAt: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };


  


  const updateBookingStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login as admin');
        return;
      }
      
      // Try server update first
      try {
        const response = await fetch(`http://localhost:5001/api/bookings/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        });
        
        if (response.ok) {
          setBookings(prev => prev.map(booking => 
            booking._id === id ? { ...booking, status } : booking
          ));
          if (status === 'confirmed') {
            alert('Booking confirmed successfully! E-receipt will be sent to customer.');
          } else {
            alert('Booking status updated successfully!');
          }
          return;
        }
      } catch (serverErr) {
        console.warn('Server unavailable, updating locally:', serverErr);
      }
      
      // Fallback to local update if server fails
      setBookings(prev => prev.map(booking => 
        booking._id === id ? { ...booking, status } : booking
      ));
      alert('Booking status updated (offline mode)');
      
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update booking status');
    }
  };

  if (!isAdmin) {
    return <div style={{ padding: '2rem' }}>Access denied.</div>;
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading bookings...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>Bookings Management</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>

          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '0.5rem 1rem',
              background: filter === 'all' ? '#007bff' : '#f8f9fa',
              color: filter === 'all' ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            style={{
              padding: '0.5rem 1rem',
              background: filter === 'confirmed' ? '#28a745' : '#f8f9fa',
              color: filter === 'confirmed' ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            style={{
              padding: '0.5rem 1rem',
              background: filter === 'pending' ? '#ffc107' : '#f8f9fa',
              color: filter === 'pending' ? 'black' : '#333',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            style={{
              padding: '0.5rem 1rem',
              background: filter === 'cancelled' ? '#dc3545' : '#f8f9fa',
              color: filter === 'cancelled' ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
          </button>
        </div>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {bookings
            .filter(booking => filter === 'all' || booking.status === filter)
            .map((booking) => (
            <div key={booking._id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>{booking.package?.title || 'N/A'}</h4>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>Booking ID: {booking._id}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    background: booking.status === 'confirmed' ? '#d4edda' : 
                               booking.status === 'pending' ? '#fff3cd' : '#f8d7da',
                    color: booking.status === 'confirmed' ? '#155724' : 
                           booking.status === 'pending' ? '#856404' : '#721c24'
                  }}>
                    {booking.status.toUpperCase()}
                  </span>
                  
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      ✓ Confirm
                    </button>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'pending')}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#ffc107',
                          color: 'black',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        ⏳ Set Pending
                      </button>

                    </>
                  )}
                  

                </div>
              </div>
              
              {/* Customer Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h5 style={{ margin: '0 0 0.5rem 0', color: '#ff6b35', fontSize: '1rem' }}>👤 Customer Details</h5>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Name:</strong> {booking.user?.name || 'N/A'}</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Email:</strong> {booking.travelerDetails?.email || booking.user?.email || 'N/A'}</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Mobile:</strong> {booking.travelerDetails?.mobile || booking.user?.phone || 'N/A'}</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Address:</strong> {booking.travelerDetails?.address || 'N/A'}</p>
                </div>
                
                <div>
                  <h5 style={{ margin: '0 0 0.5rem 0', color: '#004aad', fontSize: '1rem' }}>🛏️ Room Details</h5>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Room Type:</strong> {booking.travelerDetails?.roomType || 'Double'}</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Number of Rooms:</strong> {booking.travelerDetails?.numberOfRooms || '1'}</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Special Requests:</strong> {booking.travelerDetails?.specialRequests || 'None'}</p>
                </div>
              </div>
              
              {/* Travelers Details */}
              {booking.travelerDetails?.travelers && (
                <div style={{ marginBottom: '1rem' }}>
                  <h5 style={{ margin: '0 0 0.5rem 0', color: '#28a745', fontSize: '1rem' }}>👥 Travelers ({booking.travelers})</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {booking.travelerDetails.travelers.map((traveler, index) => (
                      <div key={index} style={{ background: '#f8f9fa', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                        <strong>{traveler.name || `Traveler ${index + 1}`}</strong><br />
                        Age: {traveler.age}, Gender: {traveler.gender}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Booking & Payment Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                <div>
                  <h5 style={{ margin: '0 0 0.5rem 0', color: '#6c757d', fontSize: '0.9rem' }}>📅 Booking Details</h5>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.8rem' }}><strong>Travel Date:</strong> {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : 'N/A'}</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.8rem' }}><strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString()}</p>
                </div>
                
                <div>
                  <h5 style={{ margin: '0 0 0.5rem 0', color: '#6c757d', fontSize: '0.9rem' }}>💳 Payment Details</h5>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.8rem' }}><strong>Total Amount:</strong> ₹{booking.totalAmount?.toLocaleString() || '0'}</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.8rem' }}><strong>Payment Mode:</strong> {booking.paymentInfo?.method || 'Card'}</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.8rem' }}><strong>Payment Status:</strong> {booking.paymentInfo?.status || 'Pending'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {bookings.filter(booking => filter === 'all' || booking.status === filter).length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          No {filter === 'all' ? '' : filter} bookings found.
        </div>
      )}
    </div>
  );
};