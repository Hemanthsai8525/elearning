import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
};
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  forceChangePassword: (newPassword) => api.put('/users/force-change-password', { newPassword }),
  resendVerification: () => api.get('/users/resend-verification'),
};
export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCoursePreview: (id) => api.get(`/courses/${id}/preview`),
  getCourseLessons: (id) => api.get(`/courses/${id}/lessons`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  importCourse: (formData) => {
    // Remove Content-Type header to let browser set it with boundary
    return api.post('/courses/import', formData, {
      headers: {
        'Content-Type': undefined
      }
    });
  },
};
export const lessonAPI = {
  createLesson: (courseId, data) => api.post(`/courses/${courseId}/lessons`, data),
  deleteLesson: (courseId, lessonId) => api.delete(`/courses/${courseId}/lessons/${lessonId}`)
};
export const enrollmentAPI = {
  enroll: (courseId) => api.post(`/enrollments/${courseId}`),
  getMyEnrollments: () => api.get('/enrollments/me'),
  getCourseEnrollees: (courseId) => api.get(`/enrollments/course/${courseId}/students`),
  checkEnrollment: (courseId) => api.get(`/enrollments/${courseId}/check`),
};
export const progressAPI = {
  markComplete: (courseId, lessonId) =>
    api.post(`/progress/courses/${courseId}/lessons/${lessonId}/complete`),
  getProgress: (courseId) => api.get(`/progress/courses/${courseId}`),
};
export const certificateAPI = {
  generate: (courseId) => api.post(`/certificates/generate/${courseId}`),
  getMyCertificates: () => api.get('/certificates/my'),
  verify: (code) => api.get(`/certificates/verify/${code}`),
};
export const taskAPI = {
  createTask: (courseId, data) => api.post(`/courses/${courseId}/tasks`, data),
  getTasks: (courseId) => api.get(`/courses/${courseId}/tasks`),
  markComplete: (taskId) => api.post(`/tasks/${taskId}/complete`),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`)
};

export const mcqAPI = {
  submitMcq: (data) => api.post('/mcq/submit', data),
  getSubmission: (taskId) => api.get(`/mcq/${taskId}/submission`),
};

export const theoryAPI = {
  submitTheory: (taskId, formData) => {
    return api.post(`/theory/${taskId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getSubmission: (taskId) => api.get(`/theory/${taskId}/submission`),
  getAllSubmissions: (taskId) => api.get(`/theory/task/${taskId}/submissions`),
  reviewSubmission: (submissionId, data) => api.put(`/theory/submission/${submissionId}/review`, data),
  downloadSubmission: (submissionId) => api.get(`/theory/submission/${submissionId}/download`, {
    responseType: 'blob'
  }),
};

export const paymentAPI = {
  pay: (courseId) => api.post(`/payments/pay/${courseId}`),
};
export const adminAPI = {
  createTeacher: (data) => api.post('/admin/create-teacher', data),
  getAllUsers: () => api.get('/admin/users'),
  getAnalytics: () => api.get('/admin/analytics'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  toggleBlock: (id) => api.put(`/admin/users/${id}/block`),
};
export const notificationAPI = {
  getMyNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};
export default api;
