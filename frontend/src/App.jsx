import './App.css'
import { Routes, Route } from 'react-router-dom'
import {GoogleOAuthProvider} from "@react-oauth/google"
import { Home } from './pages/Home'
import { SignupPage } from './pages/SignupPage';
import { SigninPage } from './pages/SigninPage';
import { DashboardPage } from './pages/DashboardPage';
import { OurTeam} from './components/OurTeam';
import { DestinationNav } from './components/DestinationNav';
import  PrivateRoute  from './components/PrivateRoute';
import ItineraryView from './components/ItineraryView';
function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={  <SigninPage />} />
      <Route path="/dashboard"
       element={ <PrivateRoute> 
        <DashboardPage />
        </PrivateRoute>} />
      <Route path="/team" element={<OurTeam />} />
      <Route path="/destinav" element={<DestinationNav />} />
      <Route path='/itinerary' element={<PrivateRoute>
        <ItineraryView/>
      </PrivateRoute>}></Route>

    </Routes>
  )
}

export default App
