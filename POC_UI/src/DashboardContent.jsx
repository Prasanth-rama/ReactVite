import React from 'react'
import StatCard from './StatCard'



const DashboardContent = ({employees}) => {
    const total = employees.length

    // Generic helper: counts by any property
    const countBy = (list, key) =>
        list.reduce((acc, item) => {
            acc[item[key]] = (acc[item[key]] || 0) + 1
            return acc
        }, {})
    const byDepartment = countBy(employees, 'Department')
    // { Engineering: 5, Design: 3, Product: 3, HR: 2, Sales: 4, Finance: 3 }
    const byEmployementType=countBy(employees, 'EmploymentType')
    const byOnboarding = countBy(employees, 'OnboardingStatus')

    const now = new Date()
    const joinedThisMonth = employees.filter(e => {
        const d = new Date(e.JoiningDate)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
    return (


        <div className="dash-grid">
            <StatCard icon="👥" title="Total Employees" color="#3b82f6">
                <h2>{total}</h2>
            </StatCard>

            <StatCard icon="🏢" title="By Department" color="#8b5cf6">
                <ul>
                    <ul>
                        {Object.entries(byDepartment).map(([name, count]) => (
                            <li key={name}>{name}: {count}</li>
                        ))}
                    </ul>
                </ul>
            </StatCard>

            <StatCard icon="💼" title="By Employment Type" color="#14b8a6">
                <ul>
                     {Object.entries(byEmployementType).map(([name, count]) => (
                            <li key={name}>{name}: {count}</li>
                        ))}
                </ul>
            </StatCard>

            <StatCard icon="📋" title="Onboarding Status" color="#f59e0b">
                <ul>
                    {Object.entries(byOnboarding).map(([name, count]) => (
                            <li key={name}>{name}: {count}</li>
                        ))}
                </ul>
            </StatCard>

            <StatCard icon="🆕" title="Joined This Month" color="#22c55e">
                <h2>{joinedThisMonth}</h2>
            </StatCard>
        </div>
    )
}

export default DashboardContent
