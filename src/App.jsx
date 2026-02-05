import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import { ChildProtectionPage, DisasterPage, FirefighterPage, PoliceCenterPage } from './pages/SecurityPage'
import { CityInfoPage, EmergencyPage, EventsPage, HealthPage, TransportPage } from './pages/EnvironmentPage'
import { DigitalIdentityPage, EducationCenterPage, GreenLivingPage, RecyclePage, SmartChildPage } from './pages/EducationPage'
import { VirtualAssistantPage } from './pages/VirtualAssistantPage'
import TrafficPage from './components/security-section/TrafficPage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Security Routes */}
        <Route path="/child-protection" element={<ChildProtectionPage />} />
        <Route path="/police-call-center" element={<PoliceCenterPage />} />
        <Route path="/traffic" element={<TrafficPage />} />
        <Route path="/fireman-call-center" element={<FirefighterPage />} />
        <Route path="/regional-disaster" element={<DisasterPage />} />

        {/* env */}
        <Route path="/Information" element={<CityInfoPage />} />
        <Route path="/Transport" element={<TransportPage />} />
        <Route path="/Emergency" element={<EmergencyPage />} />
        <Route path="/Health" element={<HealthPage />} />
        <Route path="/Calendar" element={<EventsPage />} />

        {/* EDU */}
        <Route path="/education-center" element={<EducationCenterPage />} />
        <Route path="/green" element={<GreenLivingPage />} />
        <Route path="/recycling" element={<RecyclePage />} />
        <Route path="/smart-child" element={<SmartChildPage />} />
        <Route path="/digital-footprints" element={<DigitalIdentityPage />} />
       
       {/* Virtual Assistant */}
        <Route path="/virtual-assistant" element={<VirtualAssistantPage />} />

      </Routes>
    </Router>
  )
}

export default App