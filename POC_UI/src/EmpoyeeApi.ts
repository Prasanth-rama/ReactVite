import type { Employee, EmployeeFilterRequest, PagedResult } from "./types";
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5041/api/employee1'
const BASE_URL_DEPARTMENT=import.meta.env.VITE_API_URL_DEPARTMENT
export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface ProblemDetails {
  title?: string
  errors?: Record<string, string[]>
}
export async function request(url: string, options = {}, { withHeaders = false } = {}) {
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
    const error = new ApiError(message,0)
    error.status = res.status
    throw error

  }
    const text = await res.text()
    const data = text ? JSON.parse(text) : null
  if (res.status === 204) return "ok";

  return withHeaders ? { data: data, headers: res.headers } : data

}



 export const getDepartments = () => request(BASE_URL_DEPARTMENT )
 export const getmangersOfdepartments=(depId :number)=>request( BASE_URL+`/managers/${depId}` )
 export async function  getEmployees  (queryParams :EmployeeFilterRequest
 ) :Promise<PagedResult<Employee>>{
 const params = new URLSearchParams()

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== '' && value !== 0 && value != null) {
      params.append(key, String(value))
    }
  })
  const result = await request(
    `${BASE_URL}/filteredEmployees?${params}`,
    {},
    { withHeaders: true }
  )
  console.log('result:', result)
  return {
    data: result.data,
    totalCount: parseInt(result.headers.get('X-Total-Count') ?? '0', 10)
  }

}
export const getSummary = () => request(BASE_URL + "/summary")
export const createEmployee = (employee : Employee) =>
  request(BASE_URL, { method: 'POST', body: JSON.stringify(employee) })

export const updateEmployee = (id:number, employee:Employee) =>
  request(`${BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(employee) })

export const deleteEmployee = (id:number) =>
  request(`${BASE_URL}/${id}`, { method: 'DELETE' })