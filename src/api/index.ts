import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: `https://k993f4953a916a.user-app.krampoline.com/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
