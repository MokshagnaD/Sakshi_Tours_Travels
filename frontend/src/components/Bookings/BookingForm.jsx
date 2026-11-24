import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { packageData, selectedDate } = location.state || {};

  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    mobile: '',
    address: '',
    aadharNumber: '',
    nationality: 'Indian',
    
    // Accommodation Details
    roomType: 'double',
    numberOfRooms: 1,
    specialRequests: '',
    
    // Additional
    emergencyContact: '',
    emergencyMobile: ''
  });
  
  const [travelers, setTravelers] = useState([
    { name: '', age: '', gender: '' }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [travelInsurance, setTravelInsurance] = useState(false);
  const [seatPreferences, setSeatPreferences] = useState({});
  const [mealPreferences, setMealPreferences] = useState({});
  const [dynamicPricing, setDynamicPricing] = useState(null);
  
  const calculatePriceWithoutInsurance = () => {
    let basePrice = packageData.price;
    
    // Apply dynamic pricing if available
    if (dynamicPricing) {
      basePrice = dynamicPricing.adjustedPrice || basePrice;
    }
    
    let travelerCosts = 0;
    
    // Calculate traveler costs with age-based pricing
    travelers.forEach(traveler => {
      const age = parseInt(traveler.age);
      if (age <= 5) {
        travelerCosts += 0; // Free for children 5 and below
      } else if (age >= 6 && age <= 13) {
        travelerCosts += basePrice * 0.5; // Half price for children 6-13
      } else if (age >= 60) {
        travelerCosts += basePrice * 0.95; // 5% discount for senior citizens
      } else {
        travelerCosts += basePrice; // Full price for adults 14-59
      }
    });
    
    // Add accommodation costs
    const roomCost = getRoomRate(formData.roomType) * formData.numberOfRooms;
    
    // Calculate subtotal before loyalty discount
    const subtotal = travelerCosts + roomCost;
    
    // Apply loyalty points discount (max 10% of subtotal)
    let totalAmount = subtotal;
    if (usePoints && loyaltyPoints > 0) {
      const pointsDiscount = Math.min(loyaltyPoints, subtotal * 0.1);
      totalAmount -= pointsDiscount;
    }
    
    return totalAmount;
  };
  
  const calculatePrice = () => {
    let totalAmount = calculatePriceWithoutInsurance();
    
    // Add travel insurance if selected
    if (travelInsurance) {
      totalAmount += totalAmount * 0.05; // 5% of total for insurance
    }
    
    return totalAmount;
  };
  
  const getRoomDetails = (roomType) => {
    switch(roomType) {
      case 'single': return { capacity: 1, rate: 1500, name: 'Single Occupancy' };
      case 'double': return { capacity: 2, rate: 2500, name: 'Double Occupancy' };
      case 'triple': return { capacity: 3, rate: 3200, name: 'Triple Occupancy' };
      case 'family': return { capacity: 4, rate: 4000, name: 'Family Room' };
      default: return { capacity: 1, rate: 1500, name: 'Single Occupancy' };
    }
  };
  
  const getRoomCapacity = (roomType) => {
    return getRoomDetails(roomType).capacity;
  };
  
  const getRoomRate = (roomType) => {
    return getRoomDetails(roomType).rate;
  };
  
  const getSmartRoomSuggestions = () => {
    const travelerCount = travelers.length;
    const suggestions = [];
    
    if (travelerCount === 1) {
      suggestions.push({ type: 'single', rooms: 1, total: travelerCount });
    } else if (travelerCount === 2) {
      suggestions.push({ type: 'double', rooms: 1, total: travelerCount });
      suggestions.push({ type: 'single', rooms: 2, total: travelerCount });
    } else if (travelerCount === 3) {
      suggestions.push({ type: 'triple', rooms: 1, total: travelerCount });
      suggestions.push({ type: 'double', rooms: 1, single: 1, total: travelerCount });
    } else if (travelerCount === 4) {
      suggestions.push({ type: 'family', rooms: 1, total: travelerCount });
      suggestions.push({ type: 'double', rooms: 2, total: travelerCount });
    } else if (travelerCount > 4) {
      const familyRooms = Math.floor(travelerCount / 4);
      const remaining = travelerCount % 4;
      if (remaining === 0) {
        suggestions.push({ type: 'family', rooms: familyRooms, total: travelerCount });
      } else {
        suggestions.push({ type: 'family', rooms: familyRooms, additional: remaining, total: travelerCount });
      }
    }
    
    return suggestions;
  };
  
  const getMaxRoomsNeeded = () => {
    const capacity = getRoomCapacity(formData.roomType);
    return Math.ceil(travelers.length / capacity);
  };
  
  const validateAccommodation = () => {
    const capacity = getRoomCapacity(formData.roomType);
    const totalCapacity = capacity * formData.numberOfRooms;
    return travelers.length <= totalCapacity;
  };
  
  const getRecommendedRooms = useCallback(() => {
    const travelerCount = travelers.length;
    if (travelerCount <= 1) return { type: 'single', count: 1 };
    if (travelerCount <= 2) return { type: 'double', count: 1 };
    if (travelerCount <= 3) return { type: 'triple', count: 1 };
    if (travelerCount <= 4) return { type: 'family', count: 1 };
    return { type: 'family', count: Math.ceil(travelerCount / 4) };
  }, [travelers.length]);
  
  // Auto-update room selection when travelers change
  useEffect(() => {
    const recommended = getRecommendedRooms();
    setFormData(prev => ({
      ...prev,
      roomType: recommended.type,
      numberOfRooms: recommended.count
    }));
  }, [getRecommendedRooms]);
  
  const addTraveler = () => {
    setTravelers([...travelers, { name: '', age: '', gender: '' }]);
  };
  
  const removeTraveler = (index) => {
    if (travelers.length > 1) {
      setTravelers(travelers.filter((_, i) => i !== index));
    }
  };
  
  const updateTraveler = (index, field, value) => {
    const updatedTravelers = travelers.map((traveler, i) => 
      i === index ? { ...traveler, [field]: value } : traveler
    );
    setTravelers(updatedTravelers);
  };
  
  const updateSeatPreference = (travelerIndex, preference) => {
    setSeatPreferences(prev => ({ ...prev, [travelerIndex]: preference }));
  };
  
  const updateMealPreference = (travelerIndex, preference) => {
    setMealPreferences(prev => ({ ...prev, [travelerIndex]: preference }));
  };

  useEffect(() => {
    // Fetch user loyalty points
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          setLoyaltyPoints(user.loyaltyPoints || 0);
        }
      } catch (error) {
        console.error('Failed to fetch user data');
      }
    };

    // Calculate dynamic pricing
    const calculateDynamicPrice = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/bookings/calculate-price', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            packageId: packageData._id,
            travelDate: selectedDate,
            passengers: travelers.length
          })
        });
        const data = await response.json();
        setDynamicPricing(data);
      } catch (error) {
        console.error('Failed to calculate dynamic pricing');
      }
    };

    fetchUserData();
    if (packageData && selectedDate) {
      calculateDynamicPrice();
    }
  }, [packageData, selectedDate, travelers.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const bookingData = {
        packageId: packageData._id,
        travelDate: selectedDate,
        travelers: travelers.length,
        travelerDetails: { 
          ...formData, 
          travelers,
          seatPreferences,
          mealPreferences,
          travelInsurance
        },
        selectedAddOns: travelInsurance ? [{ name: 'Travel Insurance', price: Math.round(calculatePriceWithoutInsurance() * 0.05), quantity: 1 }] : [],
        loyaltyPointsToUse: usePoints ? Math.min(loyaltyPoints, calculatePrice() * 0.1) : 0
      };

      console.log('Sending booking data:', bookingData);

      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && (data.booking?._id || data._id)) {
        const bookingId = data.booking?._id || data._id;
        navigate(`/payment/${bookingId}`, { 
          state: { 
            bookingData: {
              ...data,
              package: packageData,
              travelDate: selectedDate,
              totalAmount: calculatePrice(),
              travelers: travelers.length,
              travelerDetails: { ...formData, travelers }
            },
            packageData,
            travelers,
            totalAmount: calculatePrice()
          } 
        });
      } else {
        throw new Error(data.msg || 'Booking creation failed');
      }
    } catch (err) {
      alert('Booking failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!packageData) {
    return <div style={{ padding: '2rem' }}>Invalid booking request</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ff6b35, #004aad)',
          color: 'white',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Complete Your Booking
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            {packageData.title} - {new Date(selectedDate).toLocaleDateString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {/* Travelers Section */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#333',
                borderBottom: '2px solid #ff6b35',
                paddingBottom: '0.5rem'
              }}>
                👥 Travelers Details
              </h3>
              <button
                type="button"
                onClick={addTraveler}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                + Add Traveler
              </button>
            </div>
            
            {travelers.map((traveler, index) => {
              const age = parseInt(traveler.age);
              let priceInfo = '';
              if (age <= 5) priceInfo = 'FREE';
              else if (age >= 6 && age <= 13) priceInfo = 'HALF PRICE';
              else if (age >= 60) priceInfo = '5% DISCOUNT';
              else if (age >= 14) priceInfo = 'FULL PRICE';
              
              return (
                <div key={index} style={{
                  border: '2px solid #f0f0f0',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  background: '#fafafa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, color: '#333' }}>Traveler {index + 1}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {priceInfo && (
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: age <= 5 ? '#d4edda' : age >= 6 && age <= 13 ? '#fff3cd' : age >= 60 ? '#cce5ff' : '#e2e3e5',
                          color: age <= 5 ? '#155724' : age >= 6 && age <= 13 ? '#856404' : age >= 60 ? '#004085' : '#383d41',
                          borderRadius: '15px',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          {priceInfo}
                        </span>
                      )}
                      {travelers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTraveler(index)}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer'
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={traveler.name}
                      onChange={(e) => updateTraveler(index, 'name', e.target.value)}
                      required
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      value={traveler.age}
                      onChange={(e) => updateTraveler(index, 'age', e.target.value)}
                      required
                      min="0"
                      max="120"
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                    <select
                      value={traveler.gender}
                      onChange={(e) => updateTraveler(index, 'gender', e.target.value)}
                      required
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  {/* Seat Preferences */}
                  <div style={{ marginTop: '1rem' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Seat Preference:</h5>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {['Window', 'Aisle', 'Middle', 'No Preference'].map(pref => (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => updateSeatPreference(index, pref)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            border: `1px solid ${seatPreferences[index] === pref ? '#ff6b35' : '#ddd'}`,
                            background: seatPreferences[index] === pref ? '#ff6b35' : 'white',
                            color: seatPreferences[index] === pref ? 'white' : '#333',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Meal Preferences */}
                  <div style={{ marginTop: '1rem' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Meal Preference:</h5>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {['Vegetarian', 'Non-Vegetarian', 'Jain', 'No Preference'].map(pref => (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => updateMealPreference(index, pref)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            border: `1px solid ${mealPreferences[index] === pref ? '#28a745' : '#ddd'}`,
                            background: mealPreferences[index] === pref ? '#28a745' : 'white',
                            color: mealPreferences[index] === pref ? 'white' : '#333',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Advanced Options Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '1rem',
              borderBottom: '2px solid #6f42c1',
              paddingBottom: '0.5rem'
            }}>
              ⚡ Advanced Options
            </h3>
            
            {/* Dynamic Pricing Display */}
            {dynamicPricing && (
              <div style={{ 
                background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', 
                padding: '1rem', 
                borderRadius: '12px', 
                marginBottom: '1rem',
                border: '1px solid #2196f3'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>🎯 Dynamic Pricing Applied</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div><strong>Base Price:</strong> ₹{packageData.price}</div>
                  <div><strong>Adjusted Price:</strong> ₹{dynamicPricing.adjustedPrice || packageData.price}</div>
                  <div><strong>Season:</strong> {dynamicPricing.season || 'Regular'}</div>
                  <div><strong>Discount:</strong> {dynamicPricing.discount || 0}%</div>
                </div>
              </div>
            )}
            
            {/* Travel Insurance */}
            <div style={{ 
              background: '#f8f9fa', 
              padding: '1rem', 
              borderRadius: '12px', 
              marginBottom: '1rem',
              border: '1px solid #dee2e6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setTravelInsurance(!travelInsurance)}
                  style={{
                    width: '24px',
                    height: '24px',
                    border: `2px solid ${travelInsurance ? '#dc2626' : '#ccc'}`,
                    background: travelInsurance ? '#dc2626' : 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {travelInsurance ? '✓' : ''}
                </button>
                <label style={{ fontWeight: '600', color: '#333', cursor: 'pointer' }} onClick={() => setTravelInsurance(!travelInsurance)}>
                  🛡️ Travel Insurance (+5% of total amount)
                </label>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                Covers trip cancellation, medical emergencies, and baggage loss
              </p>
            </div>
            
            {/* Loyalty Points */}
            {loyaltyPoints > 0 && (
              <div style={{ 
                background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', 
                padding: '1rem', 
                borderRadius: '12px', 
                border: '1px solid #ff9800'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setUsePoints(!usePoints)}
                    style={{
                      width: '24px',
                      height: '24px',
                      border: `2px solid ${usePoints ? '#dc2626' : '#ccc'}`,
                      background: usePoints ? '#dc2626' : 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {usePoints ? '✓' : ''}
                  </button>
                  <label style={{ fontWeight: '600', color: '#e65100', cursor: 'pointer' }} onClick={() => setUsePoints(!usePoints)}>
                    🎁 Use Loyalty Points (Available: {loyaltyPoints})
                  </label>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#bf360c' }}>
                  Save up to ₹{Math.min(loyaltyPoints, calculatePrice() * 0.1).toFixed(0)} (Max 10% discount)
                </p>
              </div>
            )}
          </div>
          
          {/* Contact Details Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '1rem',
              borderBottom: '2px solid #ff6b35',
              paddingBottom: '0.5rem'
            }}>
              📞 Contact Details
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  padding: '1rem',
                  border: '2px solid #f0f0f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
              />
              
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                required
                style={{
                  padding: '1rem',
                  border: '2px solid #f0f0f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
              />
            </div>
            
            <textarea
              name="address"
              placeholder="Complete Address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #f0f0f0',
                borderRadius: '12px',
                fontSize: '1rem',
                marginTop: '1rem',
                transition: 'all 0.3s',
                resize: 'vertical'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
              onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
            />
          </div>

          {/* Accommodation Details Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '1rem',
              borderBottom: '2px solid #004aad',
              paddingBottom: '0.5rem'
            }}>
              🛏️ Accommodation Details
            </h3>
            
            {/* Smart Room Suggestions */}
            {travelers.length > 0 && (
              <div style={{ 
                background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', 
                padding: '1rem', 
                borderRadius: '12px', 
                marginBottom: '1rem',
                border: '1px solid #4caf50'
              }}>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>💡 Smart Room Suggestions for {travelers.length} traveler(s):</h5>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {getSmartRoomSuggestions().map((suggestion, index) => {
                    const cost = suggestion.type === 'family' && suggestion.additional 
                      ? (getRoomRate('family') * suggestion.rooms) + (getRoomRate('single') * 1)
                      : getRoomRate(suggestion.type) * (suggestion.rooms || 1);
                    
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            roomType: suggestion.type,
                            numberOfRooms: suggestion.rooms || 1
                          }));
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          border: `2px solid ${formData.roomType === suggestion.type && formData.numberOfRooms === (suggestion.rooms || 1) ? '#2e7d32' : '#4caf50'}`,
                          background: formData.roomType === suggestion.type && formData.numberOfRooms === (suggestion.rooms || 1) ? '#2e7d32' : 'white',
                          color: formData.roomType === suggestion.type && formData.numberOfRooms === (suggestion.rooms || 1) ? 'white' : '#2e7d32',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontWeight: '600' }}>
                          {suggestion.rooms} {getRoomDetails(suggestion.type).name}
                          {suggestion.additional && ` + 1 Single`}
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          ₹{cost.toLocaleString()}/night
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  style={{
                    padding: '1rem',
                    border: '2px solid #f0f0f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.3s',
                    width: '100%'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#004aad'}
                  onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
                >
                  <option value="single">Single Occupancy - ₹{getRoomRate('single')}/night</option>
                  <option value="double">Double Occupancy - ₹{getRoomRate('double')}/night</option>
                  <option value="triple">Triple Occupancy - ₹{getRoomRate('triple')}/night</option>
                  <option value="family">Family Room - ₹{getRoomRate('family')}/night</option>
                </select>
                <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0 0' }}>
                  Capacity: {getRoomCapacity(formData.roomType)} people per room | Rate: ₹{getRoomRate(formData.roomType)}/night
                </p>
              </div>
              
              <div>
                <input
                  type="number"
                  name="numberOfRooms"
                  placeholder="Number of Rooms"
                  value={formData.numberOfRooms}
                  onChange={handleChange}
                  min="1"
                  max={getMaxRoomsNeeded() + 2}
                  style={{
                    padding: '1rem',
                    border: `2px solid ${validateAccommodation() ? '#f0f0f0' : '#dc3545'}`,
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.3s',
                    width: '100%'
                  }}
                  onFocus={(e) => e.target.style.borderColor = validateAccommodation() ? '#004aad' : '#dc3545'}
                  onBlur={(e) => e.target.style.borderColor = validateAccommodation() ? '#f0f0f0' : '#dc3545'}
                />
                <p style={{ fontSize: '0.8rem', color: validateAccommodation() ? '#28a745' : '#dc3545', margin: '0.25rem 0 0 0' }}>
                  {validateAccommodation() 
                    ? `✓ Sufficient rooms for ${travelers.length} travelers` 
                    : `⚠ Need at least ${getMaxRoomsNeeded()} rooms for ${travelers.length} travelers`
                  }
                </p>
              </div>
              

              

            </div>
            
            <textarea
              name="specialRequests"
              placeholder="Special Requests (Smoking/Non-smoking, Early check-in, etc.)"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="2"
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #f0f0f0',
                borderRadius: '12px',
                fontSize: '1rem',
                marginTop: '1rem',
                transition: 'all 0.3s',
                resize: 'vertical'
              }}
              onFocus={(e) => e.target.style.borderColor = '#004aad'}
              onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
            />
          </div>

          {/* Booking Summary */}
          <div style={{
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem'
          }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>
              📋 Booking Summary
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <p><strong>Package:</strong> {packageData.title}</p>
              <p><strong>Travel Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
              <p><strong>Travelers:</strong> {travelers.length}</p>
              <p><strong>Accommodation:</strong> {formData.numberOfRooms} x {getRoomDetails(formData.roomType).name}</p>
              <p><strong>Travel Insurance:</strong> {travelInsurance ? 'Yes (+5%)' : 'No'}</p>
              <p><strong>Total Amount:</strong> ₹{calculatePrice().toLocaleString()}</p>
            </div>
            
            {/* Accommodation Summary */}
            <div style={{ marginTop: '1rem', padding: '1rem', background: validateAccommodation() ? '#e8f5e8' : '#ffe6e6', borderRadius: '8px', border: `1px solid ${validateAccommodation() ? '#28a745' : '#dc3545'}` }}>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Accommodation Summary:</h5>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span><strong>Room Type:</strong> {formData.roomType.charAt(0).toUpperCase() + formData.roomType.slice(1)} Room (Max {getRoomCapacity(formData.roomType)} people per room)</span>
              </div>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span><strong>Number of Rooms:</strong> {formData.numberOfRooms}</span>
              </div>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span><strong>Total Capacity:</strong> {getRoomCapacity(formData.roomType) * formData.numberOfRooms} people</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: validateAccommodation() ? '#28a745' : '#dc3545', fontWeight: '600' }}>
                {validateAccommodation() 
                  ? `✓ Accommodation is sufficient for ${travelers.length} travelers` 
                  : `⚠ Insufficient accommodation for ${travelers.length} travelers`
                }
              </div>
            </div>
            
            {/* Price Breakdown */}
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Price Breakdown:</h5>
              {travelers.map((traveler, index) => {
                const age = parseInt(traveler.age);
                let price = 0;
                let category = '';
                
                if (age <= 5) {
                  price = 0;
                  category = 'Child (≤5) - FREE';
                } else if (age >= 6 && age <= 13) {
                  price = packageData.price * 0.5;
                  category = 'Child (6-13) - 50%';
                } else if (age >= 60) {
                  price = packageData.price * 0.95;
                  category = 'Senior (≥60) - 5% off';
                } else if (age >= 14) {
                  price = packageData.price;
                  category = 'Adult (14-59)';
                }
                
                return (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    <span>{traveler.name || `Traveler ${index + 1}`} ({category})</span>
                    <span>₹{price.toLocaleString()}</span>
                  </div>
                );
              })}
              
              {/* Accommodation Costs */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem', background: '#f0f8ff', padding: '0.25rem', borderRadius: '4px' }}>
                <span>Accommodation ({formData.numberOfRooms} x {getRoomDetails(formData.roomType).name})</span>
                <span>₹{(getRoomRate(formData.roomType) * formData.numberOfRooms).toLocaleString()}</span>
              </div>
              <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #ddd' }} />
              {travelInsurance && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  <span>Travel Insurance (5% of base cost)</span>
                  <span>₹{Math.round(calculatePriceWithoutInsurance() * 0.05).toLocaleString()}</span>
                </div>
              )}
              {usePoints && loyaltyPoints > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem', color: '#28a745' }}>
                  <span>Loyalty Points Discount</span>
                  <span>-₹{Math.min(loyaltyPoints, calculatePrice() * 0.1).toFixed(0)}</span>
                </div>
              )}
              <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #ddd' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1rem' }}>
                <span>Final Amount:</span>
                <span>₹{calculatePrice().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !validateAccommodation()}
            style={{
              width: '100%',
              padding: '1.5rem',
              background: (isLoading || !validateAccommodation()) ? '#ccc' : 'linear-gradient(135deg, #28a745, #20c997)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: (isLoading || !validateAccommodation()) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              if (!isLoading && validateAccommodation()) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 30px rgba(40, 167, 69, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading && validateAccommodation()) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? 'Processing Booking...' : 
             !validateAccommodation() ? 'Fix Accommodation Issues' : 
             'Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};