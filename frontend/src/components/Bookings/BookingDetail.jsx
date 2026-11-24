import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookingAPI } from '../../services/api';

export const BookingDetail = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingAPI.getById(id);
        setBooking(response.data);
      } catch (err) {
        console.error('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (!booking) return <div style={{ padding: '2rem' }}>Booking not found</div>;

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#17a2b8';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status, paymentStatus) => {
    if (status === 'pending' && paymentStatus === 'succeeded') {
      return 'Payment Complete - Awaiting Confirmation';
    }
    switch(status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #dc2626, #fbbf24)',
          color: 'white',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            🎫 Booking Details
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            {booking.package?.title || 'Package Details'}
          </p>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Booking Status */}
          <div style={{
            background: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '1px solid #4caf50'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>📋 Booking Information</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Booking ID: <strong>{booking._id}</strong></p>
              </div>
              <div style={{
                padding: '0.5rem 1rem',
                background: getStatusColor(booking.status),
                color: 'white',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '0.8rem',
                textAlign: 'center',
                minWidth: '200px'
              }}>
                {getStatusText(booking.status, booking.paymentInfo?.status)}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                  <strong>🕐 Booked On:</strong> {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                  <strong>⏰ Booking Time:</strong> {new Date(booking.createdAt).toLocaleString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
              <div>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                  <strong>💳 Payment Status:</strong> 
                  <span style={{
                    color: '#28a745',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    ✅ Payment Successful
                  </span>
                </p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                  <strong>🎫 Transaction ID:</strong> {booking.paymentInfo?.transactionId || `TXN${Date.now().toString().slice(-8)}`}
                </p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                  <strong>💳 Payment Method:</strong> {booking.paymentInfo?.method ? 
                    (booking.paymentInfo.method === 'upi' ? '📱 UPI Payment' : '💳 Card Payment') : 
                    '💳 Online Payment'
                  }
                </p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                  <strong>🗺️ Payment Date:</strong> {booking.paymentInfo?.paidAt ? 
                    new Date(booking.paymentInfo.paidAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 
                    new Date(booking.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Traveler Details */}
          {booking.travelerDetails?.travelers && booking.travelerDetails.travelers.length > 0 && (
            <div style={{
              border: '1px solid #eee',
              borderRadius: '12px',
              marginBottom: '2rem',
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#f8f9fa',
                padding: '1rem',
                borderBottom: '1px solid #eee'
              }}>
                <h3 style={{ margin: 0, color: '#dc2626' }}>👥 Traveler Details</h3>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {booking.travelerDetails.travelers.map((traveler, index) => (
                    <div key={index} style={{
                      background: '#f8f9fa',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>👤 Traveler {index + 1}</h4>
                          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                            <strong>Name:</strong> {traveler.name || 'N/A'}
                          </p>
                          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                            <strong>Age:</strong> {traveler.age || 'N/A'} years
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                            <strong>Gender:</strong> {traveler.gender ? traveler.gender.charAt(0).toUpperCase() + traveler.gender.slice(1) : 'Not specified'}
                          </p>
                          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                            <strong>Category:</strong> {
                              traveler.age <= 5 ? '👶 Child (Free)' :
                              traveler.age >= 6 && traveler.age <= 13 ? '🧒 Child (50% off)' :
                              traveler.age >= 60 ? '👴 Senior (5% off)' :
                              '👨 Adult'
                            }
                          </p>
                          {traveler.mealPreference && traveler.mealPreference !== 'None' && (
                            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                              <strong>🍽️ Meal Preference:</strong> {traveler.mealPreference}
                            </p>
                          )}
                          {traveler.seatNumber && (
                            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                              <strong>💺 Seat Number:</strong> {traveler.seatNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Contact Information */}
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                  borderRadius: '8px',
                  border: '1px solid #2196f3'
                }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#1976d2' }}>📞 Primary Contact Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                        <strong>👤 Full Name:</strong> {booking.travelerDetails?.fullName || 'Not provided'}
                      </p>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                        <strong>📧 Email:</strong> {booking.travelerDetails?.email || 'Not provided'}
                      </p>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                        <strong>📱 Mobile:</strong> {booking.travelerDetails?.mobile || 'Not provided'}
                      </p>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                        <strong>🏳️ Nationality:</strong> {booking.travelerDetails?.nationality || 'Indian'}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                        <strong>🏠 Address:</strong> {booking.travelerDetails?.address || 'Not provided'}
                      </p>
                      {booking.travelerDetails?.emergencyContact && (
                        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                          <strong>🆘 Emergency Contact:</strong> {booking.travelerDetails.emergencyContact}
                        </p>
                      )}
                      {booking.travelerDetails?.emergencyMobile && (
                        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                          <strong>📞 Emergency Mobile:</strong> {booking.travelerDetails.emergencyMobile}
                        </p>
                      )}
                      {booking.travelerDetails?.aadharNumber && (
                        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                          <strong>🆔 Aadhar Number:</strong> ****-****-{booking.travelerDetails.aadharNumber.slice(-4)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Package Details */}
          <div style={{
            border: '1px solid #eee',
            borderRadius: '12px',
            marginBottom: '2rem',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderBottom: '1px solid #eee'
            }}>
              <h3 style={{ margin: 0, color: '#dc2626' }}>🏖️ Package Information</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div>
                  <p><strong>📍 Destination:</strong> {booking.package?.destination || 'N/A'}</p>
                  <p><strong>⏱️ Duration:</strong> {booking.package?.durationDays || 'N/A'} days</p>
                  <p><strong>👥 Total Travelers:</strong> {booking.travelers} people</p>
                  <p><strong>💰 Package Price:</strong> ₹{booking.package?.price?.toLocaleString('en-IN') || 'N/A'} per person</p>
                </div>
                <div>
                  <p><strong>📅 Travel Date:</strong> {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'To be confirmed'}</p>
                  <p><strong>💳 Total Paid:</strong> ₹{booking.totalAmount?.toLocaleString('en-IN') || '0'}</p>
                  <p><strong>🏨 Accommodation:</strong> {booking.travelerDetails?.roomType ? 
                    `${booking.travelerDetails.numberOfRooms || 1} x ${booking.travelerDetails.roomType.charAt(0).toUpperCase() + booking.travelerDetails.roomType.slice(1)} Room` : 
                    'Standard accommodation'
                  }</p>
                </div>
              </div>
              
              {/* Additional Information */}
              <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {booking.travelerDetails?.specialRequests && (
                  <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>📝 Special Requests</h4>
                    <p style={{ margin: 0, color: '#856404', lineHeight: '1.6' }}>{booking.travelerDetails.specialRequests}</p>
                  </div>
                )}
                
                {booking.ticketNumber && (
                  <div style={{ padding: '1rem', background: '#d4edda', borderRadius: '8px', border: '1px solid #28a745' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#155724' }}>🎫 E-Ticket Information</h4>
                    <p style={{ margin: 0, color: '#155724', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 'bold' }}>
                      Ticket #: {booking.ticketNumber}
                    </p>
                  </div>
                )}
              </div>
              
              {booking.package?.description && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>📖 Description</h4>
                  <p style={{ margin: 0, color: '#666', lineHeight: '1.6' }}>{booking.package.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Inclusions & Features */}
          <div style={{
            border: '1px solid #eee',
            borderRadius: '12px',
            marginBottom: '2rem',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderBottom: '1px solid #eee'
            }}>
              <h3 style={{ margin: 0, color: '#dc2626' }}>✨ What's Included</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div>
                  <h4 style={{ color: '#28a745', marginBottom: '1rem' }}>🎯 Package Inclusions</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {booking.package?.inclusions?.map((item, index) => (
                      <li key={index} style={{ padding: '0.25rem 0', color: '#666' }}>
                        ✅ {item}
                      </li>
                    )) || [
                      <li key="1" style={{ padding: '0.25rem 0', color: '#666' }}>✅ Accommodation</li>,
                      <li key="2" style={{ padding: '0.25rem 0', color: '#666' }}>✅ Meals as per itinerary</li>,
                      <li key="3" style={{ padding: '0.25rem 0', color: '#666' }}>✅ Transportation</li>,
                      <li key="4" style={{ padding: '0.25rem 0', color: '#666' }}>✅ Sightseeing tours</li>
                    ]}
                  </ul>
                </div>
                
                <div>
                  <h4 style={{ color: '#007bff', marginBottom: '1rem' }}>🌟 Special Features</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ padding: '0.25rem 0', color: '#666' }}>🏨 Premium hotel stays</li>
                    <li style={{ padding: '0.25rem 0', color: '#666' }}>🚗 Private transportation</li>
                    <li style={{ padding: '0.25rem 0', color: '#666' }}>📱 24/7 customer support</li>
                    <li style={{ padding: '0.25rem 0', color: '#666' }}>📸 Professional photography</li>
                    <li style={{ padding: '0.25rem 0', color: '#666' }}>🎁 Welcome kit & souvenirs</li>
                    <li style={{ padding: '0.25rem 0', color: '#666' }}>🍽️ Local cuisine experiences</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Travel Information */}
          <div style={{
            border: '1px solid #eee',
            borderRadius: '12px',
            marginBottom: '2rem',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderBottom: '1px solid #eee'
            }}>
              <h3 style={{ margin: 0, color: '#dc2626' }}>🧳 Travel Essentials</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div>
                  <h4 style={{ color: '#6f42c1', marginBottom: '1rem' }}>📋 Important Documents</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ padding: '0.25rem 0', color: '#666' }}>🆔 Valid ID proof required</li>
                    <li style={{ padding: '0.25rem 0', color: '#666' }}>🎫 E-tickets will be provided</li>
                    <li style={{ padding: '0.25rem 0', color: '#666' }}>📄 Travel insurance included</li>
                    <li style={{ padding: '0.25rem 0', color: '#666' }}>📱 Digital itinerary access</li>
                  </ul>
                </div>
                
                <div>
                  <h4 style={{ color: '#e91e63', marginBottom: '1rem' }}>⚠️ Important Notes</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ padding: '0.25rem 0', color: '#666' }}>🕐 Report 2 hours before departure</li>
                    <li style={{ padding: '0.25rem 0', color: '#666' }}>🌡️ Weather-appropriate clothing</li>
                    <li style={{ padding: '0.25rem 0', color: '#666' }}>💊 Carry personal medications</li>
                    <li style={{ padding: '0.25rem 0', color: '#666' }}>📞 Emergency contact provided</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div style={{
            background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #ff9800',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#e65100' }}>📞 Need Help?</h3>
            <p style={{ margin: '0 0 1rem 0', color: '#bf360c' }}>
              Our travel experts are available 24/7 to assist you
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ color: '#e65100' }}>
                <strong>📱 WhatsApp:</strong> +91 98765 43210
              </div>
              <div style={{ color: '#e65100' }}>
                <strong>📧 Email:</strong> support@sakshitours.com
              </div>
              <div style={{ color: '#e65100' }}>
                <strong>🕐 Helpline:</strong> 1800-123-4567
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};