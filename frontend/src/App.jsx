import './App.css'
import { Routes, Route } from 'react-router-dom'

import { Home } from './pages/Home'
import { SignupPage } from './pages/SignupPage';
import { SigninPage } from './pages/SigninPage';
import { DashboardPage } from './pages/DashboardPage';
import { OurTeam} from './components/OurTeam';
import { DestinationNav } from './components/DestinationNav';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/team" element={<OurTeam />} />
      <Route path="/destinav" element={<DestinationNav />} />

    </Routes>
  )
}

export default App
