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
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── User.js                  # User authentication model
│   │   ├── Employee.js              # Employee information model
│   │   ├── Department.js            # Department management model
│   │   ├── Role.js                  # Job roles model
│   │   ├── Salary.js                # Payroll model
│   │   ├── Performance.js           # Performance tracking model
│   │   ├── Leave.js                 # Leave management model
│   │   ├── JobPosting.js            # Job postings model
│   │   └── JobApplication.js        # Job applications model
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── employeeController.js    # Employee CRUD operations
│   │   ├── departmentController.js  # Department management
│   │   ├── roleController.js        # Role management
│   │   ├── performanceController.js # Performance tracking
│   │   ├── leaveController.js       # Leave management
│   │   └── salaryController.js      # Payroll processing
│   ├── routes/
│   │   ├── authRoutes.js            # Authentication routes
│   │   ├── employeeRoutes.js        # Employee routes
│   │   ├── departmentRoutes.js      # Department routes
│   │   ├── roleRoutes.js            # Role routes
│   │   ├── performanceRoutes.js     # Performance routes
│   │   ├── leaveRoutes.js           # Leave routes
│   │   └── salaryRoutes.js          # Payroll routes
│   ├── middleware/
│   │   └── auth.js                  # JWT verification & role authorization
│   ├── .env                         # Environment variables
│   ├── index.js                     # Server entry point
│   └── package.json
├── src/
│   ├── components/
│   │   │   ├── Login.tsx            # Login component
│   │   │   └── Register.tsx         # Registration component
│   │   │   └── Dashboard.tsx        # Role-based dashboard
│   │   │   └── Employees.tsx        # Employee management
│   │   │   └── Departments.tsx      # Department management
│   │   │   └── Performance.tsx      # Performance tracking
│   │   │   └── Leave.tsx            # Leave management
│   │   │   └── Payroll.tsx          # Payroll management
│   │       └── Layout.tsx           # Main layout wrapper
│   ├── contexts/
│   │   └── AuthContext.tsx          # Authentication context
│   ├── App.tsx                      # Main app component
│   └── main.tsx                     # App entry point
│   └── index.html                   
├── package.json
└── README.md
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
