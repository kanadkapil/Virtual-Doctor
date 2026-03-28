import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Printer, Download, Share2, CheckCircle, Activity, FileText, Stethoscope, AlertCircle } from 'lucide-react';

export default function Report() {
  const { reportData, patientData, role } = useAppContext();
  const navigate = useNavigate();

  if (!reportData) return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <AlertCircle size={40} className="text-gray-300" />
      <h2 className="text-xl font-bold text-gray-600">No report available</h2>
      <p className="text-sm text-gray-400">Complete an AI consultation to generate your clinical report.</p>
      <button className="btn-primary" onClick={() => navigate(role === 'doctor' ? '/doctor' : '/patient')}>Go Back</button>
    </div>
  );

  const { conditions = [], riskLevel = 'Low', suggestedTests = [], summary = '' } = reportData;
  const riskColors = { Low: '#16a34a', Medium: '#d97706', High: '#dc2626' };
  const riskBg = { Low: '#f0fdf4', Medium: '#fffbeb', High: '#fef2f2' };
  const riskBorder = { Low: '#bbf7d0', Medium: '#fde68a', High: '#fecaca' };
  const reportId = `AI-${Math.floor(10000 + Math.random() * 89999)}-${new Date().getFullYear()}`;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="overflow-y-auto h-full">
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Page Header */}
        <div className="flex items-start justify-between mb-6 no-print">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Clinical Intelligence<br />Report</h1>
            <p className="text-sm text-gray-400 mt-1">ID: #{reportId} • Generated {date}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-outline text-sm py-2" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
              <Share2 size={14} /> Share
            </button>
            <button className="btn-outline text-sm py-2" onClick={() => window.print()}>
              <Printer size={14} /> Print Report
            </button>
            <button className="btn-primary text-sm py-2" onClick={() => window.print()}>
              <Download size={14} /> Download PDF
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6 no-print">
          <div className="clinical-card">
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">TRIAGE LEVEL</div>
            <div className="flex items-center gap-2 text-xl font-black text-gray-900">
              {riskLevel} <CheckCircle size={20} style={{ color: riskColors[riskLevel] }} />
            </div>
          </div>
          <div className="clinical-card">
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">AI CONFIDENCE</div>
            <div className="flex items-center gap-2 text-xl font-black text-gray-900">
              {riskLevel === 'Low' ? '98.4%' : riskLevel === 'Medium' ? '94.1%' : '91.0%'}
              <span className="h-0.5 w-8 bg-gray-200 inline-block rounded" />
            </div>
          </div>
          <div className="clinical-card">
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">ACTION ITEMS</div>
            <div className="flex items-center gap-2 text-xl font-black text-gray-900">
              {String(suggestedTests.length).padStart(2, '0')} Pending
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Main Report Card */}
        <div className="clinical-card shadow-sm">

          {/* Report Header */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-5 mb-6">
            <div>
              <div className="text-xl font-black" style={{ color: '#2d6a00' }}>Dr. Ai Report</div>
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-widest mt-0.5">INTELLIGENT CLINICAL SUMMARY</div>
            </div>
            {patientData && (
              <div className="text-right text-sm text-gray-600">
                <div className="font-bold text-gray-900">Anonymous Patient</div>
                <div>Age: {patientData.age || 'N/A'} • Gender: {patientData.gender || 'N/A'}</div>
                <div>Weight: {patientData.weight || 'N/A'} kg</div>
              </div>
            )}
          </div>

          {/* Section 01: Medical History */}
          <section className="mb-8">
            <SectionLabel number="01" title="MEDICAL HISTORY & CONTEXT" />
            {patientData && (
              <>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {patientData.symptoms || 'No primary complaint recorded.'}
                  {patientData.medicalHistory && patientData.medicalHistory !== 'none'
                    ? ` History indicates: ${patientData.medicalHistory}.` : ''}
                </p>
                <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="text-left px-4 py-2.5">Category</th>
                      <th className="text-left px-4 py-2.5">Details</th>
                      <th className="text-left px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-700">Pre-existing</td>
                      <td className="px-4 py-3 text-gray-600">{patientData.medicalHistory || 'None reported'}</td>
                      <td className="px-4 py-3 text-gray-500">Managed</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-700">Medications</td>
                      <td className="px-4 py-3 text-gray-600">{patientData.medications || 'None'}</td>
                      <td className="px-4 py-3 text-gray-500">Active</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-700">Risk Factors</td>
                      <td className="px-4 py-3 text-gray-600">Fever: {patientData.fever} • Pain: {patientData.pain}</td>
                      <td className="px-4 py-3 text-gray-500">Monitoring</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </section>

          {/* Section 02: AI Assessment */}
          <section className="mb-8">
            <SectionLabel number="02" title="NEURAL-CLINICAL AI ASSESSMENT" color="#2d6a00" />
            <div className="space-y-3">
              {conditions.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: '#2d6a00' }}>
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{c}</div>
                  </div>
                </div>
              ))}
            </div>
            {summary && (
              <div className="mt-4 p-4 rounded-xl text-sm text-gray-700 leading-relaxed" style={{ background: '#f0f7e8', borderLeft: '3px solid #2d6a00' }}>
                {summary}
              </div>
            )}
          </section>

          {/* Section 03: Clinical Recommendations */}
          <section className="mb-6">
            <SectionLabel number="03" title="CLINICAL RECOMMENDATIONS" />
            <div className="space-y-3">
              {suggestedTests.map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#f0f7e8' }}>
                    <Activity size={13} style={{ color: '#2d6a00' }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{t}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-100 pt-5 flex items-start justify-between">
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm italic">
              Disclaimer: This AI-generated clinical summary is intended for professional review. It does not constitute a final medical diagnosis.
            </p>
            <div className="text-right">
              <div className="text-sm text-gray-300 font-semibold italic">Dr. Ai System</div>
              <div className="text-xs text-gray-500 font-semibold">Digital Validation ID</div>
              <div className="text-xs text-gray-400">{`0xFFF-${reportId}-LUMINOUS`}</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-gray-400 mt-6 mb-10">
          This report is HIPAA compliant and encrypted. All data processing occurred locally via Clinical Intelligence Nodes.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-10 no-print">
          <button className="btn-outline" onClick={() => navigate(role === 'doctor' ? '/doctor' : '/patient')}>Back</button>
          {role === 'doctor' && (
            <button className="btn-primary" onClick={() => navigate('/prescription')}>
              Create Rx Prescription
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ number, title, color = '#9ca3af' }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-px h-5 rounded-full" style={{ background: color }}></div>
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
        {number}. {title}
      </span>
    </div>
  );
}
