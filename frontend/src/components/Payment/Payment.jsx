import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // First try to use booking data from navigation state
        const stateBooking = location.state?.bookingData;
        if (stateBooking) {
          console.log('Using booking data from state:', stateBooking);
          setBooking(stateBooking);
          setLoading(false);
          return;
        }
        
        // Fallback to API fetch
        const response = await fetch(`http://localhost:5001/api/bookings/${bookingId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setBooking(data);
        } else {
          alert('Failed to load booking details');
          navigate('/bookings');
        }
      } catch (err) {
        console.error('Failed to load booking:', err);
        alert('Failed to load booking details');
        navigate('/bookings');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, location.state, navigate]);

  const handlePayment = async () => {
    if (paymentMethod === 'upi' && !upiId) {
      alert('Please enter UPI ID');
      return;
    }
    
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await fetch(`http://localhost:5001/api/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookingId,
          status: 'succeeded',
          transactionId: `txn_${Date.now()}`,
          method: paymentMethod,
          upiId: paymentMethod === 'upi' ? upiId : undefined
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        alert('Payment successful! Your booking is confirmed.');
        navigate('/bookings');
      } else {
        throw new Error(result.msg || 'Payment confirmation failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (!booking) return <div style={{ padding: '2rem' }}>Booking not found</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Payment</h1>
      <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3>Booking Summary</h3>
        <p><strong>Package:</strong> {booking.package?.title || 'N/A'}</p>
        <p><strong>Travelers:</strong> {booking.travelers || 0}</p>
        <p><strong>Total Amount:</strong> ₹{booking.totalAmount?.toLocaleString() || '0'}</p>
        {booking.travelDate && <p><strong>Travel Date:</strong> {new Date(booking.travelDate).toLocaleDateString()}</p>}
      </div>

      <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3>Payment Method</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', cursor: 'pointer' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: '2px solid #007bff',
              marginRight: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: paymentMethod === 'card' ? '#007bff' : 'white'
            }}>
              {paymentMethod === 'card' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }}></div>}
            </div>
            <input
              type="radio"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ display: 'none' }}
            />
            💳 Credit/Debit Card
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: '2px solid #007bff',
              marginRight: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: paymentMethod === 'upi' ? '#007bff' : 'white'
            }}>
              {paymentMethod === 'upi' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }}></div>}
            </div>
            <input
              type="radio"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ display: 'none' }}
            />
            📱 UPI Payment
          </label>
        </div>
        
        {paymentMethod === 'card' && (
          <div>
            <input
              type="text"
              placeholder="Card Number"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            />
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="MM/YY"
                style={{ flex: 1, padding: '0.5rem' }}
              />
              <input
                type="text"
                placeholder="CVV"
                style={{ flex: 1, padding: '0.5rem' }}
              />
            </div>
            <input
              type="text"
              placeholder="Cardholder Name"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
        )}
        
        {paymentMethod === 'upi' && (
          <div>
            <input
              type="text"
              placeholder="Enter UPI ID (e.g., user@paytm)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
        )}
      </div>

      <button
        onClick={handlePayment}
        disabled={processing}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: processing ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1.1rem',
          cursor: processing ? 'not-allowed' : 'pointer'
        }}
      >
        {processing ? 'Processing...' : `Pay ₹${booking.totalAmount} via ${paymentMethod.toUpperCase()}`}
      </button>
    </div>
  );
};