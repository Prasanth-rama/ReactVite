import React from 'react'
import Welcome from './Welcome'
import UserCard from './UserCard'
import Card from './Card'
import './App.css'
import Button from './button'
import Greeting from './Greeting'
const App = () => {
  const name='Prasanth'
  const items=[1,2,3]

  return (
      <>
      <Greeting isLoggedIn={true}/>
      <Card>
         <Welcome name="Prasanth"/>
      </Card>
      <Card>
          <UserCard name='Prasanth' role='user' verified={false}/>
          <UserCard name='Riyaaz' role='admin' verified={true}/>
      </Card>
     
      </>   
  )
}

export default App
