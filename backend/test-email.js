require('dotenv').config();
const { sendEmail } = require('./utils/email');

async function testEmail() {
  try {
    console.log('Testing email with config:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test E-Receipt',
      html: '<h1>Test Email</h1><p>This is a test email.</p>'
    });
    
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Email error details:', error);
  }
}

testEmail();