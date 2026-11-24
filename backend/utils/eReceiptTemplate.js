const generateEReceiptHTML = (booking) => {
  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    if (!amount || isNaN(amount)) return '₹0';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  if (!booking || !booking.user || !booking.package) {
    throw new Error('Invalid booking data');
  }

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>E-Receipt - Sakshi Tours</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .receipt-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #dc2626, #f87171); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .booking-info { background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .info-label { font-weight: bold; color: #374151; }
        .info-value { color: #1f2937; }
        .travelers-section { margin: 20px 0; }
        .traveler-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 10px 0; }
        .pricing-section { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .total-amount { background: #dc2626; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .qr-section { text-align: center; margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 8px; }
        .important-note { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            <h1>🎯 SAKSHI TOURS</h1>
            <p>Your Journey, Our Passion</p>
            <p style="font-size: 18px; margin-top: 15px;">✅ BOOKING CONFIRMED</p>
        </div>
        
        <div class="content">
            <div class="booking-info">
                <h2 style="margin-top: 0; color: #dc2626;">📋 Booking Details</h2>
                <div class="info-row">
                    <span class="info-label">Booking ID:</span>
                    <span class="info-value">${booking._id}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Ticket Number:</span>
                    <span class="info-value">${booking.ticketNumber || 'TKT-' + booking._id.slice(-8).toUpperCase()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Booking Date:</span>
                    <span class="info-value">${formatDate(booking.createdAt)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value" style="color: #059669; font-weight: bold;">CONFIRMED</span>
                </div>
            </div>

            <h3 style="color: #dc2626;">🏖️ Package Information</h3>
            <div class="info-row">
                <span class="info-label">Package:</span>
                <span class="info-value">${booking.package.name || booking.package.title || 'Package'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Destination:</span>
                <span class="info-value">${booking.package.destination || booking.package.location || 'Destination'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Duration:</span>
                <span class="info-value">${booking.package.duration || 'N/A'} days</span>
            </div>
            <div class="info-row">
                <span class="info-label">Travel Date:</span>
                <span class="info-value">${formatDate(booking.travelDate)}</span>
            </div>

            <h3 style="color: #dc2626;">👥 Customer Information</h3>
            <div class="info-row">
                <span class="info-label">Primary Contact:</span>
                <span class="info-value">${booking.user.name}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${booking.user.email}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Phone:</span>
                <span class="info-value">${booking.user.phone || 'Not provided'}</span>
            </div>

            ${booking.travelerDetails?.travelers ? `
            <div class="travelers-section">
                <h3 style="color: #dc2626;">🧳 Traveler Details</h3>
                ${booking.travelerDetails.travelers.map((traveler, index) => `
                    <div class="traveler-card">
                        <strong>Traveler ${index + 1}:</strong> ${traveler.name} (${traveler.age} years, ${traveler.gender})
                        ${traveler.specialRequirements ? `<br><em>Special Requirements: ${traveler.specialRequirements}</em>` : ''}
                    </div>
                `).join('')}
                
                <div class="info-row">
                    <span class="info-label">Accommodation:</span>
                    <span class="info-value">${booking.travelerDetails.roomType || 'Standard'} Room (${booking.travelerDetails.numberOfRooms || 1} room${(booking.travelerDetails.numberOfRooms || 1) > 1 ? 's' : ''})</span>
                </div>
                
                ${booking.travelerDetails.mealPreference ? `
                <div class="info-row">
                    <span class="info-label">Meal Preference:</span>
                    <span class="info-value">${booking.travelerDetails.mealPreference}</span>
                </div>
                ` : ''}
                
                ${booking.travelerDetails.travelInsurance ? `
                <div class="info-row">
                    <span class="info-label">Travel Insurance:</span>
                    <span class="info-value">✅ Included</span>
                </div>
                ` : ''}
            </div>
            ` : ''}

            <div class="pricing-section">
                <h3 style="margin-top: 0; color: #059669;">💰 Payment Summary</h3>
                <div class="info-row">
                    <span class="info-label">Base Amount:</span>
                    <span class="info-value">${formatAmount(booking.baseAmount)}</span>
                </div>
                ${booking.discountAmount > 0 ? `
                <div class="info-row">
                    <span class="info-label">Discount:</span>
                    <span class="info-value" style="color: #059669;">-${formatAmount(booking.discountAmount)}</span>
                </div>
                ` : ''}
                ${booking.addOnAmount > 0 ? `
                <div class="info-row">
                    <span class="info-label">Add-ons & Services:</span>
                    <span class="info-value">${formatAmount(booking.addOnAmount)}</span>
                </div>
                ` : ''}
                ${booking.loyaltyPointsUsed > 0 ? `
                <div class="info-row">
                    <span class="info-label">Loyalty Points Used:</span>
                    <span class="info-value" style="color: #059669;">-${formatAmount(booking.loyaltyPointsUsed)}</span>
                </div>
                ` : ''}
            </div>

            <div class="total-amount">
                Total Amount Paid: ${formatAmount(booking.totalAmount)}
            </div>

            ${booking.loyaltyPointsEarned > 0 ? `
            <div style="background: #fbbf24; color: #92400e; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                🎉 You earned ${booking.loyaltyPointsEarned} loyalty points on this booking!
            </div>
            ` : ''}

            <div class="qr-section">
                <h3 style="color: #dc2626;">📱 Digital Ticket</h3>
                <p>Show this ticket number at check-in:</p>
                <div style="font-size: 24px; font-weight: bold; color: #dc2626; margin: 10px 0;">${booking.ticketNumber || 'TKT-' + booking._id.slice(-8).toUpperCase()}</div>
                <p style="font-size: 12px; color: #6b7280;">Keep this e-receipt for your records</p>
            </div>

            <div class="important-note">
                <h4 style="margin-top: 0; color: #92400e;">⚠️ Important Information</h4>
                <ul style="margin: 10px 0; padding-left: 20px; color: #92400e;">
                    <li>Please carry valid ID proof during travel</li>
                    <li>Report at pickup point 30 minutes before departure</li>
                    <li>Cancellation policy applies as per terms & conditions</li>
                    <li>Contact us for any changes or queries</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p><strong>Sakshi Tours & Travels</strong></p>
            <p>📧 support@sakshitours.com | 📞 +91-9876543210</p>
            <p>🌐 www.sakshitours.com</p>
            <p style="margin-top: 15px; font-size: 12px;">
                This is a computer-generated receipt. No signature required.<br>
                Thank you for choosing Sakshi Tours for your travel needs!
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

module.exports = { generateEReceiptHTML };