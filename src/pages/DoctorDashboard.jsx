import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Users, FileText, ClipboardList } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function DoctorDashboard() {
  const { patientData, reportData, prescriptionData } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto p-6 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Users className="text-secondary w-8 h-8" />
          Doctor Dashboard
        </h1>
        <p className="text-base-content/70">Welcome Dr. Ai! Here is your patient queue.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient List (Mock) */}
        <div className="lg:col-span-1 space-y-4 z-10">
           <h2 className="text-xl font-semibold mb-4 px-2">Active Patients</h2>
           <Card className="cursor-pointer border-secondary shadow-md relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
             <div className="flex justify-between items-start mb-2">
               <div>
                 <h3 className="font-bold">John Doe</h3>
                 <p className="text-xs text-base-content/60">ID #29381</p>
               </div>
               <Badge color={reportData ? reportData.riskLevel === 'High' ? 'error' : 'warning' : 'info'} className="text-xs p-2">
                  {reportData ? `${reportData.riskLevel} Risk` : 'New Patient'}
               </Badge>
             </div>
             <p className="text-sm truncate opacity-80 mb-3">
               {patientData?.symptoms ? `Symptoms: ${patientData.symptoms}` : 'Waiting for symptoms submission...'}
             </p>
             <div className="text-xs font-semibold text-secondary">Currently Selected</div>
           </Card>

           <Card className="opacity-50 pointer-events-none">
             <div className="flex justify-between items-start mb-2">
               <div>
                 <h3 className="font-bold">Jane Smith</h3>
                 <p className="text-xs text-base-content/60">ID #29382</p>
               </div>
               <Badge color="success" className="text-xs p-2">Low Risk</Badge>
             </div>
             <p className="text-sm truncate">Follow up check-up...</p>
           </Card>
        </div>

        {/* Selected Patient Details */}
        <div className="lg:col-span-2">
           <Card className="h-full" noPadding>
             {!patientData ? (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <ClipboardList className="w-16 h-16 text-base-content/10 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Active Data</h3>
                  <p className="text-base-content/50">The patient has not submitted their health profile yet.</p>
                </div>
             ) : (
                <div className="p-6">
                  <div className="flex justify-between items-end border-b border-base-300 pb-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-secondary">John Doe</h2>
                      <div className="flex gap-4 mt-2 text-sm text-base-content/70">
                        <span>Age: 34</span>
                        <span>Gender: M</span>
                        <span>Blood: O+</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8 mb-8">
                     <div>
                       <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                         <ClipboardList className="w-5 h-5" /> Patient Intake
                       </h3>
                       <div className="bg-base-200 p-4 rounded-lg text-sm space-y-2">
                         <p><strong>Diet:</strong> <span className="capitalize">{patientData.diet}</span></p>
                         <p><strong>Exercise:</strong> <span className="capitalize">{patientData.exercise}</span></p>
                         <p><strong>Sleep:</strong> {patientData.sleep} hrs</p>
                         <p><strong>Symptoms:</strong> {patientData.symptoms}</p>
                       </div>
                     </div>

                     <div className="space-y-4">
                       <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                         <FileText className="w-5 h-5" /> AI Actions
                       </h3>
                       
                       {reportData ? (
                         <Button className="w-full justify-between" onClick={() => navigate('/report')}>
                           Review AI Report <span className="badge badge-sm badge-secondary">Ready</span>
                         </Button>
                       ) : (
                         <div className="p-4 bg-base-200/50 rounded-lg text-center text-sm border border-dashed border-base-300">
                           AI Diagnosis in progress...
                         </div>
                       )}

                       {prescriptionData ? (
                         <Button className="w-full justify-between" variant="outline" onClick={() => navigate('/prescription')}>
                           View Prescription <span className="badge badge-sm badge-success">Done</span>
                         </Button>
                       ) : (
                         <Button 
                           className="w-full justify-between" 
                           variant="primary" 
                           disabled={!reportData} 
                           onClick={() => navigate('/prescription')}
                         >
                           Issue Prescription {reportData && <span className="badge badge-sm">Required</span>}
                         </Button>
                       )}
                     </div>
                  </div>
                </div>
             )}
           </Card>
        </div>
      </div>
    </div>
  );
}
