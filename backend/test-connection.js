const mysql = require('mysql2/promise');

async function testConnection() {
  let connection;
  
  try {
    console.log('🔧 Testing database connection...');
    
    // Try different connection configurations
    const configs = [
      {
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306
      },
      {
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3307
      },
      {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        port: 3306
      }
    ];

    for (const config of configs) {
      try {
        console.log(`\n🔍 Trying connection: ${config.host}:${config.port}`);
        connection = await mysql.createConnection(config);
        console.log('✅ Connected successfully!');
        
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
            console.log('📊 Current table structure:');
            columns.forEach(col => {
              console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
            });
            
            // Check existing data
            const [rows] = await connection.execute('SELECT id, name, email, phone FROM admins');
            console.log('📊 Current admin records:');
            rows.forEach(row => {
              console.log(`  ID: ${row.id}, Name: ${row.name}, Email: ${row.email}, Phone: ${row.phone}`);
            });
            
            break; // Success, exit the loop
          } else {
            console.log('❌ admins table does not exist');
          }
        } else {
          console.log('❌ househunt database does not exist');
        }
        
        await connection.end();
        
      } catch (error) {
        console.log(`❌ Connection failed: ${error.message}`);
        if (connection) {
          await connection.end();
        }
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testConnection(); 