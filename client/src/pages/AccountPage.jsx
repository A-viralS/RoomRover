import React, { useContext } from 'react'
import { UserContext } from '../UserContext'
import { Navigate, useNavigate } from 'react-router'


const AccountPage = () => {
    const {ready,user}= useContext(UserContext)
const navigate= useNavigate()
if(ready&& !user){
    navigate('/login')
    
}
if(!ready){
    return 'loading...'
}

  return (
    <div>AccountPage for {user.name}</div>
  )
}

export default AccountPage