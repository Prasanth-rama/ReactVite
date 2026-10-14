import React from 'react'

const StatCard = ({ icon, title, color, children }) => {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
    <h5>{icon} {title}</h5>
    {children}
  </div>
  )
}

export default StatCard


