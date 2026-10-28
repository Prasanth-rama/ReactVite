import {request} from './EmpoyeeApi'
const BASE_URL_DEPARTMENT = import.meta.env.VITE_API_URL_DEPARTMENT ?? 'http://localhost:5041/api/employee1'
export const getDepartments = async () => {

  const result = await request(
    BASE_URL_DEPARTMENT,
    {},
    { withHeaders: false }
  )
  console.log('result:', result)
  return result
}


export const createDepartment = (department) =>
  request(BASE_URL_DEPARTMENT, { method: 'POST', body: JSON.stringify(department) })

export const updateDepartment = (department) =>
  request(`${BASE_URL_DEPARTMENT}/${department.Id}`, { method: 'PUT', body: JSON.stringify(department) })

export const deleteDepartment = (id)=>
    request(`${BASE_URL_DEPARTMENT}/${id}`, { method: 'DELETE', body: JSON.stringify(id) })