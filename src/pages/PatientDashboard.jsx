import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Activity, Thermometer, Heart, User, ShieldCheck, ArrowRight, Minus, Plus } from 'lucide-react';

const TOTAL_STEPS = 4;

export default function PatientDashboard() {
  const { setPatientData } = useAppContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    age: '', gender: 'male', weight: '',
    temperature: '', heartRate: '', systolic: '', diastolic: '',
    painArea: 'abdomen', painIntensity: '5', painQuality: [],
    exercise: '1-2 times', sleep: 7, stress: 5,
    diet: 'balanced', waterIntake: '2',
    fever: 'no', pain: 'none', fatigue: 'mild',
    digestion: 'normal',
    symptoms: '', medicalHistory: 'none', medications: 'none',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const togglePainQuality = (q) => {
    set('painQuality', form.painQuality.includes(q)
      ? form.painQuality.filter(x => x !== q)
      : [...form.painQuality, q]
    );
  };

  const percent = Math.round((step / TOTAL_STEPS) * 100);

  const handleSubmit = () => {
    setPatientData(form);
    navigate('/ai-chat');
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 bg-white">
          <h1 className="text-3xl font-black text-gray-900">
            Patient Intake: <span style={{ color: '#2d6a00' }}>Help us understand your symptoms.</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Complete this clinical intake form to provide Dr. Ai with the context needed for an accurate preliminary triage.</p>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-gray-500 mb-1">
            <span style={{ color: '#2d6a00' }}>PROGRESS: {percent}% COMPLETE</span>
            <span>Step {step} of {TOTAL_STEPS}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="animate-in space-y-6">
              <SectionHeader icon={<User size={18} />} title="Basic Information" />
              <div className="clinical-card space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Age">
                    <input className="clinical-input" type="number" placeholder="e.g. 28" value={form.age} onChange={e => set('age', e.target.value)} />
                  </FormField>
                  <FormField label="Gender">
                    <select className="clinical-input" value={form.gender} onChange={e => set('gender', e.target.value)}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FormField>
                  <FormField label="Weight (kg)">
                    <input className="clinical-input" type="number" placeholder="e.g. 68" value={form.weight} onChange={e => set('weight', e.target.value)} />
                  </FormField>
                </div>
                <FormField label="Primary Symptoms / Chief Complaint">
                  <textarea
                    className="clinical-input"
                    rows={3}
                    placeholder="Describe what you are experiencing..."
                    value={form.symptoms}
                    onChange={e => set('symptoms', e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* Step 2: Clinical Vitals */}
          {step === 2 && (
            <div className="animate-in space-y-6">
              <SectionHeader icon={<Activity size={18} />} title="Clinical Vitals" />
              <div className="clinical-card space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Current Body Temperature (°F)">
                    <input className="clinical-input" placeholder="e.g. 98.6" value={form.temperature} onChange={e => set('temperature', e.target.value)} />
                  </FormField>
                  <FormField label="Resting Heart Rate (BPM)">
                    <input className="clinical-input" placeholder="e.g. 72" value={form.heartRate} onChange={e => set('heartRate', e.target.value)} />
                  </FormField>
                  <FormField label="Systolic Blood Pressure">
                    <input className="clinical-input" placeholder="e.g. 120" value={form.systolic} onChange={e => set('systolic', e.target.value)} />
                  </FormField>
                  <FormField label="Diastolic Blood Pressure">
                    <input className="clinical-input" placeholder="e.g. 80" value={form.diastolic} onChange={e => set('diastolic', e.target.value)} />
                  </FormField>
                </div>
              </div>

              <SectionHeader icon={<Thermometer size={18} />} title="Symptom Localization" />
              <div className="clinical-card space-y-5">
                <FormField label="Fever">
                  <select className="clinical-input" value={form.fever} onChange={e => set('fever', e.target.value)}>
                    <option value="no">No Fever</option>
                    <option value="mild">Mild (99-100°F)</option>
                    <option value="high">High (above 101°F)</option>
                  </select>
                </FormField>
                <FormField label="Pain Level">
                  <select className="clinical-input" value={form.pain} onChange={e => set('pain', e.target.value)}>
                    <option value="none">No pain</option>
                    <option value="mild">Mild pain</option>
                    <option value="moderate">Moderate pain</option>
                    <option value="severe">Severe pain</option>
                  </select>
                </FormField>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pain Intensity (1–10)</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <button key={n} onClick={() => set('painIntensity', String(n))}
                        className={`w-9 h-9 rounded-full text-sm font-semibold border transition-all
                          ${form.painIntensity === String(n)
                            ? 'text-white border-transparent' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-green-400'}`}
                        style={form.painIntensity === String(n) ? { background: '#2d6a00' } : {}}
                      >{n}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pain Quality</label>
                  <div className="flex flex-wrap gap-2">
                    {['Sharp', 'Dull Ache', 'Burning', 'Throbbing', 'Stabbing'].map(q => (
                      <button key={q} onClick={() => togglePainQuality(q)}
                        className={`chip ${form.painQuality.includes(q) ? 'bg-green-50 border-green-500 font-bold' : ''}`}
                      >{q}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Lifestyle */}
          {step === 3 && (
            <div className="animate-in space-y-6">
              <SectionHeader icon={<Heart size={18} />} title="Daily Habits & Environment" />
              <div className="clinical-card space-y-4">
                {/* Exercise */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Physical Activity</div>
                    <div className="text-xs text-gray-400">How often did you exercise this week?</div>
                  </div>
                  <select className="clinical-input w-36 text-sm" value={form.exercise} onChange={e => set('exercise', e.target.value)}>
                    <option>Not at all</option>
                    <option>1-2 times</option>
                    <option>3-4 times</option>
                    <option>Daily</option>
                  </select>
                </div>
                <hr className="border-gray-100" />

                {/* Sleep stepper */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Sleep Quality</div>
                    <div className="text-xs text-gray-400">Average hours per night</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => set('sleep', Math.max(1, form.sleep - 1))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                      <Minus size={14} />
                    </button>
                    <span className="text-lg font-bold w-6 text-center">{form.sleep}</span>
                    <button onClick={() => set('sleep', Math.min(14, form.sleep + 1))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <hr className="border-gray-100" />

                {/* Stress range */}
                <div className="py-2">
                  <div className="text-sm font-semibold text-gray-800 mb-1">Recent Stress Levels</div>
                  <div className="text-xs text-gray-400 mb-3">Drag to indicate how you've felt lately</div>
                  <input type="range" min="1" max="10" value={form.stress} onChange={e => set('stress', Number(e.target.value))}
                    className="w-full accent-green-700" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>SERENE</span>
                    <span>HIGHLY STRESSED</span>
                  </div>
                </div>
                <hr className="border-gray-100" />

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <FormField label="Diet Pattern">
                    <select className="clinical-input" value={form.diet} onChange={e => set('diet', e.target.value)}>
                      <option value="balanced">Balanced</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="keto">Keto</option>
                      <option value="junk">Mostly Fast Food</option>
                    </select>
                  </FormField>
                  <FormField label="Water Intake (L/day)">
                    <input className="clinical-input" placeholder="e.g. 2" value={form.waterIntake} onChange={e => set('waterIntake', e.target.value)} />
                  </FormField>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Medical history */}
          {step === 4 && (
            <div className="animate-in space-y-6">
              <SectionHeader icon={<ShieldCheck size={18} />} title="Medical History & Medications" />
              <div className="clinical-card space-y-5">
                <FormField label="Fatigue Level">
                  <select className="clinical-input" value={form.fatigue} onChange={e => set('fatigue', e.target.value)}>
                    <option value="none">No fatigue</option>
                    <option value="mild">Mild fatigue</option>
                    <option value="moderate">Moderate fatigue</option>
                    <option value="severe">Severe fatigue</option>
                  </select>
                </FormField>
                <FormField label="Digestion Issues">
                  <select className="clinical-input" value={form.digestion} onChange={e => set('digestion', e.target.value)}>
                    <option value="normal">Normal</option>
                    <option value="constipation">Constipation</option>
                    <option value="diarrhea">Diarrhea</option>
                    <option value="bloating">Bloating</option>
                    <option value="nausea">Nausea</option>
                  </select>
                </FormField>
                <FormField label="Known Medical History / Pre-existing Conditions">
                  <textarea className="clinical-input" rows={2} placeholder="e.g. Hypertension, Diabetes…"
                    value={form.medicalHistory} onChange={e => set('medicalHistory', e.target.value)} style={{ resize: 'vertical' }} />
                </FormField>
                <FormField label="Current Medications">
                  <textarea className="clinical-input" rows={2} placeholder="e.g. Metformin 500mg, Aspirin…"
                    value={form.medications} onChange={e => set('medications', e.target.value)} style={{ resize: 'vertical' }} />
                </FormField>
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex items-center justify-between pt-4 pb-12">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck size={14} style={{ color: '#2d6a00' }} />
              <span>Clinical Privacy Guard — Your data is HIPAA-secured and encrypted.</span>
            </div>
            <div className="flex gap-3">
              {step > 1 && (
                <button className="btn-outline" onClick={() => setStep(s => s - 1)}>Back</button>
              )}
              {step < TOTAL_STEPS ? (
                <button className="btn-primary" onClick={() => setStep(s => s + 1)}>
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button className="btn-primary" onClick={handleSubmit}>
                  Consult Dr. Ai 🤖
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2.5">
      <span style={{ color: '#2d6a00' }}>{icon}</span>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
