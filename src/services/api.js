const BASE_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem('token');
}

function buildHeaders(auth = true) {
  const h = { 'Content-Type': 'application/json' };
  if (auth) h['Authorization'] = `Bearer ${getToken()}`;
  return h;
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(message || `Error ${response.status}`);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null;
}

// --- Auth ---
export const auth = {
  login: async (usuario, password) => {
    const data = await request('/api/auth/login', {
      method: 'POST',
      headers: buildHeaders(false),
      body: JSON.stringify({ usuario, password }),
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('rol', data.rol);
    localStorage.setItem('usuarioId', data.usuarioId);
    return data;
  },
};

// --- Rutinas ---
export const rutinas = {
  getAll: () =>
    request('/api/rutinas', { headers: buildHeaders() }),

  getById: (id) =>
    request(`/api/rutinas/${id}`, { headers: buildHeaders() }),

  create: (data) =>
    request('/api/rutinas', {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    request(`/api/rutinas/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    }),
};

// --- Días de una rutina ---
export const diasRutina = {
  create: (data) =>
    request('/api/diasrutina', {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    request(`/api/diasrutina/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    }),
};

// --- Ejercicios de un día ---
export const ejerciciosDia = {
  create: (data) =>
    request('/api/EjerciciosDia', {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    request(`/api/EjerciciosDia/${id}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    request(`/api/EjerciciosDia/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    }),
};

// --- Usuarios ---
export const usuarios = {
  getAll: () =>
    request('/api/usuarios', { headers: buildHeaders() }),

  create: (data) =>
    request('/api/usuarios', {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    }),

  asignarRutina: (id, rutinaId) =>
    request(`/api/usuarios/${id}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify({ rutinaId }),
    }),

  delete: (id) =>
    request(`/api/usuarios/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    }),
};

// --- Ejercicios base (biblioteca) ---
export const ejerciciosBase = {
  getAll: () =>
    request('/api/ejerciciosbase', { headers: buildHeaders() }),

  create: (data) =>
    request('/api/ejerciciosbase', {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    request(`/api/ejerciciosbase/${id}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    request(`/api/ejerciciosbase/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    }),
};
