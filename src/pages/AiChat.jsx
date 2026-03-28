import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAI } from '../hooks/useAI';
import { Bot, User, Send, AlertTriangle, Paperclip, Globe, Edit3, ShieldCheck, Loader2 } from 'lucide-react';

export default function AiChat() {
  const { patientData, setPatientData, patientLanguage, setPatientLanguage, aiChatHistory, setAiChatHistory, setReportData } = useAppContext();
  const navigate = useNavigate();
  const { isProcessing, sendToOpenAI } = useAI();

  const [messages, setMessages] = useState(aiChatHistory.length ? aiChatHistory : []);
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);

  // Edit intake modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(patientData || {});

  const messagesEndRef = useRef(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isProcessing]);
  useEffect(() => { if (messages.length === 0) startAIChat(); }, []);

  // Fake progress animation while AI generating report
  useEffect(() => {
    if (!generating) { setGenProgress(0); return; }
    const interval = setInterval(() => {
      setGenProgress(p => p < 90 ? p + Math.random() * 8 : p);
    }, 400);
    return () => clearInterval(interval);
  }, [generating]);

  const getSystemPrompt = () => ({
    role: 'system',
    content: `You are a highly empathetic, calm, and efficient AI healthcare assistant named Dr. Ai.
LANGUAGE: ${patientLanguage}. Always respond in ${patientLanguage}. 

PATIENT INTAKE DATA:
- Age: ${patientData?.age}, Gender: ${patientData?.gender}, Weight: ${patientData?.weight}kg
- Temperature: ${patientData?.temperature}°F, Heart Rate: ${patientData?.heartRate}bpm
- Blood Pressure: ${patientData?.systolic}/${patientData?.diastolic}
- Fever: ${patientData?.fever}, Pain: ${patientData?.pain} (Intensity: ${patientData?.painIntensity}/10)
- Pain Quality: ${patientData?.painQuality?.join(', ') || 'Not specified'}
- Fatigue: ${patientData?.fatigue}, Digestion: ${patientData?.digestion}
- Sleep: ${patientData?.sleep}hrs, Exercise: ${patientData?.exercise}, Stress: ${patientData?.stress}/10
- Diet: ${patientData?.diet}, Water: ${patientData?.waterIntake}L/day
- Chief Complaint: ${patientData?.symptoms || 'None'}
- Medical History: ${patientData?.medicalHistory}
- Medications: ${patientData?.medications}

RULES:
1. Begin with a warm greeting referencing their chief complaint.  
2. Ask only ONE focused follow-up question at a time. 3-6 questions maximum.
3. If patient does small talk, empathize briefly, redirect to clinical context.
4. When you have enough data, output ONLY raw JSON (no markdown, no fences):
{"type":"report","conditions":["..."],"riskLevel":"Low|Medium|High","suggestedTests":["..."],"summary":"..."}`
  });

  const startAIChat = async () => {
    const sys = getSystemPrompt();
    const init = { role: 'user', content: `Hello, ready to begin my consultation. Please speak in ${patientLanguage}.` };
    const res = await sendToOpenAI([sys, init]);
    if (res?.error) { setErrorMsg(res.error); return; }
    const msg = { sender: 'ai', text: res, internalApiState: [sys, init, { role: 'assistant', content: res }] };
    setMessages([msg]);
    setAiChatHistory([msg]);
  };

  const tryParseReport = (text, state, userMsg) => {
    try {
      const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      if (clean.startsWith('{') && clean.includes('"type"')) {
        const parsed = JSON.parse(clean);
        if (parsed.type === 'report') {
          setReportData(parsed);
          setGenerating(true);
          setTimeout(() => { setGenProgress(100); setTimeout(() => navigate('/report'), 600); }, 1200);
          return true;
        }
      }
    } catch {}
    return false;
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputVal.trim() || isProcessing) return;
    const text = inputVal.trim();
    setInputVal('');
    setErrorMsg(null);
    const last = messages[messages.length - 1];
    let state = last?.internalApiState || [getSystemPrompt()];
    const userMsg = { sender: 'user', text };
    setMessages(p => [...p, userMsg]);
    state = [...state, { role: 'user', content: text }];
    const res = await sendToOpenAI(state);
    if (res?.error) { setErrorMsg(res.error); return; }
    if (tryParseReport(res, state, userMsg)) return;
    const aiMsg = { sender: 'ai', text: res, internalApiState: [...state, { role: 'assistant', content: res }] };
    setMessages(p => { const arr = [...p, aiMsg]; setAiChatHistory(arr); return arr; });
  };

  const handleSaveEdit = async () => {
    setPatientData(editForm);
    setEditOpen(false);
    const last = messages[messages.length - 1];
    let state = last?.internalApiState || [getSystemPrompt()];
    const sysUpdate = { role: 'system', content: `Patient updated their intake data. New key info: Symptoms: ${editForm.symptoms}, Fever: ${editForm.fever}, Pain: ${editForm.pain}, Medications: ${editForm.medications}. Acknowledge briefly and continue.` };
    state = [...state, sysUpdate];
    const notice = { sender: 'system', text: 'Intake data updated. Updating clinical assessment...' };
    setMessages(p => [...p, notice]);
    const res = await sendToOpenAI(state);
    if (res?.error) { setErrorMsg(res.error); return; }
    if (tryParseReport(res, state, notice)) return;
    const aiMsg = { sender: 'ai', text: res, internalApiState: [...state, { role: 'assistant', content: res }] };
    setMessages(p => { const arr = [...p, aiMsg]; setAiChatHistory(arr); return arr; });
  };

  const today = new Date().toLocaleString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Date stamp */}
          <div className="text-center">
            <span className="text-xs bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-400 font-medium uppercase tracking-wider">
              TODAY, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-start gap-2 fade-in">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {messages.map((msg, i) => {
            if (msg.sender === 'system') return (
              <div key={i} className="text-center fade-in">
                <span className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-full px-4 py-1.5">{msg.text}</span>
              </div>
            );

            return (
              <div key={i} className={`flex items-start gap-3 animate-in ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-sm
                  ${msg.sender === 'ai' ? '' : 'bg-gray-300'}`}
                  style={msg.sender === 'ai' ? { background: '#2d6a00' } : {}}>
                  {msg.sender === 'ai' ? <Bot size={18} /> : <User size={18} />}
                </div>

                <div className={`max-w-lg ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {msg.sender === 'ai' && (
                    <span className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#2d6a00' }}>DR. AI ASSISTANT</span>
                  )}
                  <div className={msg.sender === 'ai' ? 'msg-ai' : 'msg-user'}>
                    <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{msg.text}</p>
                  </div>
                  {msg.sender === 'user' && (
                    <button onClick={() => setEditOpen(true)} className="btn-ghost-green self-end">
                      <Edit3 size={11} /> EDIT INTAKE DATA
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing / Generating indicator */}
          {isProcessing && !generating && (
            <div className="flex items-start gap-3 animate-in">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: '#2d6a00' }}>
                <Bot size={18} />
              </div>
              <div className="msg-ai">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 size={14} className="animate-spin" style={{ color: '#2d6a00' }} />
                  Updating clinical assessment with information...
                </div>
              </div>
            </div>
          )}

          {generating && (
            <div className="flex items-start gap-3 animate-in">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: '#2d6a00' }}>
                <Bot size={18} />
              </div>
              <div className="msg-ai min-w-[300px]">
                <p className="text-sm text-gray-500 italic mb-3">Generating Intelligent Clinical Summary...</p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                    <div className="w-6 h-6 rounded bg-green-50 flex items-center justify-center">
                      <Bot size={12} style={{ color: '#2d6a00' }} />
                    </div>
                    <span className="font-semibold">Generating Clinical Summary</span>
                    <span className="ml-auto font-bold" style={{ color: '#2d6a00' }}>{Math.round(genProgress)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${genProgress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <form onSubmit={handleSend} className="flex items-center gap-3 bg-white border border-gray-300 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-green-500 transition-colors">
            <button type="button" className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <Paperclip size={18} />
            </button>
            <input
              type="text"
              className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
              placeholder={`Describe your symptoms with Dr. Ai...`}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              disabled={isProcessing || generating}
              autoFocus
            />
            <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
              <Globe size={14} className="text-gray-400" />
              <select 
                className="text-xs font-semibold bg-transparent outline-none text-gray-600 cursor-pointer"
                value={patientLanguage}
                onChange={e => setPatientLanguage(e.target.value)}
              >
                <option value="English">EN</option>
                <option value="Hindi">HI</option>
                <option value="Bangla">BN</option>
              </select>
            </div>
            <button type="submit"
              disabled={isProcessing || generating || !inputVal.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 disabled:opacity-40 transition-opacity"
              style={{ background: '#2d6a00' }}
            >
              <Send size={15} />
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1.5">
            <ShieldCheck size={11} style={{ color: '#2d6a00' }} />
            HIPAA Compliant • AES-256 Encryption active
          </p>
        </div>
      </div>

      {/* Edit Intake Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-bold mb-4">Edit Intake Data</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Primary Symptoms</label>
                <textarea className="clinical-input" rows={2} value={editForm.symptoms || ''} onChange={e => setEditForm(f => ({ ...f, symptoms: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Fever</label>
                  <select className="clinical-input" value={editForm.fever || 'no'} onChange={e => setEditForm(f => ({ ...f, fever: e.target.value }))}>
                    <option value="no">No Fever</option>
                    <option value="mild">Mild</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Pain</label>
                  <select className="clinical-input" value={editForm.pain || 'none'} onChange={e => setEditForm(f => ({ ...f, pain: e.target.value }))}>
                    <option value="none">No pain</option>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Current Medications</label>
                <input className="clinical-input" value={editForm.medications || ''} onChange={e => setEditForm(f => ({ ...f, medications: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button className="btn-outline py-2 px-4 text-sm" onClick={() => setEditOpen(false)}>Cancel</button>
              <button className="btn-primary py-2 px-4 text-sm" onClick={handleSaveEdit}>Save & Notify AI</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
