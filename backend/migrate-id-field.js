const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateIdField() {
  let connection;
  
  try {
    console.log('🔧 Starting ID field migration...');
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'househunt'
    });

    console.log('✅ Connected to database');

    // Step 1: Modify id column to VARCHAR(8)
    console.log('📝 Modifying id column to VARCHAR(8)...');
    await connection.execute('ALTER TABLE admins MODIFY COLUMN id VARCHAR(8) PRIMARY KEY');
    console.log('✅ ID column modified successfully');

    // Step 2: Update default admin record
    console.log('📝 Updating default admin record...');
    await connection.execute(`
      UPDATE admins 
      SET id = '12345678', name = 'Admin User', phone = '+254712345678' 
      WHERE id = 'admin-001' OR id LIKE 'admin-%'
    `);
    console.log('✅ Default admin record updated');

    // Step 3: Verify the changes
    console.log('🔍 Verifying changes...');
    const [rows] = await connection.execute('DESCRIBE admins');
    console.log('📊 Current table structure:');
    rows.forEach(row => {
      console.log(`  ${row.Field}: ${row.Type} ${row.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${row.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
    });

    const [adminRows] = await connection.execute('SELECT id, name, email, phone FROM admins');
    console.log('📊 Current admin records:');
    adminRows.forEach(row => {
      console.log(`  ID: ${row.id}, Name: ${row.name}, Email: ${row.email}, Phone: ${row.phone}`);
    });

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

migrateIdField(); 