const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5041/api/employee1'
const BASE_URL_DEPARTMENT=import.meta.env.VITE_API_URL_DEPARTMENT
export async function request(url, options = {}, { withHeaders = false } = {}) {
  console.log('REQUEST CALLED', url, withHeaders)

  let res
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch (err) {
    console.error('FETCH THREW:', err)
    throw err
  }
  console.log('STATUS', res.status)



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
    const error = new Error(message)
    error.status = res.status
    throw error

  }
    const text = await res.text()
    const data = text ? JSON.parse(text) : null
  if (res.status === 204) return "ok";

  return withHeaders ? { data: data, headers: res.headers } : data

}



 export const getDepartments = () => request(BASE_URL_DEPARTMENT )
 export const getmangersOfdepartments=(depId)=>request( BASE_URL+`/managers/${depId}` )
 export const getEmployees = async (queryParams) => {
 const params = new URLSearchParams()

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== '' && value !== 0 && value != null) {
      params.append(key, value)
    }
  })
  const result = await request(
    `${BASE_URL}/filteredEmployees?${params}`,
    {},
    { withHeaders: true }
  )
  console.log('result:', result)
  return {
    items: result.data,
    totalCount: parseInt(result.headers.get('X-Total-Count') ?? '0', 10)
  }

}
export const getSummary = () => request(BASE_URL + "/summary")
export const createEmployee = (employee) =>
  request(BASE_URL, { method: 'POST', body: JSON.stringify(employee) })

export const updateEmployee = (id, employee) =>
  request(`${BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(employee) })

export const deleteEmployee = (id) =>
  request(`${BASE_URL}/${id}`, { method: 'DELETE' })