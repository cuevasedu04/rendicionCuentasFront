const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function apiFetch(path, token, options = {}) {
  const headers = { ...options.headers };
  if (token) headers['Authorization'] = `Token ${token}`;
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Error ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Auth calls (no token required — AllowAny endpoints)
export const authApi = {
  requestOtp: (correo) =>
    apiFetch('/api/v1/auth/request-otp/', null, {
      method: 'POST',
      body: JSON.stringify({ correo }),
    }),
  verifyOtp: (correo, code) =>
    apiFetch('/api/v1/auth/verify-otp/', null, {
      method: 'POST',
      body: JSON.stringify({ correo, code }),
    }),
  setPassword: (correo, verified_token, password) =>
    apiFetch('/api/v1/auth/set-password/', null, {
      method: 'POST',
      body: JSON.stringify({ correo, verified_token, password }),
    }),
  login: (correo, password) =>
    apiFetch('/api/v1/auth/login/', null, {
      method: 'POST',
      body: JSON.stringify({ correo, password }),
    }),
};

// Factory for authenticated calls — pass drfToken from NextAuth session
export function createApi(token) {
  return {
    excepciones: {
      list: () =>
        apiFetch('/api/v1/activos/excepciones-recursos/', token),
      update: (numEmpleado, manejaRecursos) =>
        apiFetch(`/api/v1/activos/excepciones-recursos/${numEmpleado}/`, token, {
          method: 'PATCH',
          body: JSON.stringify({ maneja_recursos: manejaRecursos }),
        }),
    },
    informeGestion: {
      activos: () =>
        apiFetch('/api/v1/bajas/informe-gestion/activos/', token),
      excedidos: () =>
        apiFetch('/api/v1/bajas/informe-gestion/excedidos/', token),
    },
    actaEntrega: {
      activos: () =>
        apiFetch('/api/v1/bajas/acta-entrega/activos/', token),
      excedidos: () =>
        apiFetch('/api/v1/bajas/acta-entrega/excedidos/', token),
    },
  };
}
