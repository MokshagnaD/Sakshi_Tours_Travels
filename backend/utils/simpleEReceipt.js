const { sendEmail } = require('./email');

const sendSimpleEReceipt = async (booking) => {
  console.log('📧 Preparing e-receipt for:', booking.user?.email);
  
  if (!booking.user?.email) {
    throw new Error('Customer email not found');
  }
  
  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
      <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #dc2626, #f87171); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎯 SAKSHI TOURS</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your Journey, Our Passion</p>
          <p style="margin: 15px 0 0 0; font-size: 18px; font-weight: bold;">✅ BOOKING CONFIRMED</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${booking.user?.name || 'Valued Customer'},</p>
          <p style="font-size: 16px; margin-bottom: 30px;">Great news! Your booking has been confirmed and your e-receipt is ready.</p>
          
          <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin: 0 0 15px 0; color: #155724;">📋 Booking Details</h3>
            <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking._id}</p>
            <p style="margin: 5px 0;"><strong>Ticket Number:</strong> ${booking.ticketNumber || 'TKT-' + booking._id.slice(-8).toUpperCase()}</p>
            <p style="margin: 5px 0;"><strong>Package:</strong> ${booking.package?.name || booking.package?.title || 'Travel Package'}</p>
            <p style="margin: 5px 0;"><strong>Destination:</strong> ${booking.package?.destination || 'Amazing Destination'}</p>
            <p style="margin: 5px 0;"><strong>Travel Date:</strong> ${booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('en-IN') : 'To be confirmed'}</p>
            <p style="margin: 5px 0;"><strong>Travelers:</strong> ${booking.travelers} person${booking.travelers > 1 ? 's' : ''}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${booking.totalAmount?.toLocaleString('en-IN') || '0'}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">CONFIRMED</span></p>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">⚠️ Important Information</h4>
            <ul style="margin: 0; padding-left: 20px; color: #856404;">
              <li>Please carry valid ID proof during travel</li>
              <li>Report at pickup point 30 minutes before departure</li>
              <li>Keep this e-receipt for your records</li>
              <li>Contact us for any changes or queries</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 16px; margin-bottom: 10px;">Thank you for choosing Sakshi Tours!</p>
            <p style="font-size: 14px; color: #666;">We look forward to making your journey memorable.</p>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 0;"><strong>Sakshi Tours & Travels</strong></p>
          <p style="margin: 5px 0;">📧 support@sakshitours.com | 📞 +91-9876543210</p>
          <p style="margin: 5px 0;">🌐 www.sakshitours.com</p>
          <p style="margin: 10px 0 0 0; font-size: 12px;">This is a computer-generated receipt. No signature required.</p>
        </div>
      </div>
    </div>
  `;

  console.log('📧 Sending e-receipt email to:', booking.user.email);
  
  const result = await sendEmail({
    to: booking.user.email,
    subject: '🎉 E-Receipt: Booking Confirmed - Sakshi Tours',
    html
  });
  
  console.log('✅ E-receipt email sent successfully');
  return result;
};

module.exports = { sendSimpleEReceipt };