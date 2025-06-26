const axios = require('axios');

async function testRegistration() {
  console.log('🔧 Testing registration endpoint...\n');
  
  try {
    // Test data with a unique ID and email
    const testData = {
      id: '87654321',
      name: 'Test Admin User',
      email: 'testadmin@example.com',
      phone: '+254712345678',
      password: 'TestPass123!'
    };

    console.log('📤 Sending registration request...');
    console.log('Data:', testData);

    const response = await axios.post('http://localhost:4002/api/admin/register', testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
    
    // Test login with the newly created account
    console.log('\n🔧 Testing login with new account...');
    
    const loginData = {
      email: 'testadmin@example.com',
      password: 'TestPass123!'
    };

    const loginResponse = await axios.post('http://localhost:4002/api/admin/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Login successful!');
    console.log('Login Response:', loginResponse.data);

  } catch (error) {
    console.error('❌ Test failed:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Server might not be running.');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegistration(); 