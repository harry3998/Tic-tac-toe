import axios from 'axios';

const API = 'http://localhost:8000/auth';

export const register = (email: string, password: string) => {
  return axios.post(`${API}/register`, { email, password });
};

export const login = (email: string, password: string) => {
  return axios.post(`${API}/login`, { email, password });
};