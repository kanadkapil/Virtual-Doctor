import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Activity, User, Stethoscope, Sparkles } from 'lucide-react';
import Card from '../components/Card';

export default function Landing() {
  const { setRole } = useAppContext();
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    navigate(`/${selectedRole}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] p-4 relative z-10 w-full overflow-hidden">
      
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fade-in-up mt-10">
        <div className="relative inline-block mb-8">
           <div className="absolute inset-0 bg-drprimary rounded-full blur-[40px] opacity-40 animate-pulse-slow"></div>
           <div className="relative p-5 rounded-3xl bg-gradient-to-br from-drprimary to-draccent shadow-2xl shadow-drprimary/30 border border-white/40 backdrop-blur-md">
             <Activity className="w-16 h-16 text-white" />
           </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-drprimary via-draccent to-drsecondary mb-6 drop-shadow-sm">
          Welcome to Dr. Ai
        </h1>
        <p className="text-xl md:text-2xl text-drtext/80 max-w-2xl mx-auto font-medium tracking-wide flex items-center justify-center gap-2">
           <Sparkles className="w-6 h-6 text-drsecondary" />
           Advanced Tele-Triage Diagnosis System
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full px-4 mb-20">
        
        {/* Patient Portal Card */}
        <div 
          onClick={() => handleRoleSelect('patient')}
          className="group relative cursor-pointer"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-drprimary to-draccent rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
           <Card className="h-full transform transition-all duration-300 group-hover:-translate-y-2 relative border-drprimary/20 group-hover:border-drprimary/50">
              <div className="flex flex-col items-center text-center space-y-6 p-4">
                <div className="w-24 h-24 rounded-full bg-white/60 border border-white/80 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                   <User className="text-drprimary w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-drtext group-hover:text-drprimary transition-colors">Patient Portal</h2>
                <p className="text-drtext/70 font-medium text-lg leading-relaxed flex-grow">
                  Describe your symptoms to our intelligent AI, get a preliminary diagnostic report securely, and log health data seamlessly.
                </p>
                <button className="w-full btn-glowing rounded-xl py-4 text-lg font-bold mt-auto tracking-wide">
                  Continue as Patient
                </button>
              </div>
           </Card>
        </div>

        {/* Doctor Portal Card */}
        <div 
          onClick={() => handleRoleSelect('doctor')}
          className="group relative cursor-pointer"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-drsecondary to-drprimary rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
           <Card className="h-full transform transition-all duration-300 group-hover:-translate-y-2 relative border-drsecondary/20 group-hover:border-drsecondary/50">
              <div className="flex flex-col items-center text-center space-y-6 p-4">
                <div className="w-24 h-24 rounded-full bg-white/60 border border-white/80 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                   <Stethoscope className="text-drprimary w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-drtext group-hover:text-drprimary transition-colors">Doctor Portal</h2>
                <p className="text-drtext/70 font-medium text-lg leading-relaxed flex-grow">
                  Review AI-generated patient reports, add professional diagnostic notes, and smoothly issue digital prescriptions.
                </p>
                <div className="w-full rounded-xl py-4 text-lg font-bold mt-auto tracking-wide bg-gradient-to-r from-drsecondary to-drprimary text-[#112211] shadow-[0_0_15px_rgba(164,221,0,0.4)] group-hover:shadow-[0_0_25px_rgba(164,221,0,0.6)] group-hover:-translate-y-0.5 transition-all">
                  Continue as Doctor
                </div>
              </div>
           </Card>
        </div>

      </div>
    </div>
  );
}
