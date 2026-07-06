import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach auth headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle JWT expiration / unauthorized redirects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already on landing/login/register pages
      const path = window.location.pathname;
      if (path !== '/' && path !== '/login' && path !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (formData: FormData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  googleSignIn: async (googleToken: string, email: string) => {
    const response = await api.post('/auth/google', { token: googleToken, email });
    return response.data;
  }
};

export const resumeService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/resumes/history');
    return response.data;
  },
  getDetails: async (id: number) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  }
};

export const interviewService = {
  setup: async (data: { job_role: string; experience_level: string; interview_type: string; difficulty: string; num_questions: number }) => {
    const response = await api.post('/interviews/setup', data);
    return response.data;
  },
  submitAnswer: async (data: { question_id: number; typed_answer?: string; voice_answer_base64?: string; is_coding?: boolean; code_language?: string }) => {
    const response = await api.post('/interviews/submit-answer', data);
    return response.data;
  },
  getCompanies: async () => {
    const response = await api.get('/interviews/companies');
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/interviews/history');
    return response.data;
  },
  getDetails: async (id: number) => {
    const response = await api.get(`/interviews/${id}`);
    return response.data;
  }
};

export const analyticsService = {
  getDashboardStats: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },
  getLeaderboard: async () => {
    const response = await api.get('/analytics/leaderboard');
    return response.data;
  }
};

export const learningService = {
  getRoadmap: async () => {
    const response = await api.get('/learning/roadmap');
    return response.data;
  },
  regenerateRoadmap: async () => {
    const response = await api.post('/learning/roadmap/generate');
    return response.data;
  }
};

export const profileService = {
  get: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  update: async (data: any) => {
    const response = await api.put('/profile', data);
    return response.data;
  },
  getNotifications: async () => {
    const response = await api.get('/profile/notifications');
    return response.data;
  },
  readNotification: async (id: number) => {
    const response = await api.post(`/profile/notifications/${id}/read`);
    return response.data;
  },
  getCertificates: async () => {
    const response = await api.get('/profile/certificates');
    return response.data;
  }
};

export const adminService = {
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },
  deleteUser: async (id: number) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }
};

export default api;
