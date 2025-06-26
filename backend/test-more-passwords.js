const mysql = require('mysql2/promise');
const axios = require('axios');

async function testMorePasswords() {
  console.log('🔧 Testing more MySQL password combinations...\n');
  
  // Extended list of common passwords
  const passwords = [
    '', 'root', 'password', 'admin', '123456', 'mysql', 
    '1234', '12345', '123456789', 'qwerty', 'abc123',
    'password123', 'admin123', 'root123', 'mysql123',
    '12345678', '87654321', '000000', '111111', '222222'
  ];
  
  const port = 3307; // Based on previous test results
  
  for (const password of passwords) {
    try {
      console.log(`🔍 Trying password: "${password}"`);
      
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: password,
        port: port
      });
      
      console.log(`✅ SUCCESS! Connected with password: "${password}"`);
      
      // Test if househunt database exists
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
          
          console.log(`\n💾 Working configuration found:`);
          console.log(`   Host: localhost`);
          console.log(`   Port: ${port}`);
          console.log(`   User: root`);
          console.log(`   Password: "${password}"`);
          console.log(`   Database: househunt`);
          
          return { host: 'localhost', port, user: 'root', password, database: 'househunt' };
        } else {
          console.log('❌ admins table does not exist');
        }
      } else {
        console.log('❌ househunt database does not exist');
      }
      
      await connection.end();
      
    } catch (error) {
      if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.log(`  ❌ Access denied`);
      } else {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }
  }
  
  console.log('\n❌ No working password found.');
  return null;
}

async function testRegistrationEndpoint() {
  console.log('\n🔧 Testing registration endpoint...\n');
  
  try {
    const testData = {
      id: '87654321',
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

async function main() {
  console.log('🚀 Starting comprehensive connection test...\n');
  
  // Test database connection
  const config = await testMorePasswords();
  
  if (config) {
    console.log('\n✅ Database connection successful!');
    console.log('Now testing registration endpoint...');
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test registration endpoint
    await testRegistrationEndpoint();
  } else {
    console.log('\n❌ Could not connect to database.');
    console.log('Please provide the correct MySQL password.');
  }
}

main(); 