const axios = require('axios');

async function testServer() {
  console.log('🔧 Testing server endpoints...\n');
  
  try {
    // Test health endpoint
    console.log('📤 Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:4002/api/health');
    console.log('✅ Health endpoint working!');
    console.log('Response:', healthResponse.data);
    
    // Test CORS headers
    console.log('\n📤 Testing CORS headers...');
    const corsResponse = await axios.options('http://localhost:4002/api/admin/register', {
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('✅ CORS preflight successful!');
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': corsResponse.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': corsResponse.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': corsResponse.headers['access-control-allow-headers']
    });
    
    // Test registration endpoint with detailed error handling
    console.log('\n📤 Testing registration endpoint...');
    const testData = {
      id: '87654321',
      name: 'Test Admin User',
      email: 'testadmin2@example.com',
      phone: '+254712345678',
      password: 'TestPass123!'
    };

    console.log('Registration data:', testData);

    const regResponse = await axios.post('http://localhost:4002/api/admin/register', testData, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      },
      timeout: 10000
    });

    console.log('✅ Registration successful!');
    console.log('Response:', regResponse.data);

  } catch (error) {
    console.error('❌ Test failed:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
      
      // Check if it's a CORS error
      if (error.response.status === 0 || error.message.includes('CORS')) {
        console.error('🚨 This looks like a CORS error!');
      }
    } else if (error.request) {
      console.error('No response received. Server might not be running.');
      console.error('Request:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testServer(); 