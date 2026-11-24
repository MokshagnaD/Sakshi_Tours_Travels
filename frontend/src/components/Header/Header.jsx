import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      background: isAdminPage ? 'white' : 'rgba(0, 0, 0, 0.9)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '1rem 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {!isAdminPage && (
          <Link to="/" style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            textDecoration: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🏝️ Sakshi Tours
          </Link>
        )}
        
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginLeft: 'auto' }}>
          {!isAdminPage && (
            <>
              <Link to="/packages" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.color = '#ffa726'}
              onMouseOut={(e) => e.target.style.color = 'white'}>
                Packages
              </Link>
              {user?.role !== 'admin' && (
                <Link to="/contact" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.color = '#ffa726'}
                onMouseOut={(e) => e.target.style.color = 'white'}>
                  Contact
                </Link>
              )}
            </>
          )}
          
          {isAdminPage && (
            <>
              <Link to="/" style={{
                color: '#000',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.color = '#dc2626'}
              onMouseOut={(e) => e.target.style.color = '#000'}>
                🏠 Home
              </Link>
              <Link to="/packages" style={{
                color: '#000',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.color = '#dc2626'}
              onMouseOut={(e) => e.target.style.color = '#000'}>
                📦 Packages
              </Link>
            </>
          )}
          
          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {user?.role !== 'admin' && !isAdminPage && (
                <Link to="/bookings" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.color = '#ffa726'}
                onMouseOut={(e) => e.target.style.color = 'white'}>My Bookings</Link>
              )}
              {user?.role !== 'admin' && isAdminPage && (
                <Link to="/bookings" style={{
                  color: '#000',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.color = '#dc2626'}
                onMouseOut={(e) => e.target.style.color = '#000'}>My Bookings</Link>
              )}
              {user?.role === 'admin' && isHomePage && (
                <Link to="/admin" style={{
                  background: '#ffa726',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>Admin Panel</Link>
              )}
              <span style={{ color: isAdminPage ? '#000' : 'white', fontSize: '0.9rem' }}>Hi, {user?.name}</span>
              <button
                onClick={handleLogout}
                style={{
                  background: '#666',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {isHomePage && (
                <Link to="/admin-login" style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.color = '#ffa726'}
                onMouseOut={(e) => e.target.style.color = 'white'}
                >Admin</Link>
              )}
              <Link to="/login" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                transition: 'color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.color = '#ffa726'}
              onMouseOut={(e) => e.target.style.color = 'white'}>
                Login
              </Link>
              {isHomePage && (
                <Link to="/register" style={{
                  background: '#ffa726',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Register
                </Link>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};