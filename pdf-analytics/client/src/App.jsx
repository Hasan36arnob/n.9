import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import UploadPage from './pages/UploadPage';
import ViewerPage from './pages/ViewerPage';
import DashboardPage from './pages/DashboardPage';
//



// Main App component with routing

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/view/:shareToken" element={<ViewerPage />} />
            <Route path="/dashboard/:shareToken" element={<DashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
