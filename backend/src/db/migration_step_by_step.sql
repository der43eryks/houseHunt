-- Step-by-Step Migration script to update admins table structure
-- Run each section individually to identify and fix specific errors

-- ===========================================
-- STEP 1: Check current table structure
-- ===========================================
DESCRIBE admins;

-- ===========================================
-- STEP 2: Add name column
-- ===========================================
-- Run this command:
-- ALTER TABLE admins ADD COLUMN name VARCHAR(100) AFTER id;

-- ===========================================
-- STEP 3: Check if username column exists
-- ===========================================
-- Run this command to see if username column exists:
-- SHOW COLUMNS FROM admins LIKE 'username';

-- ===========================================
-- STEP 4: Update name from username (if username exists)
-- ===========================================
-- If username column exists, run:
-- UPDATE admins SET name = username WHERE name IS NULL;

-- ===========================================
-- STEP 5: Set default name for null values
-- ===========================================
-- Run this command:
-- UPDATE admins SET name = 'Admin User' WHERE name IS NULL;

-- ===========================================
-- STEP 6: Make name column NOT NULL
-- ===========================================
-- Run this command:
-- ALTER TABLE admins MODIFY COLUMN name VARCHAR(100) NOT NULL;

-- ===========================================
-- STEP 7: Check if phone column exists
-- ===========================================
-- Run this command to see if phone column exists:
-- SHOW COLUMNS FROM admins LIKE 'phone';

-- ===========================================
-- STEP 8: Add or modify phone column
-- ===========================================
-- If phone column doesn't exist, run:
-- ALTER TABLE admins ADD COLUMN phone VARCHAR(20) AFTER email;

-- If phone column exists, run:
-- ALTER TABLE admins MODIFY COLUMN phone VARCHAR(20);

-- ===========================================
-- STEP 9: Set default phone values
-- ===========================================
-- Run this command:
-- UPDATE admins SET phone = '+254712345678' WHERE phone IS NULL;

-- ===========================================
-- STEP 10: Make phone column NOT NULL
-- ===========================================
-- Run this command:
-- ALTER TABLE admins MODIFY COLUMN phone VARCHAR(20) NOT NULL;

-- ===========================================
-- STEP 11: Check if username column exists before dropping
-- ===========================================
-- Run this command to see if username column exists:
-- SHOW COLUMNS FROM admins LIKE 'username';

-- ===========================================
-- STEP 12: Drop username column (if it exists)
-- ===========================================
-- If username column exists, run:
-- ALTER TABLE admins DROP COLUMN username;

-- ===========================================
-- STEP 13: Check if role column exists before dropping
-- ===========================================
-- Run this command to see if role column exists:
-- SHOW COLUMNS FROM admins LIKE 'role';

-- ===========================================
-- STEP 14: Drop role column (if it exists)
-- ===========================================
-- If role column exists, run:
-- ALTER TABLE admins DROP COLUMN role;

-- ===========================================
-- STEP 15: Update default admin record
-- ===========================================
-- Run this command:
-- UPDATE admins SET name = 'Admin User', phone = '+254712345678' WHERE id = 'admin-001';

-- ===========================================
-- STEP 16: Verify final table structure
-- ===========================================
-- Run this command:
-- DESCRIBE admins;

-- ===========================================
-- STEP 17: Verify data
-- ===========================================
-- Run this command to see the final data:
-- SELECT id, name, email, phone, created_at, last_login FROM admins; 