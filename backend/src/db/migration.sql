-- Migration script to update admins table structure
-- Run this script to update existing database
-- This script is compatible with MySQL 5.7+ and MariaDB

USE househunt;

-- Modify id column to VARCHAR(8) for Kenyan ID numbers
ALTER TABLE admins MODIFY COLUMN id VARCHAR(8) PRIMARY KEY;

-- Check if name column exists, if not add it
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'househunt' 
     AND TABLE_NAME = 'admins' 
     AND COLUMN_NAME = 'name') = 0,
    'ALTER TABLE admins ADD COLUMN name VARCHAR(100) AFTER id',
    'SELECT "name column already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if username column exists before trying to use it
SET @username_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                       WHERE TABLE_SCHEMA = 'househunt' 
                       AND TABLE_NAME = 'admins' 
                       AND COLUMN_NAME = 'username');

-- Update existing records to have a name (using username as name if name is null and username exists)
SET @sql = (SELECT IF(
    @username_exists > 0,
    'UPDATE admins SET name = username WHERE name IS NULL AND username IS NOT NULL',
    'SELECT "username column does not exist, skipping name update" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Set default name for any remaining null names
UPDATE admins SET name = 'Admin User' WHERE name IS NULL;

-- Make name column NOT NULL (only if it's not already)
SET @sql = (SELECT IF(
    (SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'househunt' 
     AND TABLE_NAME = 'admins' 
     AND COLUMN_NAME = 'name') = 'YES',
    'ALTER TABLE admins MODIFY COLUMN name VARCHAR(100) NOT NULL',
    'SELECT "name column is already NOT NULL" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if phone column exists and make it NOT NULL
SET @phone_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_SCHEMA = 'househunt' 
                    AND TABLE_NAME = 'admins' 
                    AND COLUMN_NAME = 'phone');

SET @sql = (SELECT IF(
    @phone_exists > 0,
    'ALTER TABLE admins MODIFY COLUMN phone VARCHAR(20) NOT NULL',
    'ALTER TABLE admins ADD COLUMN phone VARCHAR(20) NOT NULL'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Set default phone for any null phones
UPDATE admins SET phone = '+254712345678' WHERE phone IS NULL;

-- Drop username column if it exists
SET @sql = (SELECT IF(
    @username_exists > 0,
    'ALTER TABLE admins DROP COLUMN username',
    'SELECT "username column does not exist, skipping drop" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if role column exists and drop it
SET @role_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_SCHEMA = 'househunt' 
                   AND TABLE_NAME = 'admins' 
                   AND COLUMN_NAME = 'role');

SET @sql = (SELECT IF(
    @role_exists > 0,
    'ALTER TABLE admins DROP COLUMN role',
    'SELECT "role column does not exist, skipping drop" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update default admin record with a proper Kenyan ID
UPDATE admins SET 
  id = '12345678',
  name = 'Admin User',
  phone = '+254712345678'
WHERE id = 'admin-001';

-- Show final table structure
DESCRIBE admins; 