import {Route, Routes} from "react-router-dom";
import './App.css'
import Layout from "./Layout";
import LoginPage from "./pages/LoginPage"

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";

axios.defaults.baseURL="http://localhost:4000"
axios.defaults.withCredentials=true

function App() {


  return (
    <Routes>
<Route path="/" element={<Layout/>}>
  <Route path="/login" element={<LoginPage/>}></Route>
  <Route path="/register" element={<RegisterPage/>}></Route>


</Route>
    </Routes>
   
  )
}

export default App
