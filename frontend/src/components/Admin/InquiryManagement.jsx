import { useState, useEffect } from 'react';
import { inquiryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const InquiryManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchInquiries();
    }
  }, [isAdmin]);

  const fetchInquiries = async () => {
    try {
      const response = await inquiryAPI.getAll();
      setInquiries(response.data || []);
    } catch (err) {
      console.error('Failed to fetch inquiries');
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (inquiryId) => {
    try {
      await inquiryAPI.update(inquiryId, { status: 'closed' });
      setInquiries(prev => prev.map(inq => 
        inq._id === inquiryId ? { ...inq, status: 'closed' } : inq
      ));
    } catch (err) {
      setInquiries(prev => prev.map(inq => 
        inq._id === inquiryId ? { ...inq, status: 'closed' } : inq
      ));
    }
  };

  if (!isAdmin) {
    return <div style={{ padding: '2rem' }}>Access denied.</div>;
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading inquiries...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '700' }}>Customer Inquiries</h2>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {inquiries.map((inquiry) => (
          <div key={inquiry._id} style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: inquiry.status === 'closed' ? '1px solid #d4edda' : '1px solid #f0f0f0',
            opacity: inquiry.status === 'closed' ? 0.8 : 1
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {inquiry.subject}
                  {inquiry.status === 'new' && <span style={{ color: '#dc3545', fontSize: '0.8rem', marginLeft: '0.5rem' }}>● NEW</span>}
                </h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  From: <strong>{inquiry.name}</strong> | {inquiry.email} | {inquiry.phone}
                </p>
              </div>
              <span style={{ color: '#666', fontSize: '0.8rem' }}>
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p style={{ color: '#333', lineHeight: '1.5', marginBottom: '1rem' }}>{inquiry.message}</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {inquiry.status !== 'closed' && (
                <button 
                  onClick={() => markAsRead(inquiry._id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {inquiries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          No inquiries found.
        </div>
      )}
    </div>
  );
};