import React, { useState } from 'react'
import EmployeeForm from './EmployeeForm'


const EmployeeList = ({ employees,onAdd, onDelete, onUpdate }) => {
    const departments = ['Engineering', 'Design', 'Product', 'HR', 'Sales', 'Finance']
    const onboardingOptions = ['Not Started', 'In Progress', 'Completed']
    const employmentTypes = ['Full-time', 'Part-time', 'Intern', 'Contractor']
    const statusOptions = ['Active', 'Exited', 'On Leave']
    const emptyEmployee = {
        Id: null,
        FullName: '',
        Email: '',
        Role: '',
        Department: '',
        JoiningDate: '',
        EmploymentType: '',
        OnboardingStatus: '',
        Status: '',
    }
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState({
        EmploymentType: '',
        OnboardingStatus: '',
        Status: '',
        Department: '',
    })
    const term = search.trim().toLowerCase()
    const filteredEmployees = employees.filter(emp => {
        const matchesSearch =
            emp.FullName.toLowerCase().includes(term) ||
            emp.Email.toLowerCase().includes(term)

        const matchesFilters = Object.entries(filters).every(
            ([key, value]) => value === '' || emp[key] === value

        )
        return matchesSearch && matchesFilters
    })


    const [editing, setEditing] = useState(null) // holds a copy of the employee being edited
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }
    const clearFilters = () => {
        setSearch('')
        setFilters({ EmploymentType: '', OnboardingStatus: '', Status: '', Department: '' })
    }
    const handleDelete =async  (emp) => {
        if (window.confirm(`Delete ${emp.FullName}?`)) {
           const ok= await onDelete(emp.Id)
        }
    }
    const handleSave = async (employee) => {
        var ok=false
        if (employee.Id === null) {
            ok=await onAdd(employee)
        } else {
           ok=await  onUpdate(employee)
        }
        if (ok) setEditing(null) 
                                     // close the form
    }


    return (
        <div>
            <h2>Employees ({filteredEmployees.length} of {employees.length})</h2>
            <div className="filter-bar">
                <input
                    type="text"
                    className="search-box"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select name="Department" value={filters.Department} onChange={handleFilterChange}>
                    <option value="">All Departments</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <select name="EmploymentType" value={filters.EmploymentType} onChange={handleFilterChange}>
                    <option value="">All Employment Types</option>
                    {employmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <select name="OnboardingStatus" value={filters.OnboardingStatus} onChange={handleFilterChange}>
                    <option value="">All Onboarding Statuses</option>
                    {onboardingOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>

                <select name="Status" value={filters.Status} onChange={handleFilterChange}>
                    <option value="">All Statuses</option>
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

            </div>

            <button className="btn cancel" onClick={clearFilters}>Clear</button>
            <button className="btn edit" onClick={() => setEditing({ ...emptyEmployee })}>
                + Add Employee
            </button>
            <div className="table-wrapper">
                <table className="emp-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Employement Type</th>
                            <th>Joining Date</th>
                            <th>Onboarding</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length === 0 ? (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center' }}>No employees found</td>
                            </tr>
                        ) : (

                            filteredEmployees.map((emp, index) => (
                                <tr key={emp.Id}>
                                    <td>{index + 1}</td>
                                    <td>{emp.FullName}</td>
                                    <td>{emp.Email}</td>
                                    <td>{emp.Role}</td>
                                    <td>{emp.Department}</td>
                                    <td>{emp.EmploymentType}</td>
                                    <td>{new Date(emp.JoiningDate).toLocaleDateString('en-IN')}</td>
                                    <td>
                                        <span className={`badge ${emp.OnboardingStatus.replace(' ', '-').toLowerCase()}`}>
                                            {emp.OnboardingStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${emp.Status.replace(' ', '-').toLowerCase()}`}>
                                            {emp.Status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn edit" onClick={() => setEditing({ ...emp })}>Edit</button>
                                        <button className="btn delete" onClick={() => handleDelete(emp)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {editing && (
                <EmployeeForm
                    initialData={editing}
                    otherEmails={employees
                        .filter(e => e.Id !== editing.Id)
                        .map(e => e.Email.toLowerCase())}
                    onSave={handleSave}
                    onCancel={() => setEditing(null)}
                />
            )}
        </div>
    )
}

export default EmployeeList