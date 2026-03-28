import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Printer, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Prescription() {
  const { prescriptionData, setPrescriptionData, patientData, reportData } = useAppContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    patientName: patientData ? `Patient (Age ${patientData.age})` : '',
    diagnosis: reportData?.conditions?.[0] || '',
    medications: '',
    notes: '',
    followUp: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleIssue = () => {
    setPrescriptionData({ ...form, date: new Date().toLocaleDateString(), doctorName: 'Dr. Ai' });
  };

  if (prescriptionData) {
    return (
      <div className="max-w-xl mx-auto p-8">
        <div className="clinical-card shadow-md print:shadow-none">
          <div className="border-b border-gray-100 pb-5 mb-5 flex justify-between items-start">
            <div>
              <div className="text-xl font-black" style={{ color: '#2d6a00' }}>Dr. Ai</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Clinical Intelligence · Rx</div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div>{prescriptionData.date}</div>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <Row label="Patient" value={prescriptionData.patientName} />
            <Row label="Diagnosis" value={prescriptionData.diagnosis} />
            <Row label="Prescribed Medications" value={prescriptionData.medications} />
            {prescriptionData.notes && <Row label="Clinical Notes" value={prescriptionData.notes} />}
            {prescriptionData.followUp && <Row label="Follow-Up" value={prescriptionData.followUp} />}
          </div>

          <div className="border-t border-gray-100 pt-5 mt-5 flex justify-between items-end">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <ShieldCheck size={12} style={{ color: '#2d6a00' }} />
              HIPAA Compliant · Dr. Ai Clinical Systems
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 italic font-semibold">{prescriptionData.doctorName}</div>
              <div className="text-xs text-gray-300">Digital Signature</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6 no-print">
          <button className="btn-outline" onClick={() => navigate('/doctor')}>Back</button>
          <button className="btn-primary" onClick={() => window.print()}>
            <Printer size={15} /> Print Rx
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Issue Prescription</h1>
        <p className="text-sm text-gray-400 mt-1">Generate a digital Rx based on the AI clinical summary.</p>
      </div>

      <div className="clinical-card space-y-5">
        <Field label="Patient Name">
          <input className="clinical-input" value={form.patientName} onChange={e => set('patientName', e.target.value)} />
        </Field>
        <Field label="Primary Diagnosis">
          <input className="clinical-input" value={form.diagnosis} onChange={e => set('diagnosis', e.target.value)} />
        </Field>
        <Field label="Medications & Dosage">
          <textarea className="clinical-input" rows={3} placeholder="e.g. Paracetamol 500mg twice daily, Ibuprofen 400mg after meals..."
            value={form.medications} onChange={e => set('medications', e.target.value)} style={{ resize: 'vertical' }} />
        </Field>
        <Field label="Clinical Notes (Optional)">
          <textarea className="clinical-input" rows={2} placeholder="Additional instructions..."
            value={form.notes} onChange={e => set('notes', e.target.value)} style={{ resize: 'vertical' }} />
        </Field>
        <Field label="Follow-Up Instructions (Optional)">
          <input className="clinical-input" placeholder="e.g. Return in 7 days if no improvement" value={form.followUp} onChange={e => set('followUp', e.target.value)} />
        </Field>

        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <ShieldCheck size={12} style={{ color: '#2d6a00' }} /> HIPAA-secured prescription
          </div>
          <button className="btn-primary" onClick={handleIssue}>
            <CheckCircle size={15} /> Issue Prescription
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">{label}</div>
      <div className="text-gray-800 font-medium">{value || '—'}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
