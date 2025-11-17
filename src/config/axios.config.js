import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json, text/plain, */*",
  },
});

export default axiosInstance;
