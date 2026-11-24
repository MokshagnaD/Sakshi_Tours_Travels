import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packageAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await packageAPI.getById(id);
        setPkg(response.data);
      } catch (err) {
        setError('Failed to load package details');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedDate) {
      alert('Please select a travel date before booking.');
      return;
    }

    navigate('/booking', {
      state: {
        packageData: pkg,
        selectedDate: selectedDate
      }
    });
  };

  if (loading) return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading...</div>
    </div>
  );
  
  if (error) return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ color: 'white', fontSize: '1.5rem' }}>{error}</div>
    </div>
  );
  
  if (!pkg) return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ color: 'white', fontSize: '1.5rem' }}>Package not found</div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Travel Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        fontSize: '8rem',
        opacity: 0.1,
        color: 'white',
        transform: 'rotate(15deg)'
      }}>✈️</div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '3%',
        fontSize: '6rem',
        opacity: 0.1,
        color: 'white',
        transform: 'rotate(-20deg)'
      }}>🗺️</div>
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '10%',
        fontSize: '4rem',
        opacity: 0.1,
        color: 'white'
      }}>🧳</div>

      {/* Back Button */}
      <div style={{ padding: '2rem 2rem 0' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            color: '#1e3c72',
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
          }}
        >
          🏠 Back to Packages
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {/* Hero Section - Travel Postcard Style */}
          <div style={{
            background: pkg.images && pkg.images.length > 0 
              ? `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%), url(${pkg.images[0].startsWith('/uploads') ? `http://localhost:5001${pkg.images[0]}` : pkg.images[0]})`
              : 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '4rem 3rem',
            color: 'white',
            textAlign: 'center',
            position: 'relative'
          }}>
            {/* Postcard Border Effect */}
            
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '600',
              marginBottom: '1rem',
              fontFamily: 'Arial, sans-serif',
              color: 'white'
            }}>{pkg.title}</h1>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem',
              marginTop: '2rem',
              flexWrap: 'wrap'
            }}>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  textAlign: 'center',
                  minWidth: '150px'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌍</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>{pkg.destination}</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Destination</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  textAlign: 'center',
                  minWidth: '150px'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>{pkg.itinerary ? pkg.itinerary.length : pkg.duration} Days</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  textAlign: 'center',
                  minWidth: '150px'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💎</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>₹{pkg.price}</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Per Person</div>
                </div>
              </div>
          </div>

          {/* Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '3rem',
            padding: '3rem'
          }}>
            {/* Left Column */}
            <div>
              {/* Description - Travel Journal Style */}
              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{
                  fontSize: '2.2rem',
                  fontWeight: '700',
                  color: '#1e3c72',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontFamily: 'serif'
                }}>
                  📖 Travel Story
                </h2>
                <div style={{
                  background: 'rgba(255,255,255,0.9)',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '2px solid #e3f2fd',
                  borderLeft: '6px solid #2196f3',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '20px',
                    background: '#2196f3',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>ADVENTURE AWAITS</div>
                  <p style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.8',
                    color: '#000',
                    fontStyle: 'italic',
                    margin: 0
                  }}>"{pkg.description}"</p>
                </div>
              </div>

              {/* Itinerary - Travel Route Style */}
              {pkg.itinerary && (
                <div style={{ marginBottom: '3rem' }}>
                  <h2 style={{
                    fontSize: '2.2rem',
                    fontWeight: '700',
                    color: '#1e3c72',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontFamily: 'serif'
                  }}>
                    🗺️ Journey Route
                  </h2>
                  <div style={{ position: 'relative' }}>
                    {/* Travel Route Line */}
                    <div style={{
                      position: 'absolute',
                      left: '2rem',
                      top: '2rem',
                      bottom: '2rem',
                      width: '3px',
                      background: 'linear-gradient(to bottom, #ff6b6b, #4ecdc4, #45b7d1)',
                      borderRadius: '2px'
                    }} />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {pkg.itinerary.map((item, index) => (
                        <div key={index} style={{
                          background: 'rgba(255,255,255,0.9)',
                          padding: '2rem 2rem 2rem 4.5rem',
                          borderRadius: '16px',
                          border: '2px solid #e9ecef',
                          position: 'relative',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}>
                          {/* Route Marker */}
                          <div style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '2rem',
                            height: '2rem',
                            background: index % 2 === 0 ? '#ff6b6b' : '#4ecdc4',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            border: '3px solid white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }}>{item.day}</div>
                          
                          <div style={{
                            fontSize: '1.3rem',
                            fontWeight: '700',
                            color: '#1e3c72',
                            marginBottom: '0.75rem'
                          }}>Day {item.day} Adventure</div>
                          <div style={{ 
                            color: '#000', 
                            lineHeight: '1.7',
                            fontSize: '1.1rem'
                          }}>{item.activities}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Inclusions - Travel Essentials */}
              <div>
                <h2 style={{
                  fontSize: '2.2rem',
                  fontWeight: '700',
                  color: '#1e3c72',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontFamily: 'serif'
                }}>
                  🎒 What's Included
                </h2>
                <div style={{
                  background: 'rgba(255,255,255,0.9)',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '2px solid #c8e6c9',
                  borderLeft: '6px solid #4caf50'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    {pkg.inclusions?.map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.7)',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        color: '#2e7d32'
                      }}>
                        <span style={{ 
                          fontSize: '1.5rem',
                          background: '#4caf50',
                          color: 'white',
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>✓</span>
                        {item}
                      </div>
                    )) || (
                      <div style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>📞 Contact for complete details</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Passport */}
            <div>
              <div style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                color: 'white',
                padding: '2.5rem',
                borderRadius: '20px',
                boxShadow: '0 15px 40px rgba(30,60,114,0.4)',
                position: 'sticky',
                top: '2rem',
                border: '3px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '2rem',
                  paddingBottom: '1rem',
                  borderBottom: '2px dashed rgba(255,255,255,0.3)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎫</div>
                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    margin: 0,
                    fontFamily: 'serif'
                  }}>Book Your Journey</h3>
                </div>
                
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>📅 Choose Your Date:</label>
                  
                  {pkg.availableDates && pkg.availableDates.length > 0 ? (
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '1.2rem',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        background: 'rgba(255,255,255,0.95)',
                        color: '#333',
                        cursor: 'pointer',
                        outline: 'none',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      }}
                    >
                      <option value="">🗓️ Select departure date...</option>
                      {pkg.availableDates.map((date, index) => {
                        const dateStr = new Date(date).toISOString().split('T')[0];
                        return (
                          <option key={index} value={dateStr}>
                            ✈️ {new Date(date).toLocaleDateString()}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <div style={{
                      padding: '1.2rem',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      border: '2px dashed rgba(255,255,255,0.3)',
                      textAlign: 'center'
                    }}>📞 Contact for available dates</div>
                  )}
                  
                  {selectedDate && (
                    <div style={{
                      marginTop: '1.5rem',
                      padding: '1.5rem',
                      background: 'rgba(76,175,80,0.2)',
                      borderRadius: '12px',
                      border: '2px solid rgba(76,175,80,0.5)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎉</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                        Departure: {new Date(selectedDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleBookNow}
                  disabled={!selectedDate}
                  style={{ 
                    width: '100%',
                    padding: '1.5rem 2rem', 
                    background: selectedDate 
                      ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' 
                      : 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: selectedDate ? '2px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px', 
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    cursor: selectedDate ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedDate ? '0 8px 25px rgba(255,107,107,0.4)' : 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem'
                  }}
                  onMouseOver={(e) => {
                    if (selectedDate) {
                      e.target.style.transform = 'translateY(-3px) scale(1.02)';
                      e.target.style.boxShadow = '0 12px 35px rgba(255,107,107,0.5)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedDate) {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 8px 25px rgba(255,107,107,0.4)';
                    }
                  }}
                >
                  {selectedDate ? (
                    <>
                      <span style={{ fontSize: '1.5rem' }}>🚀</span>
                      Start Adventure
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '1.5rem' }}>📅</span>
                      Select Date First
                    </>
                  )}
                </button>
                
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}>
                  🛡️ Secure booking • 💳 Easy cancellation • 📞 24/7 support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};