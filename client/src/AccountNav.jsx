
import React, { useContext, useState } from 'react'
import { Navigate, useNavigate, useParams, useResolvedPath } from 'react-router'
import { Link,useLocation} from 'react-router-dom';

const AccountNav = () => {
    const {pathname}=useLocation();
    console.log(pathname);
    let  subpage=pathname.split('/')?.[2];
    console.log(subpage);
    if(subpage===undefined){ subpage='profile'};
    // const subpage = useParams();
    function linkClasses (type=subpage) {
        
        let classes = 'py-2 px-6';
        console.log("check ",type,subpage);
        if (type === subpage) {
          
        classes +=' bg-pink-500 text-blue-800 rounded-full' ;
        }
        return classes;
        }
  return (
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
  )
}

export default AccountNav