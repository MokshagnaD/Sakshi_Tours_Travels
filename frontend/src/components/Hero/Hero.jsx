import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/packages?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div style={{
      backgroundImage: 'linear-gradient(135deg, rgba(237, 127, 26, 0.85) 0%, rgba(10, 49, 85, 0.75) 100%), url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      paddingTop: '80px'
    }}>

      
      <div style={{
        textAlign: 'center',
        zIndex: 2,
        maxWidth: '800px',
        padding: '0 2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h1 style={{
              fontSize: '5rem',
              fontWeight: '900',
              marginBottom: '2rem',
              textShadow: '2px 4px 12px rgba(0,0,0,0.4)',
              lineHeight: '1.1',
              letterSpacing: '-2px',
              color: 'white'
            }}>
              Plan Your Dream Holiday
            </h1>
            <p style={{
              fontSize: '1.75rem',
              marginBottom: '3rem',
              fontWeight: '500',
              lineHeight: '1.6',
              textShadow: '1px 2px 6px rgba(0,0,0,0.3)',
              maxWidth: '700px',
              margin: '0 auto 3rem',
              color: 'white'
            }}>
              Discover incredible destinations with India's most trusted travel partner since 1984
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '4rem'
            }}>
              <button style={{
                background: 'linear-gradient(135deg, #ED7F1A 0%, #F7A648 100%)',
                color: 'white',
                padding: '1.25rem 3rem',
                borderRadius: '60px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 12px 40px rgba(237, 127, 26, 0.4)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.08) translateY(-4px)';
                e.target.style.boxShadow = '0 20px 60px rgba(237, 127, 26, 0.6)';
                e.target.style.background = 'linear-gradient(135deg, #F7A648 0%, #ED7F1A 100%)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1) translateY(0)';
                e.target.style.boxShadow = '0 12px 40px rgba(237, 127, 26, 0.4)';
                e.target.style.background = 'linear-gradient(135deg, #ED7F1A 0%, #F7A648 100%)';
              }}
              onClick={() => navigate('/packages')}
              >
                🌍 Explore Tours
              </button>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSearch} style={{
          display: 'flex',
          maxWidth: '900px',
          margin: '0 auto 4rem',
          backgroundColor: 'rgba(255,255,255,0.98)',
          borderRadius: '70px',
          padding: '12px',
          boxShadow: '0 25px 80px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(30px)',
          border: '2px solid rgba(255,255,255,0.5)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            padding: '0 2rem'
          }}>
            <span style={{
              fontSize: '2rem',
              marginRight: '1.5rem',
              color: '#ED7F1A'
            }}>🗺️</span>
            <input
              type="text"
              placeholder="Enter Destination, Dates, Travelers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                padding: '1.75rem 0',
                fontSize: '1.3rem',
                outline: 'none',
                color: '#212121',
                fontWeight: '500',
                background: 'transparent',
                letterSpacing: '0.5px'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #ED7F1A 0%, #F7A648 100%)',
              color: 'white',
              border: 'none',
              padding: '1.75rem 3.5rem',
              borderRadius: '60px',
              fontSize: '1.2rem',
              fontWeight: '700',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 12px 35px rgba(237, 127, 26, 0.4)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 20px 50px rgba(237, 127, 26, 0.6)';
              e.target.style.background = 'linear-gradient(135deg, #F7A648 0%, #ED7F1A 100%)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 12px 35px rgba(237, 127, 26, 0.4)';
              e.target.style.background = 'linear-gradient(135deg, #ED7F1A 0%, #F7A648 100%)';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🔍</span> SEARCH
          </button>
        </form>
        
        {/* Popular categories */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            { title: 'DOMESTIC', subtitle: 'Explore India', icon: '🇮🇳', color: '#ED7F1A', bg: 'linear-gradient(135deg, #ED7F1A, #F7A648)' },
            { title: 'INTERNATIONAL', subtitle: 'World Tours', icon: '🌍', color: '#0A3155', bg: 'linear-gradient(135deg, #0A3155, #1565C0)' },
            { title: 'HONEYMOON', subtitle: 'Romantic Getaways', icon: '💕', color: '#E91E63', bg: 'linear-gradient(135deg, #E91E63, #F06292)' },
            { title: 'ADVENTURE', subtitle: 'Thrilling Experiences', icon: '🏔️', color: '#4CAF50', bg: 'linear-gradient(135deg, #4CAF50, #66BB6A)' }
          ].map((category, index) => (
            <a key={index} href={`/packages?packageType=${category.title}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(30px)',
                color: '#212121',
                padding: '2rem 1rem',
                borderRadius: '24px',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'center',
                border: '2px solid rgba(255,255,255,0.6)',
                boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden',
                width: '260px',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 'none'
              }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-12px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.2)';
              e.currentTarget.style.background = category.bg;
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.98)';
              e.currentTarget.style.color = '#212121';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
            }}
            >
                <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>{category.icon}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>{category.title}</div>
                <div style={{ fontSize: '1rem', opacity: 0.85, fontWeight: '500', lineHeight: '1.4' }}>{category.subtitle}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
      

    </div>
  );
};