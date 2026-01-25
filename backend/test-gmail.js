const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contact.playex@gmail.com',
    pass: 'kjie gsrw yxas ckqi',
  },
});

console.log('Testing email credentials...');
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } else {
    console.log('✅ Gmail authentication successful!');
    
    // Try sending a test email
    transporter.sendMail({
      from: 'contact.playex@gmail.com',
      to: 'contact.playex@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email from Playex',
    }, (err, info) => {
      if (err) {
        console.error('❌ Failed to send email:', err.message);
        process.exit(1);
      } else {
        console.log('✅ Test email sent successfully!', info.messageId);
        process.exit(0);
      }
    });
  }
});

// Add timeout
setTimeout(() => {
  console.error('❌ Timeout: Email operation took too long');
  process.exit(1);
}, 10000);
