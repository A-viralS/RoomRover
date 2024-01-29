import React, { useContext, useState } from 'react'
import { UserContext } from '../UserContext'
import { Navigate, useNavigate, useParams, useResolvedPath } from 'react-router'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'


const AccountPage = () => {
    const {ready,user,setUser}= useContext(UserContext)
    const [redirect,setRedirect]=useState(null);
  
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

function linkClasses (type=null) {
    let classes = 'py-2 px-6';
    console.log("check ",type,subpage);
    if (type === subpage.subpage) {
      
    classes +=' bg-pink-500 text-blue-800 rounded-full' ;
    }
    return classes;
    }

  return (
<div>
<nav className="w-full flex justify-center mt-8 gap-2">
  <Link className={linkClasses('profile')} to={'/account'}>
    My Profile
  </Link>
  <Link className={linkClasses('bookings')} to={'/account/bookings'}>
    My bookings
  </Link>
  <Link className={linkClasses('places')} to={'/account/places'}>
    My account
  </Link>
</nav>

{subpage.subpage=== 'profile' && (
<div className="text-center max-w-lg mx-auto">
Logged in as {user.name} ({user.email})<br />
<button className="primary max-w-sm mt-2" onClick={logout}>Logout</button>
</div>
)}
    </div>
 
 
  )
}

export default AccountPage