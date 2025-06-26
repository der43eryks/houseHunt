# houseHunt
To simplify the student housing search process by providing a reliable, secure, and user-friendly platform that connects students with quality accommodation options near their educational institutions.

# HouseHunt - Student Accommodation Platform

A modern, full-stack real estate platform specifically designed for student housing. Features a client-facing website for students to find accommodation and an admin dashboard for property managers to manage listings.

## 🏠 Features

### Client Website
- **Homepage**: Hero section, featured listings, quick filters, statistics
- **Listings Page**: Advanced search, filters (room type, price, location, secure areas), pagination
- **Listing Details**: Image gallery, full description, amenities, contact agent, request visit
- **Help Desk**: Contact information, WhatsApp integration, FAQ, feedback system
- **Search & Filters**: Location-based search, room type filters, price range, payment frequency
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Admin Dashboard
- **Authentication**: Secure login with JWT tokens
- **Listing Management**: CRUD operations for house listings
- **Image Upload**: Multiple image upload for listings
- **Inquiry Management**: View and respond to student inquiries
- **Help Desk Management**: Update contact info, FAQ, availability hours
- **Feedback System**: View and manage user feedback
- **Statistics**: Dashboard with key metrics and analytics

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MySQL with connection pooling
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Joi schema validation
- **File Upload**: Multer for image handling
- **Security**: Helmet, CORS, rate limiting
- **Development**: ts-node-dev for hot reloading

### Frontend (Client)
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: React Query for server state
- **HTTP Client**: Axios with interceptors
- **UI Components**: Lucide React icons
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

### Database
- **RDBMS**: MySQL
- **Schema**: Optimized with proper indexes
- **Relations**: Foreign key constraints
- **Data Types**: JSON fields for arrays, proper enums

## 📁 Project Structure

```
HouseHunt/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── api/            # API endpoints
│   │   │   ├── adminEndpoints.ts
│   │   │   └── clientEndpoints.ts
│   │   ├── config/         # Database configuration
│   │   │   └── database.ts
│   │   ├── db/             # Database schema
│   │   │   └── houseHunt.sql
│   │   ├── middleware/     # Authentication & validation
│   │   │   ├── auth.ts
│   │   │   └── validation.ts
│   │   ├── models/         # Database models
│   │   │   ├── AdminModel.ts
│   │   │   ├── ListingModel.ts
│   │   │   ├── InquiryModel.ts
│   │   │   ├── HelpDeskModel.ts
│   │   │   └── FeedbackModel.ts
│   │   └── server.ts       # Main server file
│   ├── uploads/            # Image upload directory
│   ├── package.json
│   ├── tsconfig.json
│   └── env.example
│
├── client/                 # Client-facing website
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── ListingsPage.jsx
│   │   │   ├── ListingDetailPage.jsx
│   │   │   └── HelpDeskPage.jsx
│   │   ├── services/       # API services
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── shared/                 # Shared types
│   └── types/
│       └── db_types.ts
│
└── README.md
```

## 🗄️ Database Schema

### Core Tables
- **`listings`**: House listings with all details
- **`admins`**: Admin users and authentication
- **`inquiries`**: Student inquiries and visit requests
- **`help_desk`**: Contact information and FAQ
- **`feedbacks`**: User feedback and ratings

### Key Features
- **Indexes**: Optimized for common queries (room type, price, location, secure areas)
- **JSON Fields**: For tags, amenities, images, FAQ
- **Foreign Keys**: Proper relationships between tables
- **Timestamps**: Created/updated tracking

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd HouseHunt
```

### 2. Database Setup
```bash
# Connect to MySQL and create database
mysql -u root -p
CREATE DATABASE househunt;
USE househunt;

# Import schema (from project root)
mysql -u root -p househunt < backend/src/db/houseHunt.sql
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=househunt
# JWT_SECRET=your-secret-key

# Start development server
npm run dev
```

### 4. Client Setup
```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Access Applications
- **Client Website**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/api/health

## 🌐 API Endpoints

### Client API (`/api/client`)
- `GET /listings` - Get all available listings with filters
- `GET /listings/:id` - Get single listing details
- `GET /listings/featured` - Get featured listings
- `POST /inquiries` - Submit inquiry/visit request
- `GET /helpdesk` - Get help desk information
- `POST /feedbacks` - Submit feedback
- `GET /search/suggestions` - Get search suggestions
- `GET /stats` - Get platform statistics

### Admin API (`/api/admin`)
- `POST /login` - Admin authentication
- `GET /profile` - Get admin profile
- `PUT /profile` - Update admin profile
- `PUT /change-password` - Change password
- `GET /listings` - Get all listings (admin view)
- `POST /listings` - Create new listing
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing
- `GET /inquiries` - Get all inquiries
- `POST /inquiries/:id/respond` - Respond to inquiry
- `GET /helpdesk` - Get help desk info
- `PUT /helpdesk` - Update help desk info
- `GET /feedbacks` - Get all feedback
- `GET /stats` - Get dashboard statistics

## 🔐 Authentication

### Admin Login
- **Default Credentials**: 
  - Username: `admin`
  - Password: `admin123`
- **JWT Tokens**: 24-hour expiration
- **Protected Routes**: All admin endpoints require authentication

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation with Joi

## 📱 Features by Page

### Homepage
- Hero section with search functionality
- Featured listings (secure areas prioritized)
- Quick filter buttons
- Platform statistics
- Why choose HouseHunt section

### Listings Page
- Advanced search and filtering
- Room type filters (Single, Bedsitter, Two-bedroom)
- Price range filtering
- Payment frequency filters
- Location-based search
- Secure area filter
- Pagination (12 items per page)
- Responsive grid layout

### Listing Details
- Image gallery
- Complete property information
- Amenities list with icons
- Agent contact information
- Call agent functionality
- Request visit form
- User feedback and ratings
- Location details with transport info

### Help Desk
- Contact information display
- WhatsApp integration
- Facebook integration
- Email contact
- Available hours
- FAQ section
- Feedback submission form

## 🎨 UI/UX Features

### Design System
- **Colors**: Blue primary (#2261dd), clean grays
- **Typography**: Segoe UI, Arial fallback
- **Icons**: Lucide React icon library
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions and hover effects

### Components
- **Navbar**: Search, navigation, contact buttons
- **Footer**: Links, contact info, social media
- **Cards**: Listing cards with hover effects
- **Forms**: Validation, error handling
- **Modals**: Image galleries, forms
- **Loading States**: Skeleton loaders, spinners

## 🚀 Deployment

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=househunt
DB_PORT=3306

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=4000
NODE_ENV=production

# CORS
CORS_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
```

### Production Build
```bash
# Backend
cd backend
npm run build
npm start

# Client
cd client
npm run build
# Deploy dist/ folder to your hosting service
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### API Testing
- Use Postman or similar tool
- Test all endpoints with proper authentication
- Verify error handling and validation

## 📊 Performance

### Database Optimization
- **Indexes**: Optimized for common queries
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Efficient SQL queries
- **Caching**: React Query for frontend caching

### Frontend Optimization
- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Proper image sizing and formats
- **Lazy Loading**: Images and components
- **Caching**: React Query for API responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Use TypeScript for backend
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📞 Support

- **Email**: help@househunt.com
- **WhatsApp**: +254712345678
- **Facebook**: https://facebook.com/househunt
- **Hours**: Mon-Fri 8am-6pm

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for students finding their perfect home!**

