import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem('access', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;