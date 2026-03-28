import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LayoutDashboard, FileText, MessageSquare, HelpCircle, Settings, LogOut, Stethoscope, AlertCircle } from 'lucide-react';

export default function Sidebar() {
  const { role, setRole } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const patientLinks = [
    { path: `/${role}`, label: 'Overview', icon: <LayoutDashboard size={17} /> },
    { path: '/patient', label: 'Intake Form', icon: <FileText size={17} /> },
    { path: '/ai-chat', label: 'Consultations', icon: <MessageSquare size={17} /> },
    { path: '/report', label: 'Medical Records', icon: <FileText size={17} /> },
  ];

  const doctorLinks = [
    { path: '/doctor', label: 'Overview', icon: <LayoutDashboard size={17} /> },
    { path: '/report', label: 'Patient Reports', icon: <FileText size={17} /> },
    { path: '/prescription', label: 'Prescriptions', icon: <Stethoscope size={17} /> },
  ];

  const links = role === 'doctor' ? doctorLinks : patientLinks;

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-clinical-green flex items-center justify-center text-white font-bold text-sm" style={{background:'#2d6a00'}}>
            <Stethoscope size={16}/>
          </div>
          <div>
            <div className="font-bold text-base leading-tight text-gray-900">Dr. Ai</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Clinical Intelligence</div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`sidebar-link ${isActive(link.path) ? 'active' : ''}`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-4 space-y-1">
        {/* Emergency */}
        <button className="btn-emergency mb-3" onClick={() => navigate('/ai-chat')}>
          <AlertCircle size={14} />
          Emergency Triage
        </button>

        <button className="sidebar-link w-full" onClick={() => {}}>
          <Settings size={17} />
          Settings
        </button>
        <button className="sidebar-link w-full" onClick={handleLogout}>
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
