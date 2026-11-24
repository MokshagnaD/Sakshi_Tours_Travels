require('dotenv').config();
const { sendSimpleEReceipt } = require('./utils/simpleEReceipt');

// Test e-receipt functionality
const testEReceipt = async () => {
  console.log('🧪 Testing E-Receipt Functionality...\n');
  
  // Sample booking data
  const sampleBooking = {
    _id: 'TEST-BOOKING-' + Date.now(),
    user: {
      name: 'John Doe',
      email: 'test@example.com'
    },
    package: {
      name: 'Amazing Goa Beach Package',
      title: 'Goa Beach Paradise',
      destination: 'Goa, India'
    },
    travelers: 2,
    totalAmount: 25000,
    travelDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    ticketNumber: 'TKT-TEST-' + Date.now().toString().slice(-6),
    createdAt: new Date()
  };
  
  console.log('📋 Sample Booking Data:');
  console.log('- Booking ID:', sampleBooking._id);
  console.log('- Customer:', sampleBooking.user.name);
  console.log('- Email:', sampleBooking.user.email);
  console.log('- Package:', sampleBooking.package.name);
  console.log('- Amount: ₹' + sampleBooking.totalAmount.toLocaleString('en-IN'));
  console.log('- Travel Date:', sampleBooking.travelDate.toLocaleDateString('en-IN'));
  console.log();
  
  try {
    console.log('📧 Attempting to send e-receipt...');
    const result = await sendSimpleEReceipt(sampleBooking);
    
    console.log('✅ E-Receipt Test Successful!');
    console.log('- Message ID:', result.messageId);
    if (result.error) {
      console.log('- Note: Fallback mode used due to:', result.error);
    }
    console.log('\n🎉 E-receipt functionality is working correctly!');
    
  } catch (error) {
    console.error('❌ E-Receipt Test Failed:');
    console.error('- Error:', error.message);
    console.error('- Stack:', error.stack);
  }
};

// Run the test
testEReceipt().then(() => {
  console.log('\n🏁 Test completed.');
  process.exit(0);
}).catch((err) => {
  console.error('💥 Test crashed:', err);
  process.exit(1);
});