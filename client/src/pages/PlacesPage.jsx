import React, { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Perks from '../Perks';
import axios from 'axios';
import PhotosUploader from '../PhotosUploader';
import { useNavigate } from 'react-router-dom';
import PlacesFormPage from './PlacesFormPage';
import AccountNav from '../AccountNav';


const PlacesPage = () => {
  const [places,setPlaces]=useState([])
  useEffect(()=>{
axios.get('/places').then(({data})=>{
setPlaces(data)
})

  },[])
  places.map(place=>console.log(place.photos[0]))
  const {action}=useParams();

  return (
    <div>
      <AccountNav/>
      {action!='new'&&(
 <div className="text-center">
 <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
     <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
   </svg>
   Add new place
 </Link>
</div>
      )}
      
      {action==='new'&&(
      <PlacesFormPage/> 
      )}
 
<div>
  { places.length>0 && places.map(place=>(
    <Link to={'/account/places/'+place._id} className='flex gap-4 grow shrink-0 bg-gray-200 p-4 rounded-2xl'>
<div className='w-32 h-32 bg-gray-100'>{place.photos.length>0 &&(
<div> 
  <img src={'http://localhost:4000/'+place.photos[0]} alt='asdfsa'></img>
</div>
 
)}</div>
<div className='grow-0 shrink '>
<h2 className='text-xl '>{place.title}</h2>
<p className='text-sm mt-2 '>{place.description}</p>
</div>

    </Link>
  ))}
</div>


  </div>
  )
}

export default PlacesPage