import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import ViewerPage from './pages/ViewerPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/view/:shareToken" element={<ViewerPage />} />
        <Route path="/dashboard/:shareToken" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
