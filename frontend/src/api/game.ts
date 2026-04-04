import axios from 'axios';

const API = 'http://localhost:8000/game';

export const createRoom = (creatorId: number) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API}/create`, { creatorId }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getRooms = () => {
  return axios.get(`${API}/rooms`);
};

export const joinRoom = (userId: number, roomId: number) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API}/join`, { userId, roomId }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};