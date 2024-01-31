import React, { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Perks from '../Perks';
import axios from 'axios';
import PhotosUploader from '../PhotosUploader';


const PlacesPage = () => {
  
  const {action}=useParams()
  const [title,setTitle] = useState('');
  const [address,setAddress] = useState('');
  const [addedPhotos,setAddedPhotos] = useState([]);
  const [photoLink,setPhotoLink]=useState('')
  const [description,setDescription] = useState('');
  const [perks,setPerks] = useState([]);
  const [extraInfo,setExtraInfo] = useState('');
  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [maxGuests,setMaxGuests] = useState(1);
  const [price,setPrice] = useState(100);
  const [redirect,setRedirect] = useState(false);
  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
    );
  }
  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    );
  }
  function preInput(header,description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  return (
    <div>
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
       <div>
         <form className='p-5'>
         {preInput('Title', 'Title for your place. should be short and catchy as in advertisement')}
         <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: My lovely apt"/>
        {preInput('Address', 'Address to this place')}
        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)}placeholder="address"/>
  
        {preInput('Description','description of the place')}
        <textarea value={description} onChange={ev=>{setDescription(ev.target.value)}}/>
        {preInput('Photos','more = better')}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {/* perks */}

        {preInput('Perks','select all the perks of your place')}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks}/>
    </div>

<div>
      {preInput('Extra info','house rules, etc')}
        <textarea selected={extraInfo} onChange={ev=>setExtraInfo(ev.target.value)}/>
        {preInput('Check in&out times','add check in and out times, remember to have some time window for cleaning the room between guests')}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input type="text"
                 
                   value={checkIn} 
                   onChange={ev=>setCheckIn(ev.target.value)}
                   placeholder="14"/>
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input type="text"
                   value={checkOut} 
                   onChange={ev=>setCheckOut(ev.target.value)}
                  
                   placeholder="11" />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input type="number" 
            value={maxGuests}
            onChange={ev=>setMaxGuests(ev.target.value)}
                  />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input type="number" 
            value={price}
            onChange={ev=>setPrice(ev.target.value)}
              />
          </div>
        </div>

        </div>

        <button className="primary my-4">Save</button>



       </form>
       </div>
      )}
   
  {/* <div className="mt-4">
    {places.length > 0 && places.map(place => (
      <Link to={'/account/places/'+place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
        <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
      
        </div>
        <div className="grow-0 shrink">
          <h2 className="text-xl">{place.title}</h2>
          <p className="text-sm mt-2">{place.description}</p>
        </div>
      </Link>
    ))}
  </div> */}
  </div>
  )
}

export default PlacesPage