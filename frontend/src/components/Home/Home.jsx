import { Hero } from '../Hero/Hero';
import { PackageList } from '../Packages/PackageList';

export const Home = () => {
  return (
    <div>
      <Hero />
      
      {/* Why Choose Us Section */}
      <div style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: '#d32f2f',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Why Choose Sakshi Tours?
            </h2>
            <div style={{
              width: '80px',
              height: '4px',
              background: 'linear-gradient(45deg, #d32f2f, #f44336)',
              margin: '0 auto 2rem',
              borderRadius: '2px'
            }} />
            <p style={{
              fontSize: '1.3rem',
              color: '#555',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              Experience premium travel services with our expert planning and dedicated support
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem'
          }}>
            {[
              {
                icon: '🌍',
                title: 'Premium Destinations',
                description: 'Carefully curated destinations across India and international locations with exclusive experiences',
                color: '#4caf50'
              },
              {
                icon: '💰',
                title: 'Best Price Guarantee',
                description: 'Transparent pricing with no hidden costs, flexible payment options and best value assurance',
                color: '#2196f3'
              },
              {
                icon: '👥',
                title: 'Expert Travel Guides',
                description: 'Professional local guides with deep knowledge to make your journey truly memorable',
                color: '#ff9800'
              },
              {
                icon: '📞',
                title: '24/7 Premium Support',
                description: 'Round-the-clock dedicated customer support for a completely worry-free travel experience',
                color: '#e91e63'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                padding: '2.5rem',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.4s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                e.currentTarget.style.background = feature.color;
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.color = '#333';
              }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>{feature.icon}</div>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  marginBottom: '1.2rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>{feature.title}</h3>
                <p style={{
                  lineHeight: '1.6',
                  fontSize: '1rem',
                  opacity: 0.9
                }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Popular Packages */}
      <div style={{ padding: '5rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: '#d32f2f',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Popular Tour Packages
            </h2>
            <div style={{
              width: '80px',
              height: '4px',
              background: 'linear-gradient(45deg, #d32f2f, #f44336)',
              margin: '0 auto 2rem',
              borderRadius: '2px'
            }} />
            <p style={{
              fontSize: '1.3rem',
              color: '#555',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              Discover our most loved destinations and create memories that last a lifetime
            </p>
          </div>
          <PackageList showFilters={false} limit={6} />
        </div>
      </div>
      
      {/* Testimonials */}
      <div style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              What Our Travelers Say
            </h2>
            <div style={{
              width: '80px',
              height: '4px',
              background: 'white',
              margin: '0 auto 2rem',
              borderRadius: '2px'
            }} />
            <p style={{
              fontSize: '1.3rem',
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Real experiences from our satisfied customers
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                name: 'Priya Sharma',
                location: 'Mumbai',
                rating: 5,
                review: 'Amazing experience with Sakshi Tours! The Goa package was perfectly planned and executed.'
              },
              {
                name: 'Rajesh Kumar',
                location: 'Delhi',
                rating: 5,
                review: 'Excellent service and great value for money. The Kashmir trip was absolutely beautiful!'
              },
              {
                name: 'Anita Patel',
                location: 'Ahmedabad',
                rating: 5,
                review: 'Professional team and wonderful arrangements. Highly recommend for family trips!'
              }
            ].map((testimonial, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                padding: '2.5rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ marginBottom: '1rem' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} style={{ color: '#ffc107', fontSize: '1.2rem' }}>★</span>
                  ))}
                </div>
                <p style={{
                  color: '#666',
                  fontStyle: 'italic',
                  marginBottom: '1rem',
                  lineHeight: '1.5'
                }}>"{testimonial.review}"</p>
                <div>
                  <div style={{ fontWeight: '600', color: '#333' }}>{testimonial.name}</div>
                  <div style={{ color: '#999', fontSize: '0.9rem' }}>{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};