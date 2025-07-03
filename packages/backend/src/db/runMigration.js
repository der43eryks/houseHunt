const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'househunt',
      multipleStatements: true
    });

    console.log('Connected to database successfully');

    // Step 1: Check current table structure
    console.log('\n=== Step 1: Checking current table structure ===');
    const [columns] = await connection.execute('DESCRIBE admins');
    console.log('Current columns:', columns.map(col => col.Field));

    // Step 2: Add name column if it doesn't exist
    console.log('\n=== Step 2: Adding name column ===');
    const nameColumnExists = columns.some(col => col.Field === 'name');
    if (!nameColumnExists) {
      await connection.execute('ALTER TABLE admins ADD COLUMN name VARCHAR(100) AFTER id');
      console.log('✓ Added name column');
    } else {
      console.log('✓ Name column already exists');
    }

    // Step 3: Check if username column exists
    const usernameColumnExists = columns.some(col => col.Field === 'username');
    
    // Step 4: Update name from username if possible
    if (usernameColumnExists) {
      console.log('\n=== Step 3: Updating name from username ===');
      await connection.execute('UPDATE admins SET name = username WHERE name IS NULL');
      console.log('✓ Updated name from username where possible');
    } else {
      console.log('\n=== Step 3: Username column does not exist, skipping ===');
    }

    // Step 5: Set default name for null values
    console.log('\n=== Step 4: Setting default names ===');
    await connection.execute("UPDATE admins SET name = 'Admin User' WHERE name IS NULL");
    console.log('✓ Set default names for null values');

    // Step 6: Make name column NOT NULL
    console.log('\n=== Step 5: Making name column NOT NULL ===');
    await connection.execute('ALTER TABLE admins MODIFY COLUMN name VARCHAR(100) NOT NULL');
    console.log('✓ Made name column NOT NULL');

    // Step 7: Handle phone column
    console.log('\n=== Step 6: Handling phone column ===');
    const phoneColumnExists = columns.some(col => col.Field === 'phone');
    
    if (!phoneColumnExists) {
      await connection.execute('ALTER TABLE admins ADD COLUMN phone VARCHAR(20) AFTER email');
      console.log('✓ Added phone column');
    } else {
      console.log('✓ Phone column already exists');
    }

    // Step 8: Set default phone values
    await connection.execute("UPDATE admins SET phone = '+254712345678' WHERE phone IS NULL");
    console.log('✓ Set default phone values');

    // Step 9: Make phone column NOT NULL
    await connection.execute('ALTER TABLE admins MODIFY COLUMN phone VARCHAR(20) NOT NULL');
    console.log('✓ Made phone column NOT NULL');

    // Step 10: Drop username column if it exists
    if (usernameColumnExists) {
      console.log('\n=== Step 7: Dropping username column ===');
      await connection.execute('ALTER TABLE admins DROP COLUMN username');
      console.log('✓ Dropped username column');
    } else {
      console.log('\n=== Step 7: Username column does not exist, skipping ===');
    }

    // Step 11: Drop role column if it exists
    const roleColumnExists = columns.some(col => col.Field === 'role');
    if (roleColumnExists) {
      console.log('\n=== Step 8: Dropping role column ===');
      await connection.execute('ALTER TABLE admins DROP COLUMN role');
      console.log('✓ Dropped role column');
    } else {
      console.log('\n=== Step 8: Role column does not exist, skipping ===');
    }

    // Step 12: Update default admin record
    console.log('\n=== Step 9: Updating default admin record ===');
    await connection.execute(`
      UPDATE admins SET 
        name = 'Admin User',
        phone = '+254712345678'
      WHERE id = 'admin-001'
    `);
    console.log('✓ Updated default admin record');

    // Step 13: Verify final structure
    console.log('\n=== Step 10: Verifying final table structure ===');
    const [finalColumns] = await connection.execute('DESCRIBE admins');
    console.log('Final columns:', finalColumns.map(col => col.Field));

    // Step 14: Show final data
    console.log('\n=== Step 11: Final data ===');
    const [finalData] = await connection.execute('SELECT id, name, email, phone, created_at, last_login FROM admins');
    console.log('Final data:', finalData);

    console.log('\n🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Error details:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed');
    }
  }
}

// Run the migration
runMigration(); 