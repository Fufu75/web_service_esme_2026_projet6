import axios from 'axios';

const API_URL = 'http://localhost:5009/api';

// Cache simple pour les requêtes
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fonction pour générer une clé de cache
const getCacheKey = (url, params = {}) => {
  return `${url}?${JSON.stringify(params)}`;
};

// Fonction pour vérifier si le cache est valide
const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Création d'une instance axios avec une configuration de base
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout de 10 secondes
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  getProfile: async () => {
    const cacheKey = getCacheKey('/profile');
    const cached = cache.get(cacheKey);
    
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await axiosInstance.get('/profile');
      cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.put('/profile', userData);
      // Invalider le cache du profil
      cache.delete(getCacheKey('/profile'));
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  }
};

// Service des œuvres littéraires
export const literaryWorkService = {
  getAllWorks: async (filters = {}) => {
    const cacheKey = getCacheKey('/literary-works', filters);
    const cached = cache.get(cacheKey);
    
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await axiosInstance.get('/literary-works', { params: filters });
      cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  getWorkById: async (id) => {
    const cacheKey = getCacheKey(`/literary-works/${id}`);
    const cached = cache.get(cacheKey);
    
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await axiosInstance.get(`/literary-works/${id}`);
      cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  createWork: async (workData) => {
    try {
      const response = await axiosInstance.post('/literary-works', workData);
      // Invalider le cache des listes d'œuvres
      for (const key of cache.keys()) {
        if (key.includes('/literary-works?')) {
          cache.delete(key);
        }
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  updateWork: async (id, workData) => {
    try {
      const response = await axiosInstance.put(`/literary-works/${id}`, workData);
      // Invalider le cache pour cette œuvre et les listes
      cache.delete(getCacheKey(`/literary-works/${id}`));
      for (const key of cache.keys()) {
        if (key.includes('/literary-works?')) {
          cache.delete(key);
        }
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  deleteWork: async (id) => {
    try {
      const response = await axiosInstance.delete(`/literary-works/${id}`);
      // Invalider le cache pour cette œuvre et les listes
      cache.delete(getCacheKey(`/literary-works/${id}`));
      for (const key of cache.keys()) {
        if (key.includes('/literary-works?')) {
          cache.delete(key);
        }
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  likeWork: async (id) => {
    try {
      const response = await axiosInstance.post(`/literary-works/${id}/like`);
      // Invalider le cache pour cette œuvre et les listes
      cache.delete(getCacheKey(`/literary-works/${id}`));
      for (const key of cache.keys()) {
        if (key.includes('/literary-works?')) {
          cache.delete(key);
        }
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  unlikeWork: async (id) => {
    try {
      const response = await axiosInstance.post(`/literary-works/${id}/unlike`);
      // Invalider le cache pour cette œuvre et les listes
      cache.delete(getCacheKey(`/literary-works/${id}`));
      for (const key of cache.keys()) {
        if (key.includes('/literary-works?')) {
          cache.delete(key);
        }
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  addComment: async (id, commentData) => {
    try {
      const response = await axiosInstance.post(`/literary-works/${id}/comments`, commentData);
      // Invalider le cache pour cette œuvre
      cache.delete(getCacheKey(`/literary-works/${id}`));
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  // Nouvelle fonctionnalité : vérifier la limite de publication
  checkPublicationLimit: async () => {
    try {
      const response = await axiosInstance.get('/literary-works/publication-limit');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  }
};

// Service des ateliers d'écriture
export const workshopService = {
  getAllWorkshops: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/workshops', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  getWorkshopById: async (id) => {
    try {
      const response = await axiosInstance.get(`/workshops/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  createWorkshop: async (workshopData) => {
    try {
      const response = await axiosInstance.post('/workshops', workshopData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  updateWorkshop: async (id, workshopData) => {
    try {
      const response = await axiosInstance.put(`/workshops/${id}`, workshopData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  deleteWorkshop: async (id) => {
    try {
      const response = await axiosInstance.delete(`/workshops/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  joinWorkshop: async (id) => {
    try {
      const response = await axiosInstance.post(`/workshops/${id}/join`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  leaveWorkshop: async (id) => {
    try {
      const response = await axiosInstance.post(`/workshops/${id}/leave`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  }
};

// Service des groupes
export const groupService = {
  getAllGroups: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/groups', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  getGroupById: async (id) => {
    try {
      const response = await axiosInstance.get(`/groups/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  createGroup: async (groupData) => {
    try {
      const response = await axiosInstance.post('/groups', groupData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  updateGroup: async (id, groupData) => {
    try {
      const response = await axiosInstance.put(`/groups/${id}`, groupData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  deleteGroup: async (id) => {
    try {
      const response = await axiosInstance.delete(`/groups/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  joinGroup: async (id) => {
    try {
      const response = await axiosInstance.post(`/groups/${id}/join`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  leaveGroup: async (id) => {
    try {
      const response = await axiosInstance.post(`/groups/${id}/leave`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  addMember: async (id, userId) => {
    try {
      const response = await axiosInstance.post(`/groups/${id}/add-member`, { user_id: userId });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  removeMember: async (id, userId) => {
    try {
      const response = await axiosInstance.post(`/groups/${id}/remove-member`, { user_id: userId });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  }
};

// Service des utilisateurs
export const userService = {
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/users');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  },

  // Nouvelle fonctionnalité : historique d'activité utilisateur
  getUserActivity: async (id) => {
    try {
      const response = await axiosInstance.get(`/users/${id}/activity`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Une erreur est survenue' };
    }
  }
}; 