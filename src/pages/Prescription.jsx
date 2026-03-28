import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Pill, CheckCircle, Printer } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Prescription() {
  const { role, prescriptionData, setPrescriptionData } = useAppContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    duration: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const newPrescription = {
      ...formData,
      date: new Date().toLocaleDateString(),
      doctorName: "Dr. Ai"
    };
    setPrescriptionData(newPrescription);
  };

  if (role === 'patient') {
    if (!prescriptionData) return (
       <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
         <Pill className="w-16 h-16 text-base-content/20 mb-4" />
         <h2 className="text-2xl font-bold text-base-content/80">No Prescription Available</h2>
         <p className="mt-2 text-base-content/60">Your doctor has not issued a prescription yet.</p>
         <Button className="mt-6" onClick={() => navigate('/report')}>View AI Report</Button>
       </div>
    );

    return (
      <div className="max-w-2xl mx-auto p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-bold flex items-center gap-3">
             <Pill className="text-primary"/> Digital Prescription
           </h1>
           <Button variant="outline" className="btn-sm"><Printer size={16} className="mr-2"/> Print</Button>
        </div>
        <Card className="bg-base-100 border-2 border-primary/20 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Pill size={120} />
          </div>
          <div className="border-b border-base-300 pb-4 mb-4 flex justify-between">
            <div>
              <h3 className="font-bold text-lg">{prescriptionData.doctorName}</h3>
              <p className="text-sm text-base-content/70">Cardiology & General Medicine</p>
            </div>
            <div className="text-right text-sm">
              <p>Date: {prescriptionData.date}</p>
              <p>ID: #RX-{Math.floor(Math.random() * 90000) + 10000}</p>
            </div>
          </div>
          
          <div className="py-6">
            <div className="text-4xl font-serif text-primary/30 mb-4 px-2">Rx</div>
            <div className="px-6 space-y-4">
              <div>
                <h4 className="text-xl font-bold text-primary">{prescriptionData.medicineName}</h4>
                <p className="text-lg">Dosage: <span className="font-semibold">{prescriptionData.dosage}</span></p>
                <p className="text-base-content/80">Duration: {prescriptionData.duration}</p>
              </div>
              {prescriptionData.notes && (
                <div className="mt-6 p-4 bg-base-200 rounded-lg whitespace-pre-line text-sm border-l-4 border-warning">
                  <span className="font-bold">Doctor's Notes: </span><br/>
                  {prescriptionData.notes}
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-base-300 pt-4 mt-6 text-center text-xs text-base-content/50">
             This is a computer generated mock prescription for Dr. Ai demo.
          </div>
        </Card>
      </div>
    );
  }

  // Doctor Form
  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><Pill className="text-primary"/> Issue Prescription</h1>
      {prescriptionData ? (
        <Card className="text-center p-8 bg-success/10 border-success/30">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-success mb-2">Prescription Created!</h2>
          <p className="mb-6">The patient can now view this prescription on their dashboard.</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setPrescriptionData(null)}>Issue Another</Button>
            <Button variant="primary" onClick={() => navigate('/doctor')}>Back to Dashboard</Button>
          </div>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleCreate} className="space-y-6">
            <Input 
              label="Medicine Name" 
              name="medicineName" 
              value={formData.medicineName} 
              onChange={handleChange} 
              placeholder="e.g. Paracetamol 500mg" 
              required 
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Input 
                label="Dosage Instructions" 
                name="dosage" 
                value={formData.dosage} 
                onChange={handleChange} 
                placeholder="e.g. 1 pill after meals (1-1-1)" 
                required 
              />
              <Input 
                label="Duration" 
                name="duration" 
                value={formData.duration} 
                onChange={handleChange} 
                placeholder="e.g. 5 days" 
                required 
              />
            </div>
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Additional Notes (Optional)</span></label>
              <textarea 
                className="textarea textarea-bordered h-24" 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Dietary instructions, rest advised..."
              ></textarea>
            </div>
            <div className="flex justify-end pt-4 border-t border-base-300">
              <Button type="submit" variant="primary">Generate Prescription</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
