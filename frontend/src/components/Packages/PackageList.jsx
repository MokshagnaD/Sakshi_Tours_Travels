import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { packageAPI } from '../../services/api';

export const PackageList = ({ showFilters = true, limit = null }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    destination: '',
    category: '',
    duration: '',
    priceRange: '',
    featured: false,
    packageType: '',
    searchQuery: ''
  });

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params[key] = filters[key];
        }
      });

      // Add packageType and search query from URL if present
      const urlParams = new URLSearchParams(window.location.search);
      const packageType = urlParams.get('packageType');
      const searchQuery = urlParams.get('q');
      if (packageType) {
        params.packageType = packageType;
      }
      if (searchQuery) {
        params.q = searchQuery;
      }
      if (limit) params.limit = limit;

      const response = await packageAPI.getAll(params);

      if (response && response.data) {
        const packagesData = Array.isArray(response.data.data) ? response.data.data :
          Array.isArray(response.data) ? response.data : [];
        setPackages(packagesData);
      } else {
        setPackages([]);
      }
      setError(null);
    } catch (err) {
      console.error('Package fetch error:', err);
      // If service is down (503/504), show specific message
      if (err.isServiceDown || err.response?.status >= 500) {
        setError('The Package Service is currently unavailable. Please try again later.');
      } else {
        setError('Failed to load packages.');
      }
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }, [filters, limit]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  useEffect(() => {
    // Check for search query and packageType in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const packageType = urlParams.get('packageType');
    const searchQuery = urlParams.get('q');
    if (packageType) {
      setFilters(prev => ({ ...prev, packageType }));
    }
    if (searchQuery) {
      setFilters(prev => ({ ...prev, searchQuery }));
    }
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      destination: '',
      category: '',
      duration: '',
      priceRange: '',
      featured: false,
      packageType: '',
      searchQuery: ''
    });
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading packages...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;

  return (
    <>
      <style>{`
        @keyframes packageFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes packageGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div style={{
        padding: showFilters ? '3rem 2rem' : '2rem',
        background: 'white',
        minHeight: '100vh'
      }}>
        {showFilters && (
          <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
            {/* Background decorative elements */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '10%',
              fontSize: '3rem',
              opacity: 0.1,
              color: '#dc2626'
            }}>✈️</div>
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '15%',
              fontSize: '2.5rem',
              opacity: 0.1,
              color: '#fbbf24'
            }}>🏔️</div>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '20%',
              fontSize: '2rem',
              opacity: 0.1,
              color: '#10b981'
            }}>🏖️</div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(220,38,38,0.05) 0%, rgba(251,191,36,0.05) 50%, rgba(16,185,129,0.05) 100%)',
              padding: '3rem 2rem',
              borderRadius: '24px',
              border: '2px solid rgba(220,38,38,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <h1 style={{
                fontSize: '4.5rem',
                fontWeight: '900',
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, #dc2626 0%, #fbbf24 50%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-2px',
                textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                position: 'relative',
                zIndex: 2
              }}>🌍 Discover Amazing Tours 🌍</h1>

              <div style={{
                width: '100px',
                height: '4px',
                background: 'linear-gradient(135deg, #dc2626, #fbbf24, #10b981)',
                margin: '0 auto 2rem',
                borderRadius: '2px'
              }} />

              <p style={{
                fontSize: '1.4rem',
                color: '#4b5563',
                fontWeight: '500',
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: '1.7',
                position: 'relative',
                zIndex: 2
              }}>Handpicked destinations and experiences for your perfect getaway</p>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                marginTop: '2rem',
                flexWrap: 'wrap'
              }}>
                {[
                  { icon: '✈️', text: 'Premium Flights', color: '#dc2626' },
                  { icon: '🏨', text: 'Luxury Hotels', color: '#fbbf24' },
                  { icon: '🗺️', text: 'Expert Guides', color: '#10b981' }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255,255,255,0.8)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    border: `2px solid ${item.color}20`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                    <span style={{ fontWeight: '600', color: item.color }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        {showFilters && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '2.5rem',
            borderRadius: '24px',
            marginBottom: '3rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255, 255, 255, 0.6)'
          }}>
            <h3 style={{
              margin: '0 0 2rem 0',
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#212121',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '2rem' }}>🔍</span>
              Find Your Perfect Trip
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <select
                value={filters.destination || ''}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
              >
                <option value="">All Destinations</option>
                <option value="Goa">Goa</option>
                <option value="Kerala">Kerala</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Himachal">Himachal Pradesh</option>
                <option value="Kashmir">Kashmir</option>
              </select>

              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
              >
                <option value="">All Categories</option>
                <option value="Beach">Beach</option>
                <option value="Adventure">Adventure</option>
                <option value="Heritage">Heritage</option>
                <option value="Nature">Nature</option>
                <option value="Spiritual">Spiritual</option>
              </select>

              <select
                value={filters.duration || ''}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
              >
                <option value="">Any Duration</option>
                <option value="1-3">1-3 Days</option>
                <option value="4-7">4-7 Days</option>
                <option value="8-14">1-2 Weeks</option>
                <option value="15+">15+ Days</option>
              </select>

              <select
                value={filters.priceRange || ''}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
              >
                <option value="">Any Price</option>
                <option value="0-10000">Under ₹10,000</option>
                <option value="10000-25000">₹10,000 - ₹25,000</option>
                <option value="25000-50000">₹25,000 - ₹50,000</option>
                <option value="50000+">Above ₹50,000</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={filters.featured || false}
                  onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ fontWeight: '500' }}>Featured Packages Only</span>
              </label>

              <button
                onClick={clearFilters}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {packages.length === 0 && !loading && !error ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No packages found matching your criteria.</p>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' }}>
            {packages
              .filter(pkg => {
                if (filters.destination && pkg.destination !== filters.destination) return false;
                if (filters.category && !pkg.categories?.includes(filters.category)) return false;
                if (filters.priceRange) {
                  const [min, max] = filters.priceRange.includes('+') ? [50000, Infinity] : filters.priceRange.split('-').map(Number);
                  if (pkg.price < min || (max && pkg.price > max)) return false;
                }
                if (filters.duration) {
                  const days = pkg.durationDays || 0;
                  if (filters.duration === '1-3' && (days < 1 || days > 3)) return false;
                  if (filters.duration === '4-7' && (days < 4 || days > 7)) return false;
                  if (filters.duration === '8-14' && (days < 8 || days > 14)) return false;
                  if (filters.duration === '15+' && days < 15) return false;
                }
                if (filters.featured && !pkg.featured) return false;

                // Search query filter
                const urlParams = new URLSearchParams(window.location.search);
                const searchQuery = urlParams.get('q');
                if (searchQuery) {
                  const query = searchQuery.toLowerCase();
                  const matchesTitle = pkg.title?.toLowerCase().includes(query);
                  const matchesDestination = pkg.destination?.toLowerCase().includes(query);
                  const matchesDescription = pkg.description?.toLowerCase().includes(query);
                  if (!matchesTitle && !matchesDestination && !matchesDescription) return false;
                }

                return true;
              })
              .map((pkg) => (
                <div key={pkg._id} style={{
                  background: 'rgba(255, 255, 255, 0.98)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px)'
                }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{
                    height: '200px',
                    background: pkg.images && pkg.images.length > 0 ?
                      `url(${pkg.images[0].startsWith('/uploads') ? `http://localhost:5001${pkg.images[0]}` : pkg.images[0]})` :
                      'linear-gradient(135deg, #ff6b35, #004aad)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                  </div>

                  <div style={{ padding: '1.5rem' }}>
                    <h4 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
                      {pkg.title || 'Untitled Package'}
                    </h4>
                    <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                      {(pkg.description || 'No description available').substring(0, 100)}...
                    </p>

                    {pkg.categories && pkg.categories.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        {pkg.categories.slice(0, 3).map(cat => (
                          <span key={cat} style={{
                            display: 'inline-block',
                            background: '#f0f8ff',
                            color: '#004aad',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            marginRight: '0.5rem',
                            marginBottom: '0.5rem'
                          }}>
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {pkg.availableDates && pkg.availableDates.length > 0 && (
                      <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>Available Dates</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#333' }}>
                          {new Date(pkg.availableDates[0]).toLocaleDateString()} - {new Date(pkg.availableDates[pkg.availableDates.length - 1]).toLocaleDateString()}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ff6b35' }}>
                        ₹{pkg.price ? pkg.price.toLocaleString() : 'Contact for price'}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        per person
                      </div>
                    </div>

                    <Link
                      to={`/packages/${pkg._id}`}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'center',
                        padding: '0.75rem 1.5rem',
                        background: '#dc2626',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '25px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.3s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#b91c1c'}
                      onMouseOut={(e) => e.target.style.background = '#dc2626'}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};