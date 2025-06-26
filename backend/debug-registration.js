const axios = require('axios');

async function testRegistration() {
  try {
    console.log('🔧 Testing registration endpoint...');
    
    // Test data
    const testData = {
      id: '12345678',
      name: 'Test Admin',
      email: 'test@example.com',
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

  } catch (error) {
    console.error('❌ Registration failed:');
    
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

async function testDatabaseConnection() {
  try {
    console.log('\n🔧 Testing database connection...');
    
    const mysql = require('mysql2/promise');
    
    // Try to connect with different configurations
    const configs = [
      { host: 'localhost', user: 'root', password: '', port: 3306 },
      { host: 'localhost', user: 'root', password: '', port: 3307 },
      { host: '127.0.0.1', user: 'root', password: '', port: 3306 }
    ];

    for (const config of configs) {
      try {
        console.log(`\n🔍 Trying: ${config.host}:${config.port}`);
        const connection = await mysql.createConnection(config);
        console.log('✅ Connected to MySQL!');
        
        // Check if househunt database exists
        const [databases] = await connection.execute('SHOW DATABASES');
        const dbExists = databases.some(db => db.Database === 'househunt');
        
        if (dbExists) {
          console.log('✅ househunt database exists');
          
          // Connect to househunt database
          await connection.execute('USE househunt');
          
          // Check admins table
          const [tables] = await connection.execute('SHOW TABLES');
          const adminsTableExists = tables.some(table => 
            Object.values(table)[0] === 'admins'
          );
          
          if (adminsTableExists) {
            console.log('✅ admins table exists');
            
            // Check table structure
            const [columns] = await connection.execute('DESCRIBE admins');
            console.log('📊 Table structure:');
            columns.forEach(col => {
              console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
            });
            
            // Check existing data
            const [rows] = await connection.execute('SELECT id, name, email, phone FROM admins');
            console.log('📊 Existing admin records:');
            rows.forEach(row => {
              console.log(`  ID: ${row.id}, Name: ${row.name}, Email: ${row.email}, Phone: ${row.phone}`);
            });
            
            await connection.end();
            return true;
          } else {
            console.log('❌ admins table does not exist');
          }
        } else {
          console.log('❌ househunt database does not exist');
        }
        
        await connection.end();
        
      } catch (error) {
        console.log(`❌ Connection failed: ${error.message}`);
      }
    }
    
    return false;
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting debug process...\n');
  
  // First test database connection
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    console.log('\n❌ Database connection failed. Please check your MySQL setup.');
    console.log('💡 Make sure MySQL is running and accessible.');
    return;
  }
  
  // Wait a moment for server to start
  console.log('\n⏳ Waiting for server to start...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Then test registration
  await testRegistration();
}

main(); 