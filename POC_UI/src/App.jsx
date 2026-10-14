import React, {useEffect, useState } from 'react'
import './App.css'
import DashboardContent from './DashboardContent'
import EmployeeList from './EmployeeList'
import { employees as initialEmployees } from './employees'
import {
  getEmployees,
  createEmployee,
  updateEmployee as apiUpdateEmployee,
  deleteEmployee as apiDeleteEmployee,
} from './EmpoyeeApi'
const App = () => {
  const [open, setOpen] = useState(true)
  const [employees, setEmployees]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const loadEmployees = async () => {
    try {
      setEmployees(await getEmployees())
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
   useEffect(() => {
    loadEmployees()
  }, [])
  const addEmployee =async  (newEmp) => {
    try {
      await createEmployee(newEmp)
      await loadEmployees()
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  const deleteEmployee =async (id) => {
    try {
      await apiDeleteEmployee(id)
      await loadEmployees()
    } catch (err) {
      setError(err.message)
    }
  }

  const updateEmployee = async (updated) => {
    try {
      await apiUpdateEmployee(updated.Id, updated)
      await loadEmployees()
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }
  if (loading) return <p>Loading employees...</p>


  return (
    <div>
      <h1>Employee Management System</h1>
      {error && (
        <p style={{ color: 'red' }}>
          {error} <button onClick={() => setError('')}>Dismiss</button>
        </p>
      )}

      <div style={{ borderRadius: '5px', border: '1px solid black', padding: '5px 15px' }}>
        <h2 onClick={() => setOpen(!open)} style={{ cursor: 'pointer', color: 'green' }}>
          Dashboard {open ? '▲' : '▼'}
        </h2>
        {open && <DashboardContent employees={employees} />}
      </div>

      <div style={{ marginTop: '20px' }}>
        <EmployeeList
          employees={employees}
          onAdd={addEmployee}
          onDelete={deleteEmployee}
          onUpdate={updateEmployee}
        />
      </div>
    </div>
  )
}

export default App