import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Landing from './pages/Landing';
import PatientDashboard from './pages/PatientDashboard';
import AiChat from './pages/AiChat';
import Report from './pages/Report';
import Prescription from './pages/Prescription';
import DoctorDashboard from './pages/DoctorDashboard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { role } = useAppContext();
  if (!role) return <Navigate to="/" />;
  if (requiredRole && role !== requiredRole) return <Navigate to={`/${role}`} />;
  return children;
};

function AppLayout({ children }) {
  const { role } = useAppContext();
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {role && <Sidebar />}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/patient" element={<ProtectedRoute requiredRole="patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/ai-chat" element={<ProtectedRoute requiredRole="patient"><AiChat /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
          <Route path="/prescription" element={<ProtectedRoute><Prescription /></ProtectedRoute>} />
          <Route path="/doctor" element={<ProtectedRoute requiredRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
