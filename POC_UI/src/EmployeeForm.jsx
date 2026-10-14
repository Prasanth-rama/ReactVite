
import React, { useState } from 'react'
import { departments, employmentTypes, onboardingOptions, statusOptions } from './constants'

const EmployeeForm = ({ initialData, otherEmails, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})

  const isEdit = initialData.Id !== null

  // runs on every keystroke / selection
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '' })      // clear this field's error
  }

  // checks every field and returns an object of error messages
  const validate = () => {
    const newErrors = {}

    const name = formData.FullName.trim()
    if (!name) newErrors.FullName = 'Full name is required'
    else if (name.length < 2) newErrors.FullName = 'Full name must be at least 2 characters'

    const email = formData.Email.trim().toLowerCase()
    if (!email) newErrors.Email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      newErrors.Email = 'Enter a valid email, e.g. name@company.com'
    else if (otherEmails.includes(email)) newErrors.Email = 'This email already exists'

    if (!formData.Role.trim()) newErrors.Role = 'Role is required'
    if (!formData.Department) newErrors.Department = 'Please select a department'
    if (!formData.JoiningDate) newErrors.JoiningDate = 'Joining date is required'
    if (!formData.EmploymentType) newErrors.EmploymentType = 'Please select an employment type'
    if (!formData.OnboardingStatus) newErrors.OnboardingStatus = 'Please select an onboarding status'
    if (!formData.Status) newErrors.Status = 'Please select a status'

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()                         // stop the page from reloading
    const newErrors = validate()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)                     // show the messages and stop
      return
    }

    onSave({
      ...formData,
      FullName: formData.FullName.trim(),
      Email: formData.Email.trim(),
      Role: formData.Role.trim(),
    })
  }

  return (
    <div className="modal-overlay">
      <form className="modal" onSubmit={handleSubmit} noValidate>
        <h3>{isEdit ? 'Edit Employee' : 'Add Employee'}</h3>

        <label>Full Name *
          <input
            type="text"
            name="FullName"
            value={formData.FullName}
            onChange={handleChange}
            className={errors.FullName ? 'invalid' : ''}
          />
          {errors.FullName && <span className="field-error">{errors.FullName}</span>}
        </label>

        <label>Email *
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            className={errors.Email ? 'invalid' : ''}
          />
          {errors.Email && <span className="field-error">{errors.Email}</span>}
        </label>

        <label>Role *
          <input
            type="text"
            name="Role"
            value={formData.Role}
            onChange={handleChange}
            className={errors.Role ? 'invalid' : ''}
          />
          {errors.Role && <span className="field-error">{errors.Role}</span>}
        </label>

        <label>Department *
          <select
            name="Department"
            value={formData.Department}
            onChange={handleChange}
            className={errors.Department ? 'invalid' : ''}
          >
            <option value="">Select department</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {errors.Department && <span className="field-error">{errors.Department}</span>}
        </label>

        <label>Joining Date *
          <input
            type="date"
            name="JoiningDate"
            value={ formData.JoiningDate ? formData.JoiningDate.slice(0, 10) :""}
            onChange={handleChange}
            className={errors.JoiningDate ? 'invalid' : ''}
          />
          {errors.JoiningDate && <span className="field-error">{errors.JoiningDate}</span>}
        </label>

        <label>Employment Type *
          <select
            name="EmploymentType"
            value={formData.EmploymentType}
            onChange={handleChange}
            className={errors.EmploymentType ? 'invalid' : ''}
          >
            <option value="">Select employment type</option>
            {employmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.EmploymentType && <span className="field-error">{errors.EmploymentType}</span>}
        </label>

        <label>Onboarding Status *
          <select
            name="OnboardingStatus"
            value={formData.OnboardingStatus}
            onChange={handleChange}
            className={errors.OnboardingStatus ? 'invalid' : ''}
          >
            <option value="">Select onboarding status</option>
            {onboardingOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {errors.OnboardingStatus && <span className="field-error">{errors.OnboardingStatus}</span>}
        </label>

        <label>Status *
          <select
            name="Status"
            value={formData.Status}
            onChange={handleChange}
            className={errors.Status ? 'invalid' : ''}
          >
            <option value="">Select status</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.Status && <span className="field-error">{errors.Status}</span>}
        </label>

        <div className="modal-actions">
          <button type="submit" className="btn edit">{isEdit ? 'Update' : 'Add'}</button>
          <button type="button" className="btn cancel" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default EmployeeForm