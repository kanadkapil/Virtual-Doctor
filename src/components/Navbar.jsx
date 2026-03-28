import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LayoutDashboard, Bot, FileText, HelpCircle, User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { role, setRole } = useAppContext();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Dashboard', path: role === 'doctor' ? '/doctor' : '/patient' },
    { label: 'AI Assistant', path: '/ai-chat' },
    { label: 'Reports', path: '/report' },
    { label: 'Help', path: '#' },
  ];

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-8 flex-shrink-0 z-40">
      {/* Logo — only shown on landing */}
      {!role && (
        <Link to="/" className="text-lg font-bold text-gray-900 mr-4">Dr. Ai</Link>
      )}

      {/* Nav Links */}
      {role && (
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="ml-auto flex items-center gap-3">
        {role && (
          <>
            {/* Language toggle */}
            <div className="text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1.5 font-medium">
              🌐 EN
            </div>

            {/* Role badge */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-700">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              Role: {role === 'patient' ? 'Patient' : 'Provider'}
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center cursor-pointer">
              <User size={16} className="text-gray-500" />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
