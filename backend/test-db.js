const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabase() {
  let connection;
  
  try {
    console.log('Testing database connection...');
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3307
    });

    console.log('✅ Connected to MySQL server');

    // Check if database exists
    const [databases] = await connection.execute(`SHOW DATABASES LIKE 'househunt'`);
    if (databases.length === 0) {
      console.log('❌ Database "househunt" does not exist');
      console.log('Please run the SQL script: backend/src/db/houseHunt.sql');
      return;
    }
    console.log('✅ Database "househunt" exists');

    // Use the database
    await connection.execute('USE househunt');

    // Check if admins table exists
    const [tables] = await connection.execute(`SHOW TABLES LIKE 'admins'`);
    if (tables.length === 0) {
      console.log('❌ Table "admins" does not exist');
      console.log('Please run the SQL script: backend/src/db/houseHunt.sql');
      return;
    }
    console.log('✅ Table "admins" exists');

    // Check table structure
    const [columns] = await connection.execute('DESCRIBE admins');
    console.log('📋 Admins table structure:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });

    // Check if there are any admins
    const [admins] = await connection.execute('SELECT COUNT(*) as count FROM admins');
    console.log(`👥 Number of admins: ${admins[0].count}`);

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testDatabase(); 