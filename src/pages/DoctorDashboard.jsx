import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Users, FileText, Bot, Plus, ArrowRight, Clock } from 'lucide-react';

const MOCK_PATIENTS = [
  { id: 'PT-001', name: 'Sarah Johnson', age: 34, issue: 'Recurring headache, light sensitivity', time: '10:42 AM', risk: 'Medium' },
  { id: 'PT-002', name: 'Alex Kumar', age: 28, issue: 'Chest tightness after exercise', time: '11:15 AM', risk: 'High' },
  { id: 'PT-003', name: 'Maria Chen', age: 52, issue: 'Fatigue and mild fever for 3 days', time: '11:50 AM', risk: 'Low' },
];

const riskColors = { Low: '#16a34a', Medium: '#d97706', High: '#dc2626' };
const riskBg    = { Low: '#f0fdf4', Medium: '#fffbeb', High: '#fef2f2' };

export default function DoctorDashboard() {
  const { reportData } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Doctor Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome, Provider. Here is your patient queue for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active Patients', value: '3', icon: <Users size={20} style={{ color: '#2d6a00' }} /> },
          { label: 'Reports Ready', value: reportData ? '1' : '0', icon: <FileText size={20} style={{ color: '#2d6a00' }} /> },
          { label: 'AI Consultations', value: '12', icon: <Bot size={20} style={{ color: '#2d6a00' }} /> },
        ].map(s => (
          <div key={s.label} className="clinical-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#f0f7e8' }}>
              {s.icon}
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400 font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Queue */}
      <div className="clinical-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Patient Queue</h2>
          <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 font-semibold">
            {MOCK_PATIENTS.length} Waiting
          </span>
        </div>
        <div className="space-y-3">
          {MOCK_PATIENTS.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.age} yrs • {p.issue}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={11} /> {p.time}
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: riskColors[p.risk], background: riskBg[p.risk] }}>
                  {p.risk}
                </span>
                <button className="btn-ghost-green" onClick={() => navigate('/report')}>
                  View Report <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="clinical-card text-left hover:border-green-200 transition-colors group" onClick={() => navigate('/report')}>
          <FileText size={20} style={{ color: '#2d6a00' }} className="mb-2" />
          <div className="font-bold text-gray-900">View AI Report</div>
          <div className="text-xs text-gray-400 mt-1">Review the latest AI clinical summary</div>
        </button>
        <button className="clinical-card text-left hover:border-green-200 transition-colors group" onClick={() => navigate('/prescription')}>
          <Plus size={20} style={{ color: '#2d6a00' }} className="mb-2" />
          <div className="font-bold text-gray-900">Issue Prescription</div>
          <div className="text-xs text-gray-400 mt-1">Generate a digital Rx for a patient</div>
        </button>
      </div>
    </div>
  );
}
