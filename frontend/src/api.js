const TOKEN_KEY = 'resume_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body, auth = true, raw = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (auth && token) headers['Authorization'] = `Bearer ${token}`

  let res
  try {
    res = await fetch(path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Is it running on port 5000?')
  }

  if (raw) {
    if (!res.ok) throw new Error(`Request failed (${res.status})`)
    return res
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data.error || 'Request failed'
    const detail = data.details?.length
      ? data.details.map((d) => `${d.path}: ${d.message}`).join(', ')
      : ''
    throw new Error(detail ? `${msg} — ${detail}` : msg)
  }
  return data
}

export const api = {
  register: (body) => request('/api/auth/register', { method: 'POST', body, auth: false }),
  login: (body) => request('/api/auth/login', { method: 'POST', body, auth: false }),
  forgotPassword: (body) => request('/api/auth/forgot-password', { method: 'POST', body, auth: false }),
  resetPassword: (body) => request('/api/auth/reset-password', { method: 'POST', body, auth: false }),
  me: () => request('/api/auth/me'),
  logout: () => request('/api/auth/logout', { method: 'POST' }),

  generateType: (body) => request('/api/generate/type', { method: 'POST', body }),
  generateAll: (body) => request('/api/generate', { method: 'POST', body }),
  refine: (body) => request('/api/refine', { method: 'POST', body }),
  chat: (body) => request('/api/chat', { method: 'POST', body }),

  saveProfile: (body) => request('/api/profiles', { method: 'POST', body }),
  listProfiles: () => request('/api/profiles'),
  getProfile: (id) => request(`/api/profiles/${id}`),
  updateProfile: (id, body) => request(`/api/profiles/${id}`, { method: 'PATCH', body }),
  deleteProfile: (id) => request(`/api/profiles/${id}`, { method: 'DELETE' }),
  togglePin: (id) => request(`/api/profiles/${id}/pin`, { method: 'POST' }),

  exportFile: async (endpoint, body) => {
    const res = await request(endpoint, { method: 'POST', body, raw: true })
    const filename = (res.headers.get('Content-Disposition')?.match(/filename="(.+)"/) || [])[1] || 'resume'
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  },
}