import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { ClipboardList, User, Activity, Coffee, FileHeart } from 'lucide-react';

export default function PatientDashboard() {
  const { patientData, setPatientData } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: patientData?.age || '',
    gender: patientData?.gender || '',
    weight: patientData?.weight || '',
    diet: patientData?.diet || '',
    exercise: patientData?.exercise || '',
    sleep: patientData?.sleep || '',
    waterIntake: patientData?.waterIntake || '',
    fever: patientData?.fever || 'no',
    pain: patientData?.pain || 'none',
    fatigue: patientData?.fatigue || 'no',
    digestion: patientData?.digestion || '',
    medicalHistory: patientData?.medicalHistory || '',
    medications: patientData?.medications || '',
    symptoms: patientData?.symptoms || '' // free text "current concerns"
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPatientData(formData);
    navigate('/ai-chat');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <ClipboardList className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Standard Health & Profile Form</h1>
          <p className="text-base-content/70">Please provide your health data from the recent 2–5 days.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <Card>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-base-300 pb-2">
            <User className="w-5 h-5 text-secondary" /> Basic Information
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-4">
            <Input label="Age" type="number" name="age" min="1" max="120" value={formData.age} onChange={handleChange} required placeholder="e.g. 34" />
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Gender</span></label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="select select-bordered" required>
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>
            <Input label="Weight (kg)" type="number" name="weight" min="1" max="300" step="0.1" value={formData.weight} onChange={handleChange} required placeholder="e.g. 70" />
          </div>
        </Card>

        {/* Lifestyle */}
        <Card>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-base-300 pb-2">
            <Coffee className="w-5 h-5 text-warning" /> Lifestyle (Recent 2-5 Days)
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Diet Type</span></label>
              <select name="diet" value={formData.diet} onChange={handleChange} className="select select-bordered" required>
                <option value="" disabled>Select routine diet</option>
                <option value="balanced">Balanced / Home-cooked</option>
                <option value="vegetarian">Vegetarian / Vegan</option>
                <option value="heavy_carbs">Heavy Carbs / Fast Food</option>
                <option value="dieting">Currently Dieting / Calorie Deficit</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Exercise Routine</span></label>
              <select name="exercise" value={formData.exercise} onChange={handleChange} className="select select-bordered" required>
                <option value="" disabled>Select frequency</option>
                <option value="none">Rarely / None</option>
                <option value="light">Light (1-2 days/week)</option>
                <option value="moderate">Moderate (3-4 days/week)</option>
                <option value="heavy">Heavy (5+ days/week)</option>
              </select>
            </div>
             <Input label="Sleep (Hours/night)" type="number" name="sleep" min="1" max="24" placeholder="e.g. 7" value={formData.sleep} onChange={handleChange} required />
            <Input label="Water Intake (Liters/day)" type="number" name="waterIntake" min="0.1" max="10" step="0.1" placeholder="e.g. 2.5" value={formData.waterIntake} onChange={handleChange} required />
          </div>
        </Card>

        {/* Current Symptoms Details */}
        <Card>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-base-300 pb-2">
            <Activity className="w-5 h-5 text-error" /> Symptoms & Digestion
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Fever recently?</span></label>
              <select name="fever" value={formData.fever} onChange={handleChange} className="select select-bordered" required>
                <option value="no">No Fever</option>
                <option value="mild">Mild (around 99-100°F)</option>
                <option value="high">High (above 101°F)</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Experiencing Pain?</span></label>
              <select name="pain" value={formData.pain} onChange={handleChange} className="select select-bordered" required>
                <option value="none">No pain</option>
                <option value="mild">Mild pain</option>
                <option value="moderate">Moderate pain</option>
                <option value="severe">Severe pain</option>
              </select>
            </div>
             <div className="form-control">
              <label className="label"><span className="label-text font-medium">Overall Fatigue</span></label>
              <select name="fatigue" value={formData.fatigue} onChange={handleChange} className="select select-bordered" required>
                <option value="no">Normal energy</option>
                <option value="mild">A bit tired</option>
                <option value="severe">Exhausted / Weak</option>
              </select>
            </div>
            <div className="form-control md:col-span-3">
              <label className="label"><span className="label-text font-medium">Digestion / Bowel Habits</span></label>
              <input type="text" className="input input-bordered" name="digestion" placeholder="e.g. Normal, constipated, diarrhea, upset stomach..." value={formData.digestion} onChange={handleChange} required />
            </div>
          </div>
        </Card>

        {/* Medical History & Current Input */}
        <Card>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-base-300 pb-2">
            <FileHeart className="w-5 h-5 text-info" /> Medical History & Concerns
          </h2>
          <div className="space-y-4 mt-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Past Illnesses or Chronic Conditions</span></label>
              <input type="text" className="input input-bordered" name="medicalHistory" placeholder="e.g. Diabetes, Hypertension, None" value={formData.medicalHistory} onChange={handleChange} required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Current Medications (if any)</span></label>
              <input type="text" className="input input-bordered" name="medications" placeholder="e.g. Amlodipine 5mg, None" value={formData.medications} onChange={handleChange} required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Primary Reason for Visit (Describe symptoms freely)</span></label>
              <textarea 
                className="textarea textarea-bordered h-24" 
                name="symptoms"
                placeholder="Hi Doctor, I've been feeling perfectly fine until yesterday when I got a headache..."
                value={formData.symptoms}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-4 mb-10">
          <button type="submit" className="btn-glowing rounded-xl px-12 py-4 text-xl font-bold tracking-wide">
            Consult Dr. Ai
          </button>
        </div>
      </form>
    </div>
  );
}
