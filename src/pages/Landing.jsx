import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { User, Stethoscope, Zap, ArrowRight, LogIn, ShieldCheck } from 'lucide-react';

export default function Landing() {
  const { setRole } = useAppContext();
  const navigate = useNavigate();

  const handleRole = (role) => {
    setRole(role);
    navigate(role === 'patient' ? '/patient' : '/doctor');
  };

  return (
    <div className="min-h-full bg-white overflow-y-auto">

      {/* Top Nav */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <span className="text-xl font-bold text-gray-900">Dr. Ai</span>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <a href="#" className="underline underline-offset-4" style={{color:'#2d6a00'}}>Dashboard</a>
          <a href="#" className="hover:text-gray-900">AI Assistant</a>
          <a href="#" className="hover:text-gray-900">Reports</a>
          <a href="#" className="hover:text-gray-900">Help</a>
        </nav>
        <button
          onClick={() => handleRole('patient')}
          className="btn-outline text-sm"
        >
          Role: Patient
        </button>
      </header>

      {/* Hero */}
      <section className="px-8 pt-16 pb-10 max-w-2xl">
        <h1 className="text-5xl font-black leading-tight text-gray-900 mb-4">
          Your Empathetic<br />
          <span style={{color:'#2d6a00'}}>AI Medical Partner</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
          Professional, intelligent tele-triage to help you understand your symptoms instantly.
          Get the clarity you need before stepping into the clinic.
        </p>
        <div className="flex gap-3">
          <button className="btn-primary text-base px-6 py-3" onClick={() => handleRole('patient')}>
            Get Started Now
          </button>
          <button className="btn-outline text-base px-6 py-3">
            How it Works
          </button>
        </div>
      </section>

      {/* Role Cards */}
      <section className="px-8 pb-12">
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
          <div
            onClick={() => handleRole('patient')}
            className="clinical-card cursor-pointer hover:border-green-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{background:'#f0f7e8'}}>
              <User size={22} style={{color:'#2d6a00'}} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">I am a Patient</h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Log symptoms, chat with Dr. Ai, and receive a preliminary triage report to share with your clinician.
            </p>
            <div className="flex items-center gap-1.5 font-semibold text-sm" style={{color:'#2d6a00'}}>
              Begin My Consultation <ArrowRight size={15} />
            </div>
          </div>

          <div
            onClick={() => handleRole('doctor')}
            className="clinical-card cursor-pointer hover:border-green-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{background:'#f0f7e8'}}>
              <Stethoscope size={22} style={{color:'#2d6a00'}} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">I am a Provider</h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Access your dashboard, review patient triage reports, and integrate clinical intelligence into your workflow.
            </p>
            <div className="flex items-center gap-1.5 font-semibold text-sm" style={{color:'#2d6a00'}}>
              Provider Portal <LogIn size={15} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-8 pb-10">
        <div className="max-w-3xl grid grid-cols-2 gap-4">
          <div className="clinical-card" style={{background:'#f8fdf3'}}>
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">PRECISION</div>
            <div className="text-4xl font-black text-gray-900 mb-1">98%</div>
            <div className="text-base font-bold text-gray-700 mb-2">Triage Accuracy</div>
            <p className="text-sm text-gray-500">Built on clinical datasets and fine-tuned by practicing medical professionals.</p>
          </div>
          <div className="rounded-2xl flex flex-col items-center justify-center py-10 gap-3" style={{background:'#2d6a00'}}>
            <Zap size={36} className="text-white" />
            <div className="text-white text-center">
              <div className="text-2xl font-black">2-Minute</div>
              <div className="text-base font-semibold opacity-90">Analysis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial image block */}
      <section className="px-8 pb-12">
        <div className="max-w-3xl rounded-2xl overflow-hidden relative" style={{background:'#7bc8c8', minHeight:'220px'}}>
          <div className="absolute bottom-6 left-6 bg-white rounded-xl p-4 max-w-xs shadow-lg">
            <p className="text-sm text-gray-700 italic mb-2">
              "Dr. Ai provided immediate calm and clear direction during a late-night health scare. It's the future of triage."
            </p>
            <p className="text-xs font-semibold text-gray-500">— Sarah J., Patient User</p>
          </div>
        </div>
      </section>

      {/* Trust logos */}
      <section className="px-8 pb-10 border-t border-gray-100 pt-8">
        <p className="text-xs text-center text-gray-400 uppercase tracking-widest mb-6">Trusted by Clinical Systems Worldwide</p>
        <div className="flex items-center justify-center gap-12 text-gray-300 font-bold text-sm tracking-widest">
          <span>CLINIC_NET</span>
          <span>MEDIFLOW</span>
          <span>BIO_SYNC</span>
          <span>AURA_HEALTH</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-5 flex justify-between items-center text-xs text-gray-400">
        <span>© 2024 DR. AI CLINICAL SYSTEMS. HIPAA COMPLIANT.</span>
        <div className="flex gap-5">
          <a href="#" className="hover:text-gray-600">PRIVACY POLICY</a>
          <a href="#" className="hover:text-gray-600">TERMS OF SERVICE</a>
          <a href="#" className="hover:text-gray-600">ACCESSIBILITY</a>
          <a href="#" className="hover:text-gray-600">CONTACT SUPPORT</a>
        </div>
      </footer>
    </div>
  );
}
