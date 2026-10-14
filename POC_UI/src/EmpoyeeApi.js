const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5041/api/employee1'

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    // validation errors come back as JSON, the duplicate-email 409 as plain text
    const text = await res.text()
    let message = text || `Request failed (${res.status})`
    try {
      const body = JSON.parse(text)
      if (body.errors) message = Object.values(body.errors).flat().join(', ')
      else if (body.title) message = body.title
    } catch {
      // not JSON, keep the plain text message
    }
    throw new Error(message)
  }

  // PUT and DELETE return 204 No Content
  return res.status === 204 ? null : res.json()
}

export const getEmployees = () => request(BASE_URL)

export const createEmployee = (employee) =>
  request(BASE_URL, { method: 'POST', body: JSON.stringify(employee) })

export const updateEmployee = (id, employee) =>
  request(`${BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(employee) })

export const deleteEmployee = (id) =>
  request(`${BASE_URL}/${id}`, { method: 'DELETE' })