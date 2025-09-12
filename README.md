# 🌟 Star AI Lab - Full Stack Portfolio Platform

A modern, full-stack portfolio platform featuring AI integration, real-time visitor analytics, and comprehensive project showcasing capabilities.

## 🏗️ Project Structure

```
star-ai-lab/
├── frontend/              # React + TypeScript frontend
│   ├── src/              # Source code
│   ├── dist/             # Build output
│   ├── package.json      # Frontend dependencies
│   └── ...              # Frontend config files
├── backend/              # Node.js + Express backend
│   ├── routes/           # API routes
│   ├── models/           # MongoDB models
│   ├── services/         # Business logic
│   ├── server.js         # Main server file
│   ├── package.json      # Backend dependencies
│   └── .env              # Environment variables
├── docs/                 # Documentation files
├── package.json          # Root workspace configuration
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB Atlas account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd star-ai-lab
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment example
   cp backend/.env.example backend/.env
   
   # Edit backend/.env with your configuration
   # - MongoDB connection string
   # - JWT secret
   # - Email credentials (optional)
   # - Google Sheets API (optional)
   ```

### Development

**Start both frontend and backend in development mode:**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:5173`

**Start services individually:**
```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

## 📁 Frontend (`/frontend`)

### Features
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Context API** for state management
- **Real-time visitor tracking**
- **Admin dashboard**
- **Responsive design**

### Key Components
- `VisitorTracking.tsx` - Visitor registration popup
- `AdminDashboard.tsx` - Admin panel with analytics
- `VisitorAnalyticsDashboard.tsx` - Real-time visitor insights
- `Projects.tsx` - Dynamic project showcase

### Development Commands
```bash
cd frontend

npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🛠️ Backend (`/backend`)

### Features
- **Express.js** server with TypeScript support
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Rate limiting** and security middleware
- **File upload** handling
- **Email integration** (Nodemailer)
- **Google Sheets API** integration (optional)
- **Real-time visitor analytics**

### API Endpoints

#### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration

#### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project (auth required)
- `PUT /api/projects/:id` - Update project (auth required)
- `DELETE /api/projects/:id` - Delete project (auth required)

#### Visitor Tracking
- `POST /api/visitors/track` - Track visitor data
- `GET /api/visitors/analytics` - Get visitor analytics
- `GET /api/visitors/stats` - Get visitor statistics
- `GET /api/visitors/health` - Health check

#### Contact
- `POST /api/contact` - Send contact email

### Development Commands
```bash
cd backend

npm start            # Start production server
npm run dev          # Start with nodemon (auto-reload)
npm run seed         # Seed database with sample data
```

## 🔧 Configuration

### Environment Variables (`backend/.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
ENABLE_MONGODB=true

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# CORS
FRONTEND_URL=http://localhost:5173

# Email (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google Sheets API (Optional)
GOOGLE_SHEETS_ENABLED=false
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEET_NAME=Visitor_Tracking
```

## 🎨 Key Features

### Real-time Visitor Analytics
- **Automatic visitor detection** with session management
- **Device and browser tracking** 
- **Privacy-compliant** data collection
- **Admin dashboard** with real-time insights
- **MongoDB + Google Sheets** backup storage

### Dynamic Project Showcase
- **Admin-managed** project portfolio
- **Image upload** and management
- **Technology stack** tagging
- **Live demo** links and GitHub integration

### Modern Tech Stack
- **React 18** with TypeScript
- **Express.js** with MongoDB
- **Tailwind CSS** for responsive design
- **JWT** authentication
- **Real-time** data updates

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Desktop** browsers
- **Tablet** devices
- **Mobile** phones

## 🧪 Testing & Development

### Available Scripts

```bash
# Root level
npm run dev                 # Start both frontend and backend
npm run build              # Build frontend for production
npm run install:all        # Install all dependencies
npm run clean             # Clean all node_modules

# Frontend specific
npm run dev:frontend      # Start frontend dev server
npm run build:frontend    # Build frontend
npm run lint:frontend     # Lint frontend code

# Backend specific
npm run dev:backend       # Start backend with auto-reload
npm run start:backend     # Start backend production
```

## 🔒 Security Features

- **Helmet.js** for security headers
- **Rate limiting** on API endpoints
- **Input validation** with express-validator
- **CORS** configuration
- **JWT** authentication for admin features
- **Environment variable** protection

## 📊 Analytics & Monitoring

- **Real-time visitor tracking**
- **Device and browser analytics**
- **Admin dashboard** with insights
- **Error logging** and monitoring
- **Performance metrics**

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend
# Set environment variables in hosting platform
# Deploy with Node.js runtime
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email [support@starailab.com](mailto:support@starailab.com) or create an issue in this repository.

## 🙏 Acknowledgments

- **React** team for the amazing framework
- **Express.js** for the robust backend framework
- **MongoDB** for the flexible database
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the fast build tool
