import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

export const Register = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Password
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [otp, setOtp] = useState('');
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authAPI.sendRegistrationOTP(formData);
      if (response.data.success !== false) {
        setMaskedEmail(response.data.email);
        setStep(2);
      } else {
        setError(response.data.msg || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send OTP');
    }
    setIsLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await authAPI.verifyOTP({
        email: formData.email,
        otp
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid OTP');
    }
    setIsLoading(false);
  };

  // Step 3: Complete Registration
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (passwords.password !== passwords.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await authAPI.completeRegistration({
        email: formData.email,
        otp,
        password: passwords.password,
        confirmPassword: passwords.confirmPassword
      });
      
      // Auto login after successful registration
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/packages');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem 1.5rem',
    border: '2px solid #f0f0f0',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s',
    outline: 'none',
    background: '#fafafa'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#004aad';
    e.target.style.background = 'white';
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 8px 25px rgba(0, 74, 173, 0.15)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#f0f0f0';
    e.target.style.background = '#fafafa';
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '5px',
          background: 'linear-gradient(90deg, #004aad, #ff6b35, #ffa726)'
        }} />
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #004aad, #ff6b35)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            {step === 1 ? 'Join Us Today' : step === 2 ? 'Verify Email' : 'Almost Done!'}
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            {step === 1 ? 'Create your travel account' : step === 2 ? 'Check your email for OTP' : 'Set your password'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
            color: 'white',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOTP} style={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1rem',
              background: isLoading ? '#ccc' : 'linear-gradient(135deg, #004aad, #667eea)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 30px rgba(0, 74, 173, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Sending OTP...
              </div>
            ) : (
              'Send OTP'
            )}
          </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{ color: '#004aad', marginBottom: '0.5rem' }}>Verify OTP</h3>
              <p style={{ color: '#666' }}>Enter the 6-digit code sent to {maskedEmail}</p>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                style={{
                  ...inputStyle,
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  letterSpacing: '0.5rem'
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              style={{
                width: '100%',
                padding: '1rem',
                background: (isLoading || otp.length !== 6) ? '#ccc' : 'linear-gradient(135deg, #004aad, #667eea)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: (isLoading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#004aad',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Back to form
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleCompleteRegistration}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{ color: '#004aad', marginBottom: '0.5rem' }}>Create Password</h3>
              <p style={{ color: '#666' }}>Set your account password</p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                value={passwords.password}
                onChange={handlePasswordChange}
                required
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                required
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1rem',
                background: isLoading ? '#ccc' : 'linear-gradient(135deg, #004aad, #667eea)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#666', marginBottom: '1rem' }}>Already have an account?</p>
          <Link
            to="/login"
            style={{
              color: '#004aad',
              textDecoration: 'none',
              fontWeight: '600',
              padding: '0.5rem 1rem',
              border: '2px solid #004aad',
              borderRadius: '25px',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#004aad';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#004aad';
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};