import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FileText, AlertTriangle, Activity, Pill, Printer, FileHeart, Stethoscope } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

export default function Report() {
  const { reportData, patientData, role } = useAppContext();
  const navigate = useNavigate();

  if (!reportData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">No report found</h2>
        <Button onClick={() => navigate(role === 'patient' ? '/patient' : '/doctor')}>Go Back</Button>
      </div>
    );
  }

  const { conditions, riskLevel, suggestedTests, summary } = reportData;

  const riskColorMap = {
    Low: 'success',
    Medium: 'warning',
    High: 'error'
  };

  const currentDate = new Date().toLocaleString();

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-6 animate-fade-in-up print:p-0 print:m-0">
      
      {/* Hide controls on print */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div className="flex items-center gap-3">
           <FileText className="w-8 h-8 text-primary" />
           <div>
             <h1 className="text-3xl font-bold">Clinical AI Summary</h1>
             <p className="text-base-content/70">Structured medical summary mapping chat insights.</p>
           </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => window.print()}>
              <Printer size={18} className="mr-2" /> Download/Print
           </Button>
        </div>
      </div>

      <Card className="bg-base-100 border border-primary/20 p-2 sm:p-8 relative overflow-hidden print:border-none print:shadow-none print:p-0">
        
        {/* Prescription Header Styling */}
        <div className="border-b-4 border-primary pb-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
           <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                 <Stethoscope className="w-10 h-10" />
                 <span className="text-2xl font-bold font-serif tracking-wide uppercase">Dr. Ai Portal</span>
              </div>
              <p className="text-sm font-semibold opacity-70">Automated Intake & Tele-Triage Summary</p>
           </div>
           <div className="text-left sm:text-right text-sm">
             <p><strong>Date:</strong> {currentDate}</p>
             <p><strong>Ref Code:</strong> RX-{Math.floor(100000 + Math.random() * 900000)}</p>
           </div>
        </div>

        {/* Patient Registration Block */}
        <div className="bg-base-200 p-4 rounded-xl mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border border-base-300">
           <div><p className="text-base-content/50 text-xs">Patient Age</p> <p className="font-bold">{patientData?.age || 'N/A'} yrs</p></div>
           <div><p className="text-base-content/50 text-xs">Gender</p> <p className="font-bold capitalize">{patientData?.gender || 'N/A'}</p></div>
           <div><p className="text-base-content/50 text-xs">Weight</p> <p className="font-bold">{patientData?.weight || 'N/A'} kg</p></div>
           <div><p className="text-base-content/50 text-xs">Vitals Focus</p> <Badge color={riskColorMap[riskLevel]}>{riskLevel} Risk</Badge></div>
        </div>

        {/* Clinical Summary Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
           {/* Left Column: Intake Summary */}
           <div className="space-y-6">
              
              <div>
                 <h3 className="text-lg font-bold border-b border-base-300 pb-2 mb-3 flex items-center gap-2">
                    <FileHeart className="w-5 h-5 text-secondary" /> Initial Symptoms & Vitals
                 </h3>
                 <ul className="space-y-2 text-sm">
                    <li><strong className="opacity-70">Fever Map:</strong> <span className="capitalize">{patientData?.fever}</span></li>
                    <li><strong className="opacity-70">Pain Level:</strong> <span className="capitalize">{patientData?.pain}</span></li>
                    <li><strong className="opacity-70">Fatigue:</strong> <span className="capitalize">{patientData?.fatigue}</span></li>
                    <li><strong className="opacity-70">Primary Concerns:</strong> <br/> {patientData?.symptoms}</li>
                 </ul>
              </div>

              <div>
                 <h3 className="text-lg font-bold border-b border-base-300 pb-2 mb-3">Lifestyle & History</h3>
                 <ul className="space-y-1 text-sm">
                    <li><strong className="opacity-70">Diet & Water:</strong> {patientData?.diet}, {patientData?.waterIntake}L</li>
                    <li><strong className="opacity-70">Medical History:</strong> {patientData?.medicalHistory || 'None'}</li>
                    <li><strong className="opacity-70">Medications:</strong> {patientData?.medications || 'None'}</li>
                 </ul>
              </div>
           </div>

           {/* Right Column: AI Triage Output */}
           <div className="space-y-6">
              
              <div className="bg-primary/5 p-5 rounded-xl border border-primary/20">
                 <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5" /> Differential Suspicions
                 </h3>
                 <p className="text-xs text-base-content/60 mb-3 italic">Logical assumptions, not definitive final diagnoses.</p>
                 <ul className="list-disc list-inside space-y-1 font-medium">
                   {conditions.map((c, i) => <li key={i}>{c}</li>)}
                 </ul>
              </div>

              <div className="bg-base-200 p-5 rounded-xl">
                 <h3 className="flex items-center gap-2 font-bold mb-2">
                   <Pill className="text-warning w-5 h-5" /> Recommended Next Steps
                 </h3>
                 <ul className="list-disc list-inside space-y-1 text-sm">
                   {suggestedTests.map((t, i) => <li key={i}>{t}</li>)}
                 </ul>
              </div>

           </div>
        </div>

        {/* Contextual Narrative */}
        <div className="border-t-2 border-dashed border-base-300 pt-6">
           <h3 className="font-bold mb-2 text-lg">AI Observations & Narrative</h3>
           <p className="leading-relaxed opacity-90 text-sm whitespace-pre-wrap">{summary}</p>
        </div>

      </Card>

      <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-base-300 print:hidden">
        <Button variant="outline" onClick={() => navigate(role === 'patient' ? '/patient' : '/doctor')}>Back</Button>
        {role === 'doctor' && (
          <Button variant="primary" onClick={() => navigate('/prescription')}>
            Create Rx Prescription
          </Button>
        )}
      </div>
    </div>
  );
}
