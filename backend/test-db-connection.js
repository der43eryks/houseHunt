const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabaseConnection() {
  console.log('🔧 Testing database connection with backend configuration...\n');
  
  try {
    // Use the same configuration as the backend
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'househunt',
      port: parseInt(process.env.DB_PORT || '3307'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

    console.log('📊 Database configuration:');
    console.log(`  Host: ${dbConfig.host}`);
    console.log(`  Port: ${dbConfig.port}`);
    console.log(`  User: ${dbConfig.user}`);
    console.log(`  Password: ${dbConfig.password ? '***' : '(empty)'}`);
    console.log(`  Database: ${dbConfig.database}`);
    console.log('');

    // Test connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully!');

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

        // Test inserting a record
        console.log('\n🔧 Testing insert operation...');
        try {
          const testData = {
            id: '99999999',
            name: 'Test Insert',
            email: 'testinsert@example.com',
            phone: '+254999999999',
            password_hash: 'test_hash'
          };

          const insertQuery = `
            INSERT INTO admins (id, name, password_hash, email, phone)
            VALUES (?, ?, ?, ?, ?)
          `;

          await connection.execute(insertQuery, [
            testData.id,
            testData.name,
            testData.password_hash,
            testData.email,
            testData.phone
          ]);

          console.log('✅ Insert operation successful!');

          // Clean up - delete the test record
          await connection.execute('DELETE FROM admins WHERE id = ?', [testData.id]);
          console.log('✅ Test record cleaned up');

        } catch (insertError) {
          console.error('❌ Insert operation failed:', insertError.message);
        }
        
      } else {
        console.log('❌ admins table does not exist');
      }
    } else {
      console.log('❌ househunt database does not exist');
    }
    
    await connection.end();
    console.log('\n✅ Database connection test completed successfully!');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

testDatabaseConnection(); 