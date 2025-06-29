# HouseHunt Client & Admin Site - Functionalities & Pages Documentation

## Recent Updates (June 2025)

### Unified Admin Login/Register
- The client site now redirects all login and registration actions to the admin portal for a single, consistent authentication experience.
- The admin login/register UI is accessible from anywhere, and the client `/auth` route redirects to the admin login page.

### Real API Integration & Real-Time Streaming
- All listings, stats, and dashboard data now use real API endpoints (no mock data).
- When an admin creates a new listing, it is instantly streamed to the client site using Server-Sent Events (SSE), so students see new properties in real time.
- Image uploads are handled by the backend and stored locally (or in the configured storage).

### Listings Status Dropdown Filter (Admin)
- The admin listings page now features a status dropdown (All Status, Available, Rented, Pending).
- Selecting a status filters the listings in real time, both on the frontend and via API query params for large datasets.
- The filter is case-insensitive and works with all status options.

### Responsive & Flexible Layouts
- All admin dashboard components now use `w-full`, `max-w-full`, `container mx-auto`, and `flex-wrap` for full responsiveness.
- No fixed widths are used except for sidebars/avatars, ensuring the UI adapts to all screen sizes without horizontal scroll.

---

## Project Overview
HouseHunt is a student accommodation platform serving MMUST and surrounding areas in Kakamega, Kenya. The client site was started in 2020 and provides a comprehensive platform for students to find, view, and inquire about student housing options.

## Current Pages & Functionalities

### 1. HomePage (`/`)
**File:** `client/src/pages/HomePage.jsx`

#### Appearance:
- **Hero Section**: Full-width background image with overlay, featuring a search bar
- **Categories Section**: Three cards displaying different room types (Bedsitters, Single Rooms, Two Bedrooms)
- **Available Rooms Section**: Grid layout showing featured listings using HouseCard components
- **Color Scheme**: Blue theme (#3B82F6) with white and gray accents
- **Responsive Design**: Mobile-first approach with responsive grid layouts

#### Functionalities:
- **Search Bar**: Placeholder for location-based search (currently non-functional)
- **Category Display**: Static display of room types with descriptions
- **Listing Display**: Shows available rooms from mock data
- **Navigation**: Links to individual listing details

#### Admin Site Dependencies:
- **Listings Data**: Currently uses mock data, needs integration with admin-created listings
- **Search Functionality**: Requires backend API integration for location-based search
- **Featured Listings**: Admin should be able to mark listings as featured for homepage display
- **Category Management**: Admin should manage room type categories and descriptions

#### Non-Admin Dependencies:
- **Hero Image**: Uses Unsplash placeholder, needs custom branding image
- **Search Implementation**: Requires backend search API development

---

### 2. ListingsPage (`/listings`)
**File:** `client/src/pages/ListingsPage.jsx`

#### Appearance:
- **Header Section**: Title, listing count, search bar, and filter toggle
- **Filter Sidebar**: Collapsible filters for price range, room type, and security features
- **Grid Layout**: Responsive grid showing all listings with HouseCard components
- **Search Bar**: Real-time search functionality with icon
- **Filter Button**: Toggle for mobile filter display

#### Functionalities:
- **Advanced Filtering**: Price range, room type, secure area checkbox
- **Real-time Search**: Filters listings by title and location
- **URL Parameters**: Maintains filter state in URL for sharing/bookmarking
- **Responsive Filters**: Collapsible on mobile, sidebar on desktop
- **Listing Count**: Shows total available listings

#### Admin Site Dependencies:
- **Listings Data**: Requires real listings from admin database
- **Filter Options**: Admin should manage room types and amenities for filtering
- **Pricing Data**: Admin sets price ranges and payment frequencies
- **Security Features**: Admin marks properties as secure areas

#### Non-Admin Dependencies:
- **Search Algorithm**: Backend search implementation needed
- **Filter Logic**: Server-side filtering for large datasets

---

### 3. ListingDetailPage (`/listings/:id`)
**File:** `client/src/pages/ListingDetailPage.jsx`

#### Appearance:
- **Image Gallery**: Main image with thumbnail navigation
- **Property Details**: Title, price, location, rating, room details
- **Amenities Section**: Grid layout with icons for each amenity
- **Description**: Full property description
- **Contact Actions**: Call, WhatsApp, and Request Visit buttons
- **Inquiry Modal**: Form for requesting property visits

#### Functionalities:
- **Image Gallery**: Multiple image support with thumbnail navigation
- **Contact Integration**: Direct phone calls and WhatsApp messaging
- **Inquiry System**: Form submission for property visits
- **Rating Display**: Shows property rating and review count
- **Responsive Design**: Mobile-optimized layout

#### Admin Site Dependencies:
- **Property Data**: Complete listing information from admin database
- **Image Management**: Admin uploads and manages property images
- **Contact Information**: Admin provides agent phone and WhatsApp details
- **Amenities**: Admin defines available amenities for each property
- **Inquiry Management**: Admin receives and manages visit requests

#### Non-Admin Dependencies:
- **Image Storage**: Backend image upload and storage system
- **WhatsApp Integration**: WhatsApp Business API integration
- **Email System**: Automated email notifications for inquiries

---

### 4. AuthPage (`/auth`)
**File:** `client/src/pages/AuthPage.jsx`

#### Appearance:
- **Clean Modal Design**: Centered white card with shadow
- **Tab Interface**: Simple login/signup toggle
- **Form Fields**: Email, password, name (for signup)
- **Blue Theme**: Consistent with site branding
- **Responsive**: Mobile-friendly design

#### Functionalities:
- **Tab Switching**: Toggle between login and signup forms
- **Form Validation**: Basic input validation
- **Password Recovery**: "Forgot password" link (non-functional)
- **Clean UI**: Minimal, focused design

#### Admin Site Dependencies:
- **Authentication System**: Admin manages user accounts
- **User Registration**: Admin approves new user registrations
- **Password Reset**: Admin handles password recovery requests

#### Non-Admin Dependencies:
- **Backend Auth**: JWT or session-based authentication system
- **Email Verification**: Email confirmation system
- **Password Security**: Secure password hashing and validation

---

### 5. AboutPage (`/about`)
**File:** `client/src/pages/AboutPage.jsx`

#### Appearance:
- **Hero Section**: Blue gradient background with company title
- **Stats Section**: Four key metrics with icons
- **Mission Section**: Company mission and values
- **Team Section**: Team member profiles with photos
- **Story Section**: Company history and journey
- **CTA Section**: Call-to-action for browsing listings
- **Contact Info**: Footer with contact details

#### Functionalities:
- **Static Content**: Company information and team details
- **Responsive Layout**: Mobile-optimized sections
- **Contact Integration**: Links to contact methods

#### Admin Site Dependencies:
- **Team Photos**: **WAITING FOR ADMIN UPLOADS** - Team member images need to be uploaded by admin
- **Company Stats**: Admin should be able to update statistics
- **Content Management**: Admin should edit company story and mission
- **Contact Information**: Admin manages contact details

#### Non-Admin Dependencies:
- **Image Upload System**: For team photos and company images
- **Content Management**: CMS for updating about page content
- **Analytics Integration**: Real-time statistics display

---

### 6. ContactPage (`/contact`)
**File:** `client/src/pages/ContactPage.jsx`

#### Appearance:
- **Hero Header**: Blue gradient with contact title
- **Contact Methods**: Cards for phone, WhatsApp, email, Facebook
- **Contact Form**: User message submission form
- **Feedback Form**: Rating and feedback submission
- **Social Links**: Social media integration
- **Business Hours**: Operating hours display

#### Functionalities:
- **Multiple Contact Methods**: Phone, WhatsApp, email, social media
- **Contact Form**: User message submission
- **Feedback System**: Rating and feedback collection
- **Direct Actions**: Click-to-call, WhatsApp chat, email links
- **Form Validation**: Input validation and error handling

#### Admin Site Dependencies:
- **Contact Information**: Admin manages all contact details
- **Business Hours**: Admin sets operating hours
- **Social Media**: Admin provides social media links
- **Message Management**: Admin receives and responds to contact forms
- **Feedback Management**: Admin reviews and responds to feedback

#### Non-Admin Dependencies:
- **Email System**: Automated email notifications
- **WhatsApp Business**: WhatsApp Business API integration
- **Form Processing**: Backend form handling and storage

---

### 7. HelpDeskPage (`/help`)
**File:** `client/src/pages/HelpDeskPage.jsx`

#### Appearance:
- **Header Section**: Help and support title
- **Contact Information**: Detailed contact methods with icons
- **FAQ Section**: Frequently asked questions
- **Feedback Form**: User feedback submission
- **Business Hours**: Support availability
- **Location Info**: Office location details

#### Functionalities:
- **Contact Integration**: Direct contact methods
- **FAQ Display**: Common questions and answers
- **Feedback Collection**: User feedback and ratings
- **Support Hours**: Business hours display
- **Location Services**: Office location and directions

#### Admin Site Dependencies:
- **FAQ Management**: Admin creates and manages FAQ content
- **Support Hours**: Admin sets support availability
- **Contact Details**: Admin manages all support contact information
- **Feedback Processing**: Admin reviews and responds to feedback
- **Location Management**: Admin updates office location

#### Non-Admin Dependencies:
- **FAQ System**: Backend FAQ management
- **Feedback Processing**: Automated feedback handling
- **Location Services**: Maps integration for directions

---

### 8. VerifyPage (`/verify`)
**File:** `client/src/pages/VerifyPage.jsx`

#### Appearance:
- **Dark Theme**: Black background with white text
- **Verification Code**: Four-digit input boxes
- **Clean Design**: Minimal, focused verification interface
- **Skip Option**: Option to skip verification

#### Functionalities:
- **Code Input**: Four-digit verification code entry
- **Auto-focus**: Automatic focus movement between inputs
- **Paste Support**: Paste full code from clipboard
- **Backspace Navigation**: Navigate backwards with backspace
- **Skip Functionality**: Option to skip verification

#### Admin Site Dependencies:
- **Verification System**: Admin manages email verification process
- **User Management**: Admin handles unverified user accounts
- **Email Templates**: Admin customizes verification emails

#### Non-Admin Dependencies:
- **Email Service**: Email delivery system
- **Code Generation**: Secure verification code generation
- **Session Management**: User session handling after verification

---

## Common Components

### HouseCard Component
**File:** `client/src/components/HouseCard.jsx`
- **Display**: Property image, title, price, location, amenities
- **Actions**: View details, contact agent
- **Responsive**: Mobile-optimized card design
- **Admin Dependencies**: Property data, images, pricing

### Navbar Component
**File:** `client/src/components/Navbar.jsx`
- **Navigation**: Links to all major pages
- **Branding**: HouseHunt logo and branding
- **Mobile Menu**: Responsive navigation menu
- **Admin Dependencies**: None (static navigation)

### Footer Component
**File:** `client/src/components/Footer.jsx`
- **Links**: Quick links to important pages
- **Contact Info**: Basic contact information
- **Social Media**: Social media links
- **Admin Dependencies**: Contact information, social links

---

## Technical Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Query for API calls
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast

### Backend Integration
- **API**: Axios with interceptors
- **Authentication**: JWT tokens (planned)
- **Real-time**: WebSocket support (planned)

### Data Sources
- **Current**: Mock data (`mockData.js`)
- **Planned**: MySQL database via REST API
- **Images**: Currently using Unsplash placeholders

---

## Admin Site Integration Requirements

### Critical Dependencies
1. **Listings Management**: CRUD operations for property listings
2. **Image Upload**: Property image management system
3. **User Management**: Authentication and user account management
4. **Inquiry Management**: Handle property visit requests
5. **Contact Management**: Update contact information and social links
6. **Content Management**: Edit about page, FAQ, and other static content

### Data Synchronization
- **Real-time Updates**: Live updates when admin changes listings
- **Image Optimization**: Automatic image resizing and optimization
- **Search Indexing**: Real-time search index updates
- **Cache Management**: Efficient caching for performance

### Security Requirements
- **Authentication**: Secure user authentication system
- **Authorization**: Role-based access control
- **Data Validation**: Input validation and sanitization
- **API Security**: Rate limiting and CORS configuration

---

## Development Status

### Completed
- ✅ All page layouts and designs
- ✅ Responsive design implementation
- ✅ Component architecture
- ✅ Mock data structure
- ✅ API service layer setup

### In Progress
- 🔄 Backend API integration
- 🔄 Authentication system
- 🔄 Image upload functionality

### Pending
- ⏳ Real data integration
- ⏳ Admin site synchronization
- ⏳ Email system implementation
- ⏳ WhatsApp Business integration
- ⏳ Performance optimization
- ⏳ SEO implementation

---

## Notes for Development

1. **Image Placeholders**: All images currently use Unsplash placeholders and need to be replaced with actual property and team photos
2. **Mock Data**: Currently using static mock data, needs complete backend integration
3. **Authentication**: Basic UI implemented, needs full backend authentication system
4. **Responsive Design**: All pages are mobile-responsive and tested
5. **Performance**: Optimized for fast loading with lazy loading planned
6. **Accessibility**: Basic accessibility features implemented, needs enhancement

This documentation serves as a comprehensive guide for understanding the current state of the client site and its integration requirements with the admin system. 