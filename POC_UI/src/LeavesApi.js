import {request} from './EmpoyeeApi'
const BASE_URL_LEAVE = import.meta.env.VITE_API_URL_LEAVE ?? 'http://localhost:5041/api/employee1'


export const getLeaves = async (queryParams) => {
 const params = new URLSearchParams()

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== '' && value !== 0 && value != null) {
      params.append(key, value)
    }
  })
  const result = await request(
    `${BASE_URL_LEAVE}?${params}`,
    {},
    { withHeaders: true }
  )
  console.log('result:', result)
  return {
    items: result.data,
    totalCount: parseInt(result.headers.get('X-Total-Count') ?? '0', 10)
  }

}
export const createLeave = (leave) =>
  request(BASE_URL_LEAVE, { method: "POST", body: JSON.stringify(leave) });
export const updateLeave = (params) =>
{
  console.log("Dele params",JSON.stringify(params))
  return request(`${BASE_URL_LEAVE}/${params.id}`, { method: 'PATCH', body: JSON.stringify(params) })
}

