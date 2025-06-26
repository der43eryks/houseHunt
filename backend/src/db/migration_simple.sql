-- Simple Migration script to update admins table structure
-- Run this script to update existing database
-- This version uses basic SQL commands for better compatibility

USE househunt;

-- Step 1: Add name column (ignore error if it already exists)
ALTER TABLE admins ADD COLUMN name VARCHAR(100) AFTER id;

-- Step 2: Update existing records to have a name
-- First, try to use username if it exists
UPDATE admins SET name = username WHERE name IS NULL;

-- Step 3: Set default name for any remaining null names
UPDATE admins SET name = 'Admin User' WHERE name IS NULL;

-- Step 4: Make name column NOT NULL
ALTER TABLE admins MODIFY COLUMN name VARCHAR(100) NOT NULL;

-- Step 5: Add phone column if it doesn't exist, or modify if it does
ALTER TABLE admins ADD COLUMN phone VARCHAR(20) AFTER email;

-- Step 6: Set default phone for any null phones
UPDATE admins SET phone = '+254712345678' WHERE phone IS NULL;

-- Step 7: Make phone column NOT NULL
ALTER TABLE admins MODIFY COLUMN phone VARCHAR(20) NOT NULL;

-- Step 8: Drop username column (ignore error if it doesn't exist)
ALTER TABLE admins DROP COLUMN username;

-- Step 9: Drop role column (ignore error if it doesn't exist)
ALTER TABLE admins DROP COLUMN role;

-- Step 10: Update default admin record
UPDATE admins SET 
  name = 'Admin User',
  phone = '+254712345678'
WHERE id = 'admin-001';

-- Step 11: Show final table structure
DESCRIBE admins; 