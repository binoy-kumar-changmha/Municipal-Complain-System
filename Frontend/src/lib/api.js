import axios from "axios";

// Points at the Backend server (see Backend/server.js / README.md for routes).
// Override with a .env file: VITE_API_URL=http://localhost:5000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
