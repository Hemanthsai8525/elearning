# 🎓 LearnHub - Complete E-Learning Platform

A full-stack e-learning platform built with **Spring Boot** and **React**, featuring course management, video lessons, progress tracking, and certificate generation.

![Platform Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%204.0-green)
![Frontend](https://img.shields.io/badge/Frontend-React%2018-blue)
![Database](https://img.shields.io/badge/Database-MySQL-orange)

---

## ✨ Features

### 🎯 Core Features
- ✅ **User Authentication** - JWT-based secure authentication
- ✅ **Role-Based Access** - Student, Teacher, and Admin roles
- ✅ **Course Management** - Create, browse, and enroll in courses
- ✅ **Video Lessons** - Watch video content with progress tracking
- ✅ **Progress Tracking** - Track completion percentage
- ✅ **Certificates** - Automatic certificate generation on course completion
- ✅ **Email Verification** - Verify email addresses
- ✅ **Password Reset** - Forgot password functionality
- ✅ **Profile Management** - Edit profile and change password

### 👨‍🎓 Student Features
- Browse courses with search and filters
- Preview courses before enrolling
- Enroll in free and paid courses
- Watch video lessons
- Track learning progress
- Mark lessons as complete
- Earn certificates upon completion
- View and share certificates

### 👨‍🏫 Teacher Features
- Create new courses
- Add lessons to courses
- Set course pricing
- Manage course content

### 🔐 Security Features
- JWT token authentication
- Password encryption (BCrypt)
- Role-based authorization
- CORS configuration
- Secure API endpoints

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 4.0.1
- **Language:** Java 17
- **Database:** MySQL
- **Security:** Spring Security + JWT
- **ORM:** Hibernate/JPA
- **Build Tool:** Maven

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Styling:** CSS3 with CSS Variables

---

## 📁 Project Structure

```
elearning/
├── elearning/                    # Backend (Spring Boot)
│   ├── src/main/java/com/example/elearning/
│   │   ├── config/              # Security, CORS, JWT config
│   │   ├── controller/          # REST Controllers
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── model/               # JPA Entities
│   │   ├── repository/          # JPA Repositories
│   │   ├── service/             # Business Logic
│   │   └── security/            # JWT Filter
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/                     # Frontend (React)
    ├── src/
    │   ├── components/          # Reusable components
    │   ├── context/             # React Context (Auth)
    │   ├── pages/               # Page components
    │   ├── services/            # API services
    │   └── App.jsx              # Main app component
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16+ and npm
- MySQL 8.0+
- Maven (included via wrapper)

### Backend Setup

1. **Clone the repository**
   ```bash
   cd elearning/elearning
   ```

2. **Configure MySQL Database**
   
   Create a database:
   ```sql
   CREATE DATABASE elearning_db;
   ```

   Update `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/elearning_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Run Database Migrations**
   ```sql
   -- Add new columns for email verification and password reset
   ALTER TABLE users ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE;
   ALTER TABLE users ADD COLUMN email_verification_token VARCHAR(255);
   ALTER TABLE users ADD COLUMN email_verification_token_expiry DATETIME;
   ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(255);
   ALTER TABLE users ADD COLUMN password_reset_token_expiry DATETIME;

   -- Create certificates table
   CREATE TABLE certificates (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       student_id BIGINT NOT NULL,
       course_id BIGINT NOT NULL,
       certificate_code VARCHAR(100) UNIQUE NOT NULL,
       issued_at DATETIME NOT NULL,
       completion_percentage INT NOT NULL,
       UNIQUE KEY unique_student_course (student_id, course_id),
       FOREIGN KEY (student_id) REFERENCES users(id),
       FOREIGN KEY (course_id) REFERENCES courses(id)
   );
   ```

4. **Run the Backend**
   ```bash
   # Windows
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
   .\mvnw.cmd spring-boot:run

   # Linux/Mac
   ./mvnw spring-boot:run
   ```

   Backend will run on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the Frontend**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password | No |
| GET | `/api/auth/verify-email/{token}` | Verify email | No |

### Course Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses` | Get all courses | Yes |
| GET | `/api/courses/{id}/preview` | Preview course | No |
| GET | `/api/courses/{id}/lessons` | Get course lessons | Yes (Enrolled) |
| POST | `/api/courses` | Create course | Yes (Teacher) |
| POST | `/api/courses/{id}/lessons` | Add lesson | Yes (Teacher) |

### Student Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/enrollments` | Enroll in course | Yes (Student) |
| GET | `/api/enrollments/my` | Get my enrollments | Yes (Student) |
| POST | `/api/progress/{courseId}/lessons/{lessonId}/complete` | Mark lesson complete | Yes (Student) |
| GET | `/api/progress/{courseId}` | Get course progress | Yes (Student) |

### Certificate Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/certificates/generate/{courseId}` | Generate certificate | Yes (Student) |
| GET | `/api/certificates/my` | Get my certificates | Yes (Student) |
| GET | `/api/certificates/verify/{code}` | Verify certificate | No |

### User Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get profile | Yes |
| PUT | `/api/users/profile` | Update profile | Yes |
| PUT | `/api/users/change-password` | Change password | Yes |

---

## 🎨 Design System

### Color Palette
- **Primary:** `#6366f1` (Indigo)
- **Secondary:** `#10b981` (Green)
- **Accent:** `#f59e0b` (Amber)
- **Danger:** `#ef4444` (Red)

### Typography
- **Font Family:** Inter, system fonts
- **Headings:** 700 weight
- **Body:** 400 weight

### Components
- Buttons (Primary, Secondary, Outline)
- Cards with shadows
- Input fields with focus states
- Progress bars
- Loading spinners

---

## 🔒 Security Configuration

### JWT Configuration
- Token expiration: 24 hours
- Secret key: Configured in `application.properties`
- Token format: `Bearer {token}`

### CORS
- Allowed origins: `http://localhost:5173`, `http://localhost:3000`
- Allowed methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Credentials: Enabled

### Password Security
- Encryption: BCrypt
- Minimum length: 6 characters
- Password reset token expiry: 1 hour
- Email verification token expiry: 24 hours

---

## 📱 Responsive Design

The platform is fully responsive with breakpoints:
- **Desktop:** 1280px+
- **Tablet:** 768px - 1024px
- **Mobile:** < 768px

---

## 🧪 Testing

### Manual Testing Workflow

1. **Register a new user**
   - Navigate to `/register`
   - Fill in details and submit

2. **Login**
   - Navigate to `/login`
   - Enter credentials

3. **Browse courses**
   - View courses on home page
   - Use search and filters

4. **Enroll in a course**
   - Click on a course
   - Click "Enroll Now"

5. **Watch lessons**
   - Go to "My Learning"
   - Click on enrolled course
   - Watch video lessons

6. **Track progress**
   - Mark lessons as complete
   - View progress percentage

7. **Earn certificate**
   - Complete all lessons (100%)
   - Generate certificate
   - View in "Certificates" page

---

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file:
   ```bash
   ./mvnw clean package
   ```

2. Run the JAR:
   ```bash
   java -jar target/elearning-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment
1. Build for production:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service

### Environment Variables
```properties
# Backend
SPRING_DATASOURCE_URL=your_database_url
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret

# Frontend
VITE_API_URL=your_backend_url
```

---

## 📊 Database Schema

### Main Tables
- `users` - User accounts
- `courses` - Course information
- `lessons` - Video lessons
- `enrollments` - Student enrollments
- `lesson_progress` - Lesson completion tracking
- `certificates` - Generated certificates

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Your Name** - Initial work

---

## 🙏 Acknowledgments

- Inspired by Udemy, Coursera, and SkillHub
- Built with Spring Boot and React
- Icons by Lucide React

---

## 📞 Support

For support, email support@learnhub.com or open an issue in the repository.

---

**Made with ❤️ using Spring Boot and React**
