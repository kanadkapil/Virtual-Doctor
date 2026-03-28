import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Activity, LogOut, User, Stethoscope } from 'lucide-react';
import Badge from './Badge';

export default function Navbar() {
  const { role, setRole } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  return (
    <div className="navbar glass-panel sticky top-0 z-50 px-4 md:px-8 h-20 transition-all duration-300 border-b border-white/5">
      <div className="flex-1">
        <Link to={role === 'patient' ? '/patient' : role === 'doctor' ? '/doctor' : '/'} className="btn btn-ghost text-2xl gap-3 rounded-2xl hover:bg-white/5 transition-all">
          <div className="p-2 rounded-xl bg-gradient-to-br from-drprimary to-draccent shadow-lg shadow-drprimary/20">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-drprimary via-draccent to-drsecondary">
            Dr. Ai
          </span>
        </Link>
      </div>
      <div className="flex-none gap-6">
        {role && (
          <>
            <div className="items-center gap-3 hidden sm:flex">
               {role === 'patient' ? (
                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-drprimary/10 border border-drprimary/20 text-drtext shadow-[0_0_15px_rgba(164,221,0,0.15)]">
                   <User className="w-4 h-4 text-drprimary" />
                   <span className="text-sm font-semibold tracking-wide">Patient Mode</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-drsecondary/20 border border-drsecondary/50 text-drtext shadow-[0_0_15px_rgba(182,245,0,0.25)]">
                   <Stethoscope className="w-4 h-4 text-draccent" />
                   <span className="text-sm font-semibold tracking-wide">Doctor Mode</span>
                 </div>
               )}
            </div>
            <button 
              onClick={handleLogout} 
              className="btn btn-ghost btn-circle hover:bg-red-500/10 hover:text-red-500 text-drtext/50 transition-colors tooltip tooltip-bottom" 
              data-tip="Switch Role">
              <LogOut size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
