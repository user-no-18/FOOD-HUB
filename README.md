# FoodHub - Food Delivery Platform

A comprehensive full-stack food delivery application built with modern web technologies. FoodHub connects users with local restaurants, enabling seamless food ordering, real-time tracking, and efficient delivery management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v16%2B-green)
![React](https://img.shields.io/badge/React-18-blue)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### For Users
- **Browse & Search**: Discover restaurants and food items by location and category
- **Smart Filtering**: Filter food items by category and vegetarian/non-vegetarian preferences
- **Shopping Cart**: Add items to cart with quantity management
- **Flexible Payment**: Support for both Cash on Delivery (COD) and online payments (UPI/Card)
- **Order Tracking**: Real-time order status and delivery boy location tracking
- **Location Services**: Automatic location detection and address management using Geoapify API
- **Order History**: View all past orders with order details

### For Restaurant Owners
- **Shop Management**: Create and manage restaurant profile with images
- **Menu Management**: Add, edit, and delete food items with categories and pricing
- **Order Management**: View incoming orders and update status (Preparing, Out for Delivery, Delivered)
- **Delivery Assignment**: Automatically assign delivery boys based on proximity
- **Analytics**: Track orders and monitor business performance

### For Delivery Partners
- **Order Assignments**: Receive real-time order assignments within service radius
- **Acceptance System**: Accept or reject delivery assignments
- **Live Tracking**: View delivery boy location and customer address on interactive map
- **OTP Verification**: Secure delivery confirmation with OTP verification
- **Navigation**: Built-in mapping for navigation between pickup and delivery locations

### General Features
- **Authentication**: Secure email/password signup and login with JWT tokens
- **Google OAuth**: Social login integration with Firebase
- **Password Recovery**: OTP-based password reset functionality
- **Responsive Design**: Mobile-first UI optimized for all devices
- **Real-time Updates**: Location tracking and status updates in real-time
- **Geolocation**: GPS-based location services with geocoding

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Maps**: React Leaflet with OpenStreetMap
- **HTTP Client**: Axios
- **Authentication**: Firebase Auth (Google OAuth)
- **Icons**: React Icons
- **Loading State**: React Spinners
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcryptjs
- **File Upload**: Multer, Cloudinary (image hosting)
- **Email Service**: Nodemailer
- **Location Services**: Geoapify API
- **Geolocation**: MongoDB 2dsphere indexes

### Tools & Services
- **Database**: MongoDB Atlas
- **Cloud Storage**: Cloudinary
- **Geolocation API**: Geoapify
- **Map Service**: OpenStreetMap (Leaflet)
- **Email Service**: Nodemailer
- **Version Control**: Git

---

## 🏗 Architecture

```
FoodHub/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── Pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── Hooks/         # Custom React hooks
│   │   ├── Redux/         # State management
│   │   └── assets/        # Images and static files
│   └── package.json
│
└── server/                # Express Backend
    ├── controllers/       # Route logic
    ├── models/           # MongoDB schemas
    ├── routes/           # API routes
    ├── middlewares/      # Express middlewares
    ├── utils/            # Helper functions
    ├── config/           # Configuration files
    └── package.json
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local or MongoDB Atlas account)
- **Git**
- **Cloudinary Account** (for image uploads)
- **Geoapify API Key** (for location services)
- **Firebase Project** (for Google OAuth)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/foodhub.git
cd foodhub
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## ⚙️ Configuration

### Backend Configuration (.env file)

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodhub

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration (.env file)

Create a `.env` file in the `client` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Geoapify API Key
VITE_GEOAPIFY_API_KEY=your_geoapify_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🗄️ Database Setup

### MongoDB Collections Schema

1. **Users Collection**
   - Full name, email, password (hashed)
   - Mobile number
   - Role (user/owner/deliveryBoy)
   - Location (GeoJSON for proximity search)
   - OTP credentials for password reset

2. **Shops Collection**
   - Shop name and image
   - Owner reference
   - City, state, address
   - Items array (references to Item collection)

3. **Items Collection**
   - Food item details (name, price, category)
   - Image URL
   - Food type (veg/non-veg)
   - Shop reference
   - Ratings and reviews

4. **Orders Collection**
   - User reference
   - Delivery address with coordinates
   - Payment method
   - Shop orders array with items and status
   - Delivery boy assignment
   - Order timestamps

5. **DeliveryAssignments Collection**
   - Order and shop references
   - List of delivery boys (broadcasted to)
   - Assigned delivery boy
   - Status tracking
   - Acceptance timestamps

---

## ▶️ Running the Application

### Development Mode

#### Terminal 1 - Start Backend Server

```bash
cd server
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

#### Terminal 2 - Start Frontend Development Server

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Build

#### Backend
```bash
cd server
npm run build
npm start
```

#### Frontend
```bash
cd client
npm run build
# Serve the dist folder with a production server
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/signin` | User login |
| POST | `/signout` | User logout |
| POST | `/send-otp` | Send OTP for password reset |
| POST | `/verify-otp` | Verify OTP |
| POST | `/reset-password` | Reset password |
| POST | `/google-auth` | Google OAuth authentication |

### User Routes (`/api/user`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/current` | Get current user data |
| POST | `/update-location` | Update user location |

### Shop Routes (`/api/shop`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-edit` | Create or edit shop |
| GET | `/my-shop` | Get owner's shop |
| GET | `/get-shop-by-city/:city` | Get shops by city |

### Item Routes (`/api/item`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/add-item` | Add new food item |
| POST | `/edit-item/:itemId` | Edit existing item |
| GET | `/get-item/:itemId` | Get item details |
| DELETE | `/delete-item/:itemId` | Delete item |
| GET | `/get-by-city/:city` | Get items by city |
| GET | `/get-by-shop/:shopId` | Get shop items |

### Order Routes (`/api/order`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/place-order` | Place new order |
| GET | `/get-orders` | Get user/owner orders |
| GET | `/get-order-by-id/:orderId` | Get order details |
| PATCH | `/update-status/:orderId/:shopId` | Update order status |
| GET | `/get-assignments` | Get delivery assignments |
| GET | `/accept-order/:assignmentId` | Accept delivery order |
| GET | `/get-current-order` | Get current delivery order |
| POST | `/send-otp` | Send delivery OTP |
| POST | `/verify-otp` | Verify delivery OTP |

---

## 📁 Project Structure

### Frontend Structure

```
client/src/
├── Pages/
│   ├── Home.jsx              # Main dashboard
│   ├── SignIn.jsx            # Login page
│   ├── SignUp.jsx            # Registration page
│   ├── ForgotPassword.jsx    # Password recovery
│   ├── CartPage.jsx          # Shopping cart
│   ├── Checkout.jsx          # Order checkout
│   ├── OrderPage.jsx         # Order confirmation
│   ├── TrackOrderPage.jsx    # Order tracking
│   ├── MyOrder.jsx           # Order history
│   ├── Shop.jsx              # Shop details
│   ├── AddItem.jsx           # Add food item
│   └── CreateEditShop.jsx    # Shop management
│
├── components/
│   ├── CommonNav.jsx         # Navigation bar
│   ├── UserDashboard.jsx     # User home
│   ├── OwnerDashboard.jsx    # Owner home
│   ├── DeliveryBoyDashboard.jsx  # Delivery home
│   ├── FoodCard.jsx          # Food item card
│   ├── CartItem.jsx          # Cart item
│   ├── UserOrderCard.jsx     # User order card
│   ├── OwnerOrderCard.jsx    # Owner order card
│   ├── DeliveryBoyTracking.jsx   # Map tracking
│   └── ...
│
├── Hooks/
│   ├── UseGetCurrentUser.jsx
│   ├── useGetCity.jsx
│   ├── useGetMyShop.jsx
│   ├── useGetShopByCity.jsx
│   ├── UseGetItemsByCity.jsx
│   ├── useGetMyOrders.jsx
│   └── useUpdateLocation.jsx
│
├── Redux/
│   ├── store.js              # Redux store
│   ├── user.slice.js         # User state
│   ├── owner.slice.js        # Owner state
│   └── map.slice.js          # Map state
│
└── assets/                   # Images & static files
```

### Backend Structure

```
server/
├── controllers/
│   ├── authController.js     # Auth logic
│   ├── userController.js     # User logic
│   ├── shopController.js     # Shop logic
│   ├── itemController.js     # Item logic
│   └── orderController.js    # Order logic
│
├── models/
│   ├── userModel.js
│   ├── shopModel.js
│   ├── itemModel.js
│   ├── orderModel.js
│   └── deliveryAssignmentModel.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoute.js
│   ├── shopRoutes.js
│   ├── itemRoutes.js
│   └── orderRouter.js
│
├── middlewares/
│   ├── isAuth.js             # JWT verification
│   └── multer.js             # File upload
│
├── utils/
│   ├── token.js              # JWT generation
│   ├── cloudinary.js         # Image upload
│   ├── mail.js               # Email service
│   └── ...
│
├── config/
│   └── db.js                 # Database connection
│
└── index.js                  # Express app entry
```

---

## 📖 Usage Guide

### User Registration & Login

1. Visit the application and click "Sign Up"
2. Enter details: Full Name, Email, Mobile (10 digits), Password
3. Select role: User, Restaurant Owner, or Delivery Partner
4. Alternatively, use "Sign in with Google" for quick registration
5. On first login, location will be automatically detected via GPS

### For Users

1. **Browse Food**: View restaurants and items by location
2. **Filter Items**: Use categories to filter food items
3. **Add to Cart**: Adjust quantity and add items to cart
4. **Checkout**: Select delivery address and payment method
5. **Track Order**: Monitor order status and delivery boy location in real-time
6. **View History**: Check past orders in "My Orders"

### For Restaurant Owners

1. **Create Shop**: Add restaurant name, location, and image
2. **Manage Menu**: Add food items with category, price, and image
3. **Process Orders**: View incoming orders and update status
4. **Assign Delivery**: System automatically assigns nearby delivery partners
5. **Track Delivery**: Monitor delivery status in real-time

### For Delivery Partners

1. **Receive Orders**: Get notified of orders in your service area
2. **Accept Order**: Review order details and accept assignment
3. **Navigate**: Use built-in map to navigate to pickup location
4. **Confirm Delivery**: Deliver order and verify with OTP
5. **Track Performance**: View completed deliveries and ratings

---

## 🔐 Security Features

- **Password Hashing**: Bcryptjs with salt rounds for secure storage
- **JWT Authentication**: Secure token-based authentication
- **OTP Verification**: Email-based OTP for password reset and delivery confirmation
- **Protected Routes**: Middleware-based route protection
- **Secure Cookies**: HTTP-only, Secure, SameSite cookie flags
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Restricted cross-origin requests

---

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full feature set with enhanced UI
- **Tablet**: Adaptive layout for medium screens
- **Mobile**: Touch-friendly interface with optimized components

---

## 🐛 Troubleshooting

### Backend Issues

**Port 5000 already in use**
```bash
# Change PORT in .env or kill existing process
lsof -i :5000
kill -9 <PID>
```

**MongoDB Connection Error**
- Verify MongoDB Atlas credentials
- Check IP whitelist in MongoDB Atlas
- Ensure network connection is stable

**Image Upload Failing**
- Verify Cloudinary credentials
- Check file size limits
- Ensure image folder has write permissions

### Frontend Issues

**Blank Page or 404**
- Clear browser cache and restart dev server
- Check if backend is running on port 5000
- Verify CORS configuration

**Location Services Not Working**
- Enable location permissions in browser
- Check Geoapify API key is valid
- Ensure HTTPS for production (required for geolocation)

**Google OAuth Not Working**
- Verify Firebase configuration
- Check redirect URI in Firebase console
- Ensure credentials match .env file

---

## 🚦 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Push notifications for order updates
- [ ] Advanced analytics and reporting
- [ ] Coupon and promotional code system
- [ ] Multi-language support
- [ ] User ratings and reviews system
- [ ] Order cancellation and refunds
- [ ] Admin dashboard for platform management
- [ ] SMS notifications
- [ ] AI-based recommendation engine

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---



- **Developer**:Debjyoti Roy


---

## 📞 Support

For support, email [debjyoti2409@gmail.com](mailto:debjyoti2409@gmail.com) or open an issue in the GitHub repository.

---

## 🙏 Acknowledgments

- React and Redux communities
- Express.js documentation
- MongoDB documentation
- Tailwind CSS for styling
- Leaflet for mapping
- All contributors and testers

---

