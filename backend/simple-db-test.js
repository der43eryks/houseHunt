const mysql = require('mysql2/promise');
require('dotenv').config();

async function simpleDbTest() {
  console.log('🔧 Simple database connection test...\n');
  
  try {
    // Use the same configuration as the backend
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'househunt',
      port: parseInt(process.env.DB_PORT || '3307')
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

    // Test basic queries without prepared statements
    console.log('\n🔧 Testing basic queries...');
    
    // Check if we can query the database
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('✅ SHOW DATABASES works');
    
    // Check if househunt database exists
    const dbExists = databases.some(db => db.Database === 'househunt');
    if (dbExists) {
      console.log('✅ househunt database exists');
      
      // Use the database
      await connection.query('USE househunt');
      console.log('✅ USE househunt works');
      
      // Check tables
      const [tables] = await connection.query('SHOW TABLES');
      console.log('✅ SHOW TABLES works');
      
      const adminsTableExists = tables.some(table => 
        Object.values(table)[0] === 'admins'
      );
      
      if (adminsTableExists) {
        console.log('✅ admins table exists');
        
        // Check table structure
        const [columns] = await connection.query('DESCRIBE admins');
        console.log('📊 Table structure:');
        columns.forEach(col => {
          console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
        });
        
        // Check existing data
        const [rows] = await connection.query('SELECT id, name, email, phone FROM admins');
        console.log('📊 Existing admin records:');
        rows.forEach(row => {
          console.log(`  ID: ${row.id}, Name: ${row.name}, Email: ${row.email}, Phone: ${row.phone}`);
        });

        // Test the exact insert query used in registration
        console.log('\n🔧 Testing registration insert query...');
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
            VALUES ('${testData.id}', '${testData.name}', '${testData.password_hash}', '${testData.email}', '${testData.phone}')
          `;

          console.log('Executing query:', insertQuery);
          await connection.query(insertQuery);
          console.log('✅ Insert query successful!');

          // Clean up - delete the test record
          await connection.query(`DELETE FROM admins WHERE id = '${testData.id}'`);
          console.log('✅ Test record cleaned up');

        } catch (insertError) {
          console.error('❌ Insert query failed:', insertError.message);
          console.error('Error code:', insertError.code);
        }
        
      } else {
        console.log('❌ admins table does not exist');
      }
    } else {
      console.log('❌ househunt database does not exist');
    }
    
    await connection.end();
    console.log('\n✅ Database test completed successfully!');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

simpleDbTest(); 