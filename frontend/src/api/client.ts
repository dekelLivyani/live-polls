const BASE_URL = 'http://localhost:3000'

type ApiOptions = RequestInit & { skipAuth?: boolean }

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { skipAuth, ...init } = options

  const headers = new Headers(init.headers ?? {})
  headers.set('Content-Type', 'application/json')

  if (!skipAuth) {
    const token = localStorage.getItem('accessToken')
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers })

  if (!res.ok) {
    // try to extract a server-side error message
    let message = `${res.status} ${res.statusText}`
    try {
      const body = await res.json()
      message = body?.message ?? JSON.stringify(body) ?? message
    } catch {
      // ignore parse errors
    }
    throw new Error(Array.isArray(message) ? message.join(', ') : message)
  }

  // 204 No Content → nothing to parse
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string, options?: ApiOptions) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body: unknown, options?: ApiOptions) =>
    request<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),
}
