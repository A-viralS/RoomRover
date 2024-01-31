import React, { useContext, useState } from 'react'
import { UserContext } from '../UserContext'
import { Navigate, useNavigate, useParams, useResolvedPath } from 'react-router'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import PlacesPage from './PlacesPage'
import AccountNav from '../AccountNav'


const AccountPage = () => {

    const {ready,user,setUser}= useContext(UserContext)
    const [redirect,setRedirect]=useState(null);
  console.log(user);
const navigate= useNavigate()
// if(!ready){
//     return 'loading...'
// }


const subpage=useParams();
if (subpage.subpage === undefined) {
    subpage.subpage = 'profile';
    }

    async function logout(){
await axios.post('/logout')
setUser(null);
setRedirect('/')//uyaha se redirect hone pe index pe jana chahiye 
    }

    if(ready&& !user && !redirect){
        navigate('/login')// yaha se redirect hone pe login page pe 
    }
    
  if(redirect){
navigate(redirect)
  }


  return (
<div>
<AccountNav/>

{subpage.subpage=== 'profile' && (
<div className="text-center max-w-lg mx-auto">
Logged in as {user.name} ({user.email})<br />
<button className="primary max-w-sm mt-2" onClick={logout}>Logout</button>
</div>
)}

{subpage.subpage=== 'places' && (

<PlacesPage/>
)}
    </div>
 
 
  )
}

export default AccountPage