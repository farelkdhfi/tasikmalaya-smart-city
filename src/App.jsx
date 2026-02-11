import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ScrollToTop from './utils/scrollToTop'

// Environment Section
import CityPulseDashboard from './pages/environmentsSection/CityPulseDashboard'
import MobilityDashboard from './pages/environmentsSection/MobilityDashboard'
import ResponseDashboard from './pages/environmentsSection/ResponseDashboard'
import EHealthDashboard from './pages/environmentsSection/EHealthDashboard'
import CityEventsDashboard from './pages/environmentsSection/CityEventsDashboard'

// Education Section
import DigitalAcademy from './pages/educationsSection/DigitalAcademy'
import EcoAwareness from './pages/educationsSection/EcoAwareness'
import WasteManagement from './pages/educationsSection/WasteManagement'
import ChildDevelopment from './pages/educationsSection/ChildDevelopment'
import CyberSecurity from './pages/educationsSection/CyberSecurity'

// Security Section
import ChildSafety from './pages/securitySection/ChildSafety'
import PoliceCenter from './pages/securitySection/PoliceCenter'
import FireResponse from './pages/securitySection/FireResponse'
import TrafficPage from './pages/securitySection/TrafficPage'
import DisasterRelief from './pages/securitySection/DisasterRelief'
import VirtualAssistantPage from './pages/VirtualAssistantPage'

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Security Routes */}
        <Route path="/child-protection" element={<ChildSafety />} />
        <Route path="/police-call-center" element={<PoliceCenter />} />
        <Route path="/traffic" element={<TrafficPage />} />
        <Route path="/fireman-call-center" element={<FireResponse />} />
        <Route path="/regional-disaster" element={<DisasterRelief />} />

        {/* env */}
        <Route path="/Information" element={<CityPulseDashboard />} />
        <Route path="/Transport" element={<MobilityDashboard />} />
        <Route path="/Emergency" element={<ResponseDashboard />} />
        <Route path="/Health" element={<EHealthDashboard />} />
        <Route path="/Calendar" element={<CityEventsDashboard />} />

        {/* EDU */}
        <Route path="/education-center" element={<DigitalAcademy />} />
        <Route path="/green" element={<EcoAwareness />} />
        <Route path="/recycling" element={<WasteManagement />} />
        <Route path="/smart-child" element={<ChildDevelopment />} />
        <Route path="/digital-footprints" element={<CyberSecurity />} />
       
       {/* Virtual Assistant */}
        <Route path="/virtual-assistant" element={<VirtualAssistantPage />} />

      </Routes>
    </Router>
  )
}

export default App