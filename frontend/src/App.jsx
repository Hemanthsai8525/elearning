import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SetPassword from './pages/SetPassword';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CourseLearning from './pages/CourseLearning';
import MyLearning from './pages/MyLearning';
import Profile from './pages/Profile';
import Certificates from './pages/Certificates';
import TeacherDashboard from './pages/TeacherDashboard';
import ManageCourse from './pages/ManageCourse';
import AdminUsers from './pages/AdminUsers';
import AdminBlockedUsers from './pages/AdminBlockedUsers';
import AdminCourses from './pages/AdminCourses';
import AdminAnalytics from './pages/AdminAnalytics';
import BecomeTeacher from './pages/BecomeTeacher';
import PaymentCheckout from './pages/PaymentCheckout';
import PaymentSuccess from './pages/PaymentSuccess';
import Footer from './components/Footer';

const AppContent = () => {
  const location = useLocation();
  const isTeacherDashboard = location.pathname.startsWith('/teach');

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      {/* Premium Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {!isTeacherDashboard && <Navbar />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/set-password"
              element={
                <ProtectedRoute>
                  <SetPassword />
                </ProtectedRoute>
              }
            />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/become-teacher" element={<BecomeTeacher />} />
            <Route
              path="/course/:courseId/learn"
              element={
                <ProtectedRoute>
                  <CourseLearning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-learning"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <MyLearning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <Certificates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout/:courseId"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <PaymentCheckout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/success/:courseId"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teach"
              element={
                <ProtectedRoute requiredRole="TEACHER">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teach/course/:courseId"
              element={
                <ProtectedRoute requiredRole="TEACHER">
                  <ManageCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blocked-users"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminBlockedUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        {!isTeacherDashboard && <Footer />}
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="elearning-theme">
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
