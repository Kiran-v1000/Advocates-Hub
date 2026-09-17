import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdvocateDashboard from './pages/AdvocateDashboard';
import AdvocatesList from './pages/AdvocatesList';
import Adminpage from './pages/Adminpage';
import Contact from './pages/Contact';
import Partners from './pages/Partners';
import AboutUs from './pages/Aboutus';
import AskQuestion from "./pages/Askquestion";
import LegalDocuments from "./pages/LegalDocuments";
import LegalNews from "./pages/LegalNews";
import BareActs from "./pages/BareActs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermOfUse";
import TalkToAdvocate from "./pages/TalkToAdvocate";

function App() {
  const location = useLocation();
  const isAdminPortal = location.pathname === '/admin';
  const isAdvocatePortal = location.pathname === '/advocate-dashboard';
  const isAdvocateLogin = location.pathname === '/login';

  return (
    <div className="App">
      {!isAdminPortal && !isAdvocatePortal && !isAdvocateLogin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/find-lawyer" element={<AdvocatesList />} />
        <Route path="/AdvocatesList" element={<Navigate to="/find-lawyer" replace />} />
        <Route path="/talk-to-advocate" element={<TalkToAdvocate />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/legal-advice" element={<div style={{padding: "100px"}}>Legal Advice Page Content</div>} />
        <Route path="/legal-advice/ask-question" element={<AskQuestion />} />
        <Route path="/legal-advice/documents" element={<LegalDocuments />} />
        <Route path="/legal-advice/bare-acts" element={<BareActs />} />
        <Route path="/legal-advice/news" element={<LegalNews />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/Aboutus" element={<Navigate to="/aboutus" replace />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Partners" element={<Partners />} />
        <Route path="/admin" element={<Adminpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/advocate-dashboard" element={<AdvocateDashboard />} />
        <Route path="/download" element={<div style={{padding: "100px"}}>Download Apps Page Content</div>} />
      </Routes>
    </div>
  );
}

export default App;
