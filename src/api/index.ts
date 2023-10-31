import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: `http://3.35.234.197:8080/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
