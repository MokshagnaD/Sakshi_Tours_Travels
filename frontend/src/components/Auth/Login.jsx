import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/packages');
    }
    setIsLoading(false);
  };

  return (
    <>
      <style>{`
        @keyframes loginFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes loginGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #dc2626 0%, #fbbf24 25%, #ffffff 50%, #fbbf24 75%, #dc2626 100%)',
        backgroundSize: '400% 400%',
        animation: 'loginGradient 6s ease infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(40px)',
          borderRadius: '40px',
          padding: '4rem',
          boxShadow: '0 40px 120px rgba(0,0,0,0.2), 0 0 50px rgba(220, 38, 38, 0.1)',
          width: '100%',
          maxWidth: '550px',
          position: 'relative',
          overflow: 'hidden',
          border: '4px solid rgba(255, 255, 255, 0.8)',
          animation: 'loginFloat 4s ease-in-out infinite'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #dc2626, #fbbf24, #ffffff, #fbbf24, #dc2626)',
            backgroundSize: '300% 300%',
            animation: 'loginGradient 3s ease infinite'
          }} />
        
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1.5rem',
              animation: 'loginFloat 3s ease-in-out infinite'
            }}>🏝️</div>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #dc2626 0%, #fbbf24 50%, #dc2626 100%)',
              backgroundSize: '300% 300%',
              animation: 'loginGradient 3s ease infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              letterSpacing: '-1px'
            }}>✨ Welcome Back ✨</h2>
            <p style={{ color: '#64748b', fontSize: '1.3rem', fontWeight: '600' }}>Sign in to continue your amazing journey</p>
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

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  border: '2px solid #f0f0f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  outline: 'none',
                  background: '#fafafa'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#dc2626';
                  e.target.style.background = 'white';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 30px rgba(220, 38, 38, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#f0f0f0';
                  e.target.style.background = '#fafafa';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{ marginBottom: '2rem', position: 'relative' }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  border: '2px solid #f0f0f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  outline: 'none',
                  background: '#fafafa'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#dc2626';
                  e.target.style.background = 'white';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 30px rgba(220, 38, 38, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#f0f0f0';
                  e.target.style.background = '#fafafa';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1.5rem',
                background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #dc2626 0%, #fbbf24 50%, #ffffff 80%, #fbbf24 100%)',
                backgroundSize: '300% 300%',
                animation: isLoading ? 'none' : 'loginGradient 3s ease infinite',
                color: 'white',
                borderRadius: '25px',
                fontSize: '1.3rem',
                fontWeight: '800',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 12px 35px rgba(220, 38, 38, 0.4), 0 6px 20px rgba(251, 191, 36, 0.3)',
                border: '3px solid white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 30px rgba(255, 107, 53, 0.4)';
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
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: '#666', marginBottom: '1rem' }}>Don't have an account?</p>
            <Link
              to="/register"
              style={{
                color: '#dc2626',
                textDecoration: 'none',
                fontWeight: '800',
                padding: '1rem 2.5rem',
                border: '3px solid #dc2626',
                borderRadius: '50px',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '1rem',
                background: 'rgba(220, 38, 38, 0.1)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #dc2626, #fbbf24)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                e.target.style.boxShadow = '0 15px 40px rgba(220, 38, 38, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(220, 38, 38, 0.1)';
                e.target.style.color = '#dc2626';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              ✨ Create Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};