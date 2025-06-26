const mysql = require('mysql2/promise');

async function testMySQLConnection() {
  console.log('🔧 Testing MySQL connection with different configurations...\n');
  
  // Common password combinations to try
  const passwords = ['', 'root', 'password', 'admin', '123456', 'mysql'];
  const ports = [3306, 3307, 3308];
  
  for (const port of ports) {
    console.log(`\n🔍 Testing port ${port}...`);
    
    for (const password of passwords) {
      try {
        console.log(`  Trying password: "${password}"`);
        
        const connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: password,
          port: port
        });
        
        console.log(`✅ SUCCESS! Connected with port ${port}, password: "${password}"`);
        
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
            
            // Save the working configuration
            console.log(`\n💾 Working configuration:`);
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
        // Don't log every failed attempt to avoid spam
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
          console.log(`  ❌ Access denied with password: "${password}"`);
        } else if (error.code === 'ECONNREFUSED') {
          console.log(`  ❌ Connection refused on port ${port}`);
          break; // Skip other passwords for this port
        } else {
          console.log(`  ❌ Error: ${error.message}`);
        }
      }
    }
  }
  
  console.log('\n❌ No working configuration found.');
  console.log('💡 Please check:');
  console.log('   1. MySQL server is running');
  console.log('   2. Correct port (usually 3306 or 3307)');
  console.log('   3. Correct username and password');
  console.log('   4. househunt database exists');
  
  return null;
}

testMySQLConnection(); 