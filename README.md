# Tech Solutions - Employee Management System

A comprehensive Employee Management System built with the MERN stack for "Tech Solutions", a growing startup based in Mumbai, India.

## 🏢 About the Project

Tech Solutions is a software development company that creates custom solutions across domains like education, finance, technology, and design. As the organization scales, this EMS provides a centralized system to manage employees' records, performance, payroll, and internal communication.

## 🚀 Features

### Authentication & Authorization

- **JWT-based Authentication** with bcrypt password hashing
- **Role-based Access Control**:
  - **System Admin**: Full system access and user management
  - **HR Manager**: Employee data, performance metrics, payroll management
  - **Department Heads**: Team management, task assignments, performance updates
  - **Employees**: Personal data access, leave requests, payslip viewing

### Core Modules

#### 1. Employee Information Management

- Personal details (Name, Contact, Address)
- Job information (Department, Role, Manager, Status)
- Salary information with detailed breakdown
- Employee search and filtering

#### 2. Performance Tracking

- Project task management
- Multi-criteria rating system (Technical, Communication, Teamwork, Leadership, Innovation)
- Performance reviews by department heads
- Historical performance tracking

#### 3. Payroll Management

- Automated salary calculations
- Allowances and deductions management
- Bonus and overtime tracking
- Payslip generation and history
- Payroll processing workflow

#### 4. Leave Management

- Multiple leave types (Annual, Sick, Personal, Emergency, Maternity, Paternity)
- Leave application workflow
- Manager approval system
- Leave balance tracking

#### 5. Department Management

- Department structure and hierarchy
- Budget allocation
- Head assignment
- Employee distribution analytics

#### 6. Dashboard & Analytics

- Role-specific dashboards
- Real-time statistics
- Performance metrics
- Quick action panels

## 🛠️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router DOM** for navigation
- **Axios** for API communication
- **Lucide React** for icons
- **React Hook Form** for form handling

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Development Tools

- **Vite** for fast development and building
- **ESLint** for code linting
- **TypeScript** for type safety

## 📁 Project Structure

```
EMS/
├── .gitignore                  # Git ignore file
├── package.json                # Root package.json (for monorepo management)
├── package-lock.json           # Root lock file
└── README.md                   # Project documentation

#=======================[ Backend ]=======================#
├── backend/
│   ├── .env                    # Environment variables
│   ├── index.js                # Server entry point
│   ├── package.json            # Backend dependencies
│   ├── package-lock.json       # Backend lock file
│   │
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── authController.js           # Authentication logic
│   │   ├── departmentController.js     # Department management
│   │   ├── employeeController.js       # Employee CRUD operations
│   │   ├── jobApplicationController.js # Job application logic
│   │   ├── jobPostingController.js     # Job posting logic
│   │   ├── leaveController.js          # Leave management
│   │   ├── performanceController.js    # Performance tracking
│   │   ├── roleController.js           # Role management
│   │   └── salaryController.js         # Payroll processing
│   │
│   ├── middleware/
│   │   └── auth.js             # JWT verification & role authorization
│   │
│   ├── models/
│   │   ├── Department.js       # Department management model
│   │   ├── Employee.js         # Employee information model
│   │   ├── JobApplication.js   # Job applications model
│   │   ├── JobPosting.js       # Job postings model
│   │   ├── Leave.js            # Leave management model
│   │   ├── Performance.js      # Performance tracking model
│   │   ├── Role.js             # Job roles model
│   │   ├── Salary.js           # Payroll model
│   │   └── User.js             # User authentication model
│   │
│   └── routes/
│       ├── authRoutes.js           # Authentication routes
│       ├── departmentRoutes.js     # Department routes
│       ├── employeeRoutes.js       # Employee routes
│       ├── jobApplicationRoutes.js # Job application routes
│       ├── jobPostingRoutes.js     # Job posting routes
│       ├── leaveRoutes.js          # Leave routes
│       ├── performanceRoutes.js    # Performance routes
│       ├── roleRoutes.js           # Role routes
│       └── salaryRoutes.js         # Payroll routes
│
#=======================[ Frontend ]=======================#
└── frontend/
    ├── package.json            # Frontend dependencies
    ├── package-lock.json       # Frontend lock file
    ├── vite.config.js          # Vite configuration
    ├── index.html              # Main HTML entry
    │
    ├── public/
    │   └── _redirects          # Redirects for deployment (e.g., Netlify)
    │
    └── src/
        ├── App.jsx             # Main app component
        ├── main.jsx            # App entry point
        ├── index.css           # Global styles
        ├── api.js              # Central API call management
        │
        ├── components/         # Reusable UI components
        │   ├── Dashboard.jsx   # Role-based dashboard
        │   ├── Departments.jsx # Department management UI
        │   ├── Employees.jsx   # Employee management UI
        │   ├── Jobs.jsx        # Job postings & applications UI
        │   ├── Layout.jsx      # Main layout wrapper
        │   ├── Leave.jsx       # Leave management UI
        │   ├── Login.jsx       # Login component
        │   ├── Payroll.jsx     # Payroll management UI
        │   ├── Performance.jsx # Performance tracking UI
        │   └── Register.jsx    # Registration component
        │
        └── contexts/
            └── AuthContext.jsx # Authentication context
```            

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/tech-solutions-ems.git
   cd tech-solutions-ems
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**

   ```bash
   # Create .env file in backend directory
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration:

   ```env
   MONGODB_URI=mongodb://localhost:27017/ems_db
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
   PORT
   ```
