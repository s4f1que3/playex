#!/usr/bin/env node

const http = require('http');

// Test configuration
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/shares/share-notification',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const data = JSON.stringify({
  sharedUrl: 'http://localhost:3000',
  timestamp: new Date().toISOString(),
});

console.log('🧪 Testing Share Notification Email System');
console.log('=' .repeat(50));
console.log('📍 Endpoint: http://localhost:5000/api/shares/share-notification');
console.log('📤 Payload:', JSON.stringify(JSON.parse(data), null, 2));
console.log('=' .repeat(50));
console.log('');

const req = http.request(options, (res) => {
  console.log(`✅ Response Status: ${res.statusCode}`);
  console.log('📬 Headers:', res.headers);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(body);
      console.log('✅ Response Body:', JSON.stringify(response, null, 2));
      
      if (response.success) {
        console.log('');
        console.log('🎉 SUCCESS! Email notification sent.');
        console.log('📧 Check contact.playex@gmail.com inbox');
      } else {
        console.log('');
        console.log('❌ Error:', response.error);
      }
    } catch (e) {
      console.log('📦 Response:', body);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error.message);
  console.error('💡 Make sure the backend server is running:');
  console.error('   cd backend && node server.js');
});

req.setTimeout(10000, () => {
  console.error('❌ Request Timeout (10s)');
  req.destroy();
  process.exit(1);
});

req.write(data);
req.end();
