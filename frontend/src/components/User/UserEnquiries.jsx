import { useState, useEffect, useCallback } from 'react';
import { inquiryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const UserEnquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserInquiries = useCallback(async () => {
    if (!user) return;
    try {
      console.log('Fetching inquiries for user:', user.email);
      const response = await inquiryAPI.getMyInquiries();
      console.log('API response:', response.data);
      setInquiries(response.data || []);
    } catch (err) {
      console.error('Error fetching user inquiries:', err);
      // Fallback: try to get all inquiries and filter
      try {
        const allResponse = await inquiryAPI.getAll();
        const userInquiries = allResponse.data.filter(inq => inq.email === user.email);
        console.log('Fallback: found', userInquiries.length, 'inquiries');
        setInquiries(userInquiries || []);
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
        setInquiries([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserInquiries();
    }
  }, [user, fetchUserInquiries]);

  if (!user) {
    return <div style={{ padding: '2rem' }}>Please login to view your enquiries.</div>;
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading your enquiries...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>📧 My Enquiries</h1>
      
      {inquiries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No Enquiries Found</h3>
          <p>You haven't sent any enquiries yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {inquiries.map((inquiry) => (
            <div key={inquiry._id} style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              border: inquiry.status === 'closed' ? '2px solid #d4edda' : '2px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3>{inquiry.subject}</h3>
                <span style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  background: inquiry.status === 'closed' ? '#d4edda' : '#fff3cd',
                  color: inquiry.status === 'closed' ? '#155724' : '#856404'
                }}>
                  {inquiry.status === 'closed' ? 'RESOLVED' : 'PENDING'}
                </span>
              </div>
              <p><strong>Sent:</strong> {new Date(inquiry.createdAt).toLocaleDateString()}</p>
              <p><strong>Message:</strong> {inquiry.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};