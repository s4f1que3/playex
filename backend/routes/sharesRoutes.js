// backend/routes/sharesRoutes.js
const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'contact.playex@gmail.com',
    pass: process.env.GMAIL_PASSWORD || 'your-app-password',
  },
});

// Test email connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email service is ready');
  }
});

// Send share notification email
router.post('/share-notification', async (req, res) => {
  try {
    const { sharedUrl, timestamp } = req.body;
    console.log('📧 Sending share notification email...');
    console.log('  URL:', sharedUrl);
    console.log('  Time:', timestamp);

    const mailOptions = {
      from: process.env.GMAIL_USER || 'contact.playex@gmail.com',
      to: 'contact.playex@gmail.com',
      subject: '🎉 Playex Link Shared!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #82BC87 0%, #E4D981 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h2 style="margin: 0; color: #1a1a1a; font-size: 24px;">✨ Someone Shared Playex!</h2>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <p style="color: #333; font-size: 16px; margin-bottom: 15px;">
              A user just shared your Playex link! 🚀
            </p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #82BC87; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Shared URL:</strong> ${sharedUrl}
              </p>
              <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
                <strong>Time:</strong> ${new Date(timestamp).toLocaleString()}
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
              Keep spreading the word! Each share brings more users to Playex.
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 15px;">
              This is an automated notification from your Playex sharing system.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    res.json({ success: true, message: 'Share notification sent', messageId: info.messageId });
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
