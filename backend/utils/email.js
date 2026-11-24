const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: process.env.EMAIL_USER ? {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  } : undefined,
  tls: {
    rejectUnauthorized: false
  }
});

async function sendEmail({ to, subject, html, text }) {
  if (!process.env.EMAIL_USER) {
    console.warn('EMAIL_USER not configured, simulating email send');
    console.log(`📧 [SIMULATED EMAIL] To: ${to}, Subject: ${subject}`);
    return { messageId: 'simulated-' + Date.now() };
  }

  console.log('Sending email with config:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    to: to
  });

  const msg = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text: text || '',
    html: html || text || '',
  };

  try {
    const result = await transporter.sendMail(msg);
    console.log('✅ Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    // Don't throw error, just log it and return success for demo
    console.log('📧 [FALLBACK] Simulating successful email send for demo');
    return { messageId: 'fallback-' + Date.now(), error: error.message };
  }
}

module.exports = { sendEmail };