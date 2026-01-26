const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Create transporter with updated security settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'contact.playex@gmail.com',
    pass: process.env.GMAIL_PASSWORD
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
});

// Test connection route with better error handling
router.get('/test-connection', async (req, res) => {
  try {
    await transporter.verify();
    res.json({ success: true, message: 'SMTP connection successful' });
  } catch (error) {
    console.error('SMTP Verification Error:', error);
    res.status(500).json({
      error: 'SMTP connection failed',
      details: error.message,
      code: error.code
    });
  }
});

// Comprehensive email test route
router.get('/test-email', async (req, res) => {
  try {
    // First check if GMAIL_PASSWORD is loaded
    console.log('Environment check:', {
      GMAIL_PASSWORD_EXISTS: !!process.env.GMAIL_PASSWORD,
      GMAIL_PASSWORD_LENGTH: process.env.GMAIL_PASSWORD ? process.env.GMAIL_PASSWORD.length : 0,
      NODE_ENV: process.env.NODE_ENV
    });
    
    // Test the transporter connection
    const connectionTest = await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          reject(error);
        } else {
          resolve(success);
        }
      });
    });
    
    console.log('Connection test passed:', connectionTest);
    
    // Try sending a test email
    const info = await transporter.sendMail({
      from: 'contact.playex@gmail.com',
      to: 'contact.playex@gmail.com', // Sending to self for testing
      subject: 'Test Email from Playex',
      html: '<h2>Test Email</h2><p>This is a test email to verify the email functionality.</p>'
    });
    
    console.log('Test email sent successfully:', info);
    
    return res.status(200).json({
      message: 'Email test successful',
      connectionTest: true,
      emailSent: true,
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Email test failed with error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command,
      response: error.response
    });
    
    return res.status(500).json({
      error: 'Email test failed',
      details: error.message,
      code: error.code,
      command: error.command
    });
  }
});

// Send request route with updated configuration
router.post('/send-request', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { showName } = req.body;

    if (!showName) {
      return res.status(400).json({ error: 'Show name is required' });
    }

    console.log('Attempting to send email for show:', showName);
    console.log('Using email config:', {
      host: 'smtp.gmail.com',
      port: 465,
      user: 'contact.playex@gmail.com',
      passwordLength: process.env.GMAIL_PASSWORD?.length
    });

    const info = await transporter.sendMail({
      from: {
        name: 'Playex Show Requests',
        address: 'contact.playex@gmail.com'
      },
      to: 'contact.playex@gmail.com',
      subject: `New Show Request: ${showName}`,
      html: `
        <h2>New Show Request</h2>
        <p><strong>Requested Show:</strong> ${showName}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    });

    console.log('Email sent successfully:', info.messageId);
    return res.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Request sent successfully'
    });
  } catch (error) {
    console.error('Detailed email error:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    return res.status(500).json({
      error: 'Failed to send request',
      details: error.message
    });
  }
});

router.post('/send-contact', async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const info = await transporter.sendMail({
      from: {
        name: 'Playex Contact Form',
        address: 'contact.playex@gmail.com'
      },
      to: 'contact.playex@gmail.com',
      subject: subject || 'New Contact Form Message',
      html: `
        <h2>New Contact Form Message</h2>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    });

    console.log('Contact email sent successfully:', info.messageId);
    return res.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Contact email error:', error);
    return res.status(500).json({
      error: 'Failed to send message',
      details: error.message
    });
  }
});

module.exports = router;
