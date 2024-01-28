import {Route, Routes} from "react-router-dom";
import './App.css'
import Layout from "./Layout";
import LoginPage from "./pages/LoginPage"
import IndexPage from "./pages/IndexPage"

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import AccountPage from "./pages/AccountPage";

axios.defaults.baseURL="http://localhost:4000"
axios.defaults.withCredentials=true

function App() {


  return (
    <UserContextProvider>
    <Routes>
<Route path="/" element={<Layout/>}>
<Route index element={<IndexPage />} />
  <Route path="/login" element={<LoginPage/>}></Route>
  <Route path="/account" element={<AccountPage/>}></Route>

 
  <Route path="/register" element={<RegisterPage/>}></Route>


</Route>
    </Routes>
    </UserContextProvider>
  )
}

export default App
