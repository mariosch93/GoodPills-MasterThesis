import axios from "axios";

// Χρήση Environment Variable. 
// Αν δεν βρει τίποτα (π.χ. κάποιο λάθος), πέφτει πίσω στο localhost για ασφάλεια.
const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7056";

const api = axios.create({
  // Προσοχή: Προσθέτουμε το /api/ στο τέλος του URL
  baseURL: `${BASE_URL}/api/`,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Προαιρετικά: καθαρίζουμε το token αν λήξει
      localStorage.removeItem("jwt_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;