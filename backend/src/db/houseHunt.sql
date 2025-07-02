-- HouseHunt Database Schema

CREATE DATABASE IF NOT EXISTS househunt;
USE househunt;

-- Admin Users Table
CREATE TABLE admins (
  id VARCHAR(8) PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);

-- House Listings Table
CREATE TABLE listings (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  room_type ENUM('Single', 'Bedsitter', 'Two-bedroom', 'Other') NOT NULL,
  stay_two_people BOOLEAN DEFAULT FALSE,
  price DECIMAL(10,2) NOT NULL,
  payment_frequency ENUM('Monthly', 'Semester', 'Flexible') NOT NULL,
  location_text TEXT NOT NULL,
  area_nickname VARCHAR(100),
  tags JSON,
  images JSON,
  amenities JSON,
  is_secure_area BOOLEAN DEFAULT FALSE,
  agent_phone VARCHAR(20) NOT NULL,
  agent_whatsapp VARCHAR(20),
  agent_facebook VARCHAR(255),
  available BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inquiries Table
CREATE TABLE inquiries (
  id VARCHAR(36) PRIMARY KEY,
  house_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  preferred_visit_time VARCHAR(100),
  status ENUM('pending', 'responded', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (house_id) REFERENCES listings(id) ON DELETE CASCADE
);

-- Help Desk Table
CREATE TABLE help_desk (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  whatsapp_link VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  facebook VARCHAR(255) NOT NULL,
  available_hours VARCHAR(100) NOT NULL,
  faq JSON,
  contact_form_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Feedback Table
CREATE TABLE feedbacks (
  id VARCHAR(36) PRIMARY KEY,
  listing_id VARCHAR(36),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL
);

-- Indexes for better performance
CREATE INDEX idx_listings_room_type ON listings(room_type);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_available ON listings(available);
CREATE INDEX idx_listings_secure_area ON listings(is_secure_area);
CREATE INDEX idx_listings_created_at ON listings(created_at);
CREATE INDEX idx_inquiries_house_id ON inquiries(house_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_feedbacks_listing_id ON feedbacks(listing_id);

-- Insert default admin user (password: admin123)
INSERT INTO admins (id, username, password_hash, email, phone) VALUES 
('12345678', 'admin', '$2b$10$rQZ8K9mN2pL4vX7wY1sT3uI6oP8qR9sA0bB1cD2eF3gH4iJ5kL6mN7oP8qR', 'admin@househunt.com', '+254712345678');

-- Insert default help desk info
INSERT INTO help_desk (id, name, phone, whatsapp_link, email, facebook, available_hours, faq) VALUES 
('help-001', 'HouseHunt Support', '+254712345678', 'https://wa.me/254712345678', 'help@househunt.com', 'https://facebook.com/househunt', 'Mon-Fri 8am-6pm', 
'[{"question": "How do I contact an agent?", "answer": "You can call the agent directly using the phone number provided in each listing."}, 
{"question": "Can I visit a property?", "answer": "Yes, you can request a visit by clicking the Request Visit button on any listing."}]');

-- Insert sample listings
INSERT INTO listings (id, title, description, room_type, stay_two_people, price, payment_frequency, location_text, area_nickname, tags, images, amenities, is_secure_area, agent_phone, available) VALUES 
('listing-001', 'Spacious Bedsitter near Kakamega Bypass, Female Only', 'Bright and spacious bedsitter with tiled floors, Wi-Fi included, secure area, water included, 10 min walk to campus. Perfect for female students.', 'Bedsitter', FALSE, 4000.00, 'Monthly', 'Near Kakamega Bypass, Ksh.30 on tuk-tuk, 10 minutes walking distance', 'Kakamega Bypass', '["female only", "secure area", "Wi-Fi", "tiled floors"]', '["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80"]', '["lighting", "Wi-Fi", "tiled floors", "ceiling", "water included"]', TRUE, '+254712345678', TRUE),
('listing-002', 'Single Room - Lurambi, Near MMUST Gate', 'Cozy single room with painted walls, shared token meter, water separated, 15 min to campus, male only, very affordable.', 'Single', FALSE, 3000.00, 'Monthly', 'Lurambi, Near MMUST Gate, Ksh.50 on motorbikes, 15 minutes walking', 'Lurambi', '["male only", "affordable", "shared token"]', '["https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80"]', '["lighting", "painted walls", "shared token", "water separated"]', FALSE, '+254712345679', TRUE),
('listing-003', 'Two Bedroom - Near MMUST, Pay Per Semester', 'Modern two-bedroom apartment, perfect for sharing with a friend, Wi-Fi included, water included, 5 min walk to campus, very secure area.', 'Two-bedroom', TRUE, 20000.00, 'Semester', 'Near MMUST Campus, 5 minutes walking distance', 'MMUST Area', '["flexible", "secure area", "Wi-Fi", "modern"]', '["https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"]', '["lighting", "Wi-Fi", "tiled floors", "ceiling", "water included", "modern kitchen"]', TRUE, '+254712345680', TRUE); 