import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './Layout'
import LoginPage from './pages/LoginPage'
import IndexPage from './pages/IndexPage'
import './index.css'

import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import ProfilePage from './pages/ProfilePage'
import PlacesPage from './pages/PlacesPage'
import PlacePage from './pages/PlacePage'
import PlacesFormPage from './pages/PlacesFormPage'
import BoookingsPage from './pages/BoookingsPage'
import BookingPage from './pages/BookingPage'

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.withCredentials = true

function App () {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path='/register' element={<RegisterPage />}></Route>
          <Route path='/login' element={<LoginPage />}></Route>
          <Route path='/account' element={<ProfilePage />}></Route>
          <Route path='/account/places' element={<PlacesPage />}></Route>
          <Route
            path='/account/places/new'
            element={<PlacesFormPage />}
          ></Route>
          <Route
            path='/account/places/:id'
            element={<PlacesFormPage />}
          ></Route>
          <Route path='/place/:id' element={<PlacePage />}></Route>
          <Route path='/account/bookings/' element={<BoookingsPage />}></Route>
          <Route path='/account/bookings/:id' element={<BookingPage />}></Route>
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
