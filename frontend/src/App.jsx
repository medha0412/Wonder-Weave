import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import {GoogleOAuthProvider} from "@react-oauth/google"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Home } from './pages/Home'
import { SignupPage } from './pages/SignupPage';
import { SigninPage } from './pages/SigninPage';
import { DashboardPage } from './pages/DashboardPage';
import  PrivateRoute  from './components/PrivateRoute';
import ItineraryView from './components/ItineraryView';
import Flights from './components/Flights';
import HoRo from "./components/HotelsandResto";
import OauthSuccess from './pages/OauthSuccess';
import About from './components/About';
import Blog from './components/Blog';
import Terms from './components/Terms';
function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={  <SigninPage />} />
      <Route path="/flights" element={<Flights />} />
      <Route path='/hotel&resto' element={ <HoRo/>}/>
      <Route path="/oauth-success" element={<OauthSuccess />} />
       <Route path='/about' element={<About />} />
       <Route path='/blog' element={<Blog />} />
       <Route path='/terms' element={<Terms />}/>

      <Route path="/dashboard"
       element={ <PrivateRoute> 
        <DashboardPage />
        </PrivateRoute>} />
      <Route path='/itinerary' element={<PrivateRoute>
        <ItineraryView/>
      </PrivateRoute>}></Route>

    </Routes>
  )
}

export default App
