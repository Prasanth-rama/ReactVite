import React from 'react'
const  UserCard=({name,role,verified})=>{
const styles={
    color:"white",
    display:'flex',
    gap:'10px',
    alignItems:'center'
  }
  const greetUser=(userName)=>{
    alert(`Hello, ${userName}`)
  }
    return (
        <>
        <div style={styles}>
            <h2>{name}</h2>
            <p>{role}</p>
            {verified && <span>yes</span>}        
        </div>
        <button onClick={
                ()=>{
                    greetUser(name)
                }
            }>Click Me</button>
        </>
    )
}

export default UserCard