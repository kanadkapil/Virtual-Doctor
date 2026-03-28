import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAI } from '../hooks/useAI';
import { Bot, User, Send, AlertTriangle, Edit3, Globe } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';

export default function AiChat() {
  const { patientData, setPatientData, patientLanguage, setPatientLanguage, aiChatHistory, setAiChatHistory, setReportData } = useAppContext();
  const navigate = useNavigate();
  const { isProcessing, sendToOpenAI } = useAI();
  
  const [messages, setMessages] = useState(aiChatHistory.length ? aiChatHistory : []);
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Edit Form Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(patientData || {});

  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);
  
  useEffect(() => {
    if (messages.length === 0) {
      startAIChat();
    }
  }, []);

  const getSystemPrompt = () => {
    return {
      role: 'system',
      content: `You are a highly empathetic, calm, friendly, and efficient AI healthcare assistant acting as a doctor.
Your goal is to collect relevant data, build trust, and provide smart, focused health guidance without overwhelming the user.

COMMUNICATION LANGUAGE: ${patientLanguage}
You MUST understand and respond precisely in ${patientLanguage}. Maintain context even if the user mixes languages.

PATIENT FILE (from intake form):
- Basic Info: ${patientData?.age || '?'}yr ${patientData?.gender || 'Unknown'}, Weight: ${patientData?.weight || 'Unknown'}kg
- Lifestyle: Diet: ${patientData?.diet || 'Unknown'}, Exercise: ${patientData?.exercise || 'Unknown'}, Sleep: ${patientData?.sleep || '?'} hrs/night, Water: ${patientData?.waterIntake || '?'} L/day
- Existing Symptoms Map: Fever: ${patientData?.fever || 'Unknown'}, Pain: ${patientData?.pain || 'Unknown'}, Fatigue: ${patientData?.fatigue || 'Unknown'}
- Digestion/Bowels: ${patientData?.digestion || 'Unknown'}
- Medical History: ${patientData?.medicalHistory || 'Unknown'}
- Meds: ${patientData?.medications || 'Unknown'}
- Primary Concern: ${patientData?.symptoms || 'None'}

CONVERSATION HANDLING:
- If the patient engages in small talk or expressions of discomfort (e.g., "not feeling well"), acknowledge it empathetically ("I'm sorry you're feeling this way..."), but gently and firmly guide the conversation back to specific medical symptoms. 
- Avoid unnecessary casual conversation while remaining deeply empathetic.

CORE FLOW:
1. First message: Greet the patient warmly and empathetically in ${patientLanguage}. Acknowledge their primary concern reassuringly. Example: "Hi, I'm here to help you. Take your time and tell me what you're feeling..."
2. Ask smart follow-up questions to clarify their condition. ASK ONLY ONE QUESTION AT A TIME. Avoid repetitive queries. Leverage the patient file data so you don't ask what you already know.
3. Keep your questions short, focused, and context-aware.
4. Aim to ask between 3 and 6 relevant follow-up questions in total.
5. ONCE you have collected enough information to build clear understanding and confidence, you MUST provide a final medical summary structured report as a JSON block. 

When you output JSON, YOU MUST NOT OUTPUT ANYTHING ELSE. NO markdown blockticks. ONLY RAW JSON matching this exact schema:
{
  "type": "report",
  "conditions": ["Probable Condition 1", "Probable Condition 2 (if any)"],
  "riskLevel": "Low" | "Medium" | "High",
  "suggestedTests": ["Clear rest/hydration guidelines", "Or consult doctor", "Or specific lab test"],
  "summary": "A logical assumption of the condition (not definitive diagnosis) with clear next steps maintaining a reassuring, simple tone."
}`
    };
  };

  const startAIChat = async () => {
    const sysPrompt = getSystemPrompt();
    const initialQuery = { role: 'user', content: `Hello, I am ready to start my diagnosis based on the symptoms I provided. Please speak to me in ${patientLanguage}.` };
    
    const apiResponse = await sendToOpenAI([sysPrompt, initialQuery]);
    if (apiResponse?.error) {
      setErrorMsg(apiResponse.error);
      return;
    }
    
    const newMsgObj = { sender: 'ai', text: apiResponse, role: 'assistant', internalApiState: [sysPrompt, initialQuery, { role: 'assistant', content: apiResponse }] };
    setMessages([newMsgObj]);
    setAiChatHistory([newMsgObj]);
  };

  const processResponseJSON = (response, apiState, newUserMsgObj) => {
    try {
      const cleanedText = response.replace(/```json/g, '').replace(/```/g, '').trim();
      if (cleanedText.startsWith('{') && cleanedText.includes('"type"')) {
          const parsedReport = JSON.parse(cleanedText);
          if (parsedReport.type === 'report' || parsedReport.type === 'summary') {
              setReportData(parsedReport);
              
              const finishMsg = "Diagnosis complete. Generating structured clinical summary...";
              setAiChatHistory([...messages, newUserMsgObj, { sender: 'ai', text: finishMsg, role: 'assistant' }]);
              navigate('/report');
              return true;
          }
      }
    } catch (err) {}
    return false;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isProcessing) return;

    const userText = inputVal.trim();
    setInputVal('');
    setErrorMsg(null);

    const lastMsg = messages[messages.length - 1];
    let apiState = lastMsg?.internalApiState || [getSystemPrompt()];
    
    const newUserMsgObj = { sender: 'user', text: userText, role: 'user' };
    setMessages(prev => [...prev, newUserMsgObj]);
    
    apiState = [...apiState, { role: 'user', content: userText }];
    const response = await sendToOpenAI(apiState);

    if (response?.error) {
       setErrorMsg(response.error);
       return;
    }

    if (processResponseJSON(response, apiState, newUserMsgObj)) return;

    const newAiMsgObj = { sender: 'ai', text: response, role: 'assistant', internalApiState: [...apiState, { role: 'assistant', content: response }] };
    setMessages(prev => {
       const finalArr = [...prev, newAiMsgObj];
       setAiChatHistory(finalArr);
       return finalArr;
    });
  };

  const handleSaveFormEdit = async () => {
    setPatientData(editForm);
    setIsEditModalOpen(false);

    // Inject system update so AI knows the data changed
    const systemUpdateMsg = { 
       role: 'system', 
       content: `SYSTEM ALERT: The patient has updated their intake form. New Symptom/Data state: Fever: ${editForm.fever}, Pain: ${editForm.pain}, Fatigue: ${editForm.fatigue}, Symptoms: ${editForm.symptoms}, Meds: ${editForm.medications}. Please acknowledge this update briefly in one empathetic sentence, and confirm it with the user, then proceed with the diagnosis where you left off.`
    };

    const lastMsg = messages[messages.length - 1];
    let apiState = lastMsg?.internalApiState || [getSystemPrompt()];
    apiState = [...apiState, systemUpdateMsg];

    // Show a small inline system note to the user
    const systemNotice = { sender: 'system', text: "Form updated successfully. AI is reviewing changes...", role: 'system' };
    setMessages(prev => [...prev, systemNotice]);

    const response = await sendToOpenAI(apiState);
    if (response?.error) {
        setErrorMsg(response.error);
        return;
    }

    if (processResponseJSON(response, apiState, systemNotice)) return;

    const newAiMsgObj = { sender: 'ai', text: response, role: 'assistant', internalApiState: [...apiState, { role: 'assistant', content: response }] };
    setMessages(prev => {
       const finalArr = [...prev, newAiMsgObj];
       setAiChatHistory(finalArr);
       return finalArr;
    });
  };

  const renderFormEditModal = () => (
    <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Intake Form">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto px-2">
         <div className="form-control">
            <label className="label"><span className="label-text">Primary Symptoms</span></label>
            <textarea className="textarea textarea-bordered" value={editForm.symptoms || ''} onChange={e => setEditForm({...editForm, symptoms: e.target.value})}></textarea>
         </div>
         <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
               <label className="label"><span className="label-text">Fever</span></label>
               <select className="select select-bordered" value={editForm.fever || 'no'} onChange={e => setEditForm({...editForm, fever: e.target.value})}>
                 <option value="no">No Fever</option>
                 <option value="mild">Mild (99-100°F)</option>
                 <option value="high">High (above 101°F)</option>
               </select>
            </div>
            <div className="form-control">
               <label className="label"><span className="label-text">Pain</span></label>
               <select className="select select-bordered" value={editForm.pain || 'none'} onChange={e => setEditForm({...editForm, pain: e.target.value})}>
                 <option value="none">No pain</option>
                 <option value="mild">Mild pain</option>
                 <option value="moderate">Moderate pain</option>
                 <option value="severe">Severe pain</option>
               </select>
            </div>
         </div>
         <div className="form-control">
            <label className="label"><span className="label-text">Current Medications</span></label>
            <input type="text" className="input input-bordered" value={editForm.medications || ''} onChange={e => setEditForm({...editForm, medications: e.target.value})} />
         </div>
      </div>
      <div className="modal-action">
         <Button onClick={() => setIsEditModalOpen(false)} variant="ghost">Cancel</Button>
         <Button onClick={handleSaveFormEdit} variant="primary">Save Changes</Button>
      </div>
    </Modal>
  );

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] p-4 flex flex-col pt-6 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Bot className="text-primary"/> Dr. Ai Diagnosis</h1>
        
        <div className="flex items-center gap-2 bg-base-200 p-1 rounded-lg">
          <Button variant="ghost" className="btn-sm text-base-content/70" onClick={() => setIsEditModalOpen(true)}>
             <Edit3 size={16} className="mr-1"/> Edit Form
          </Button>
          <div className="divider divider-horizontal m-0 p-0"></div>
          <div className="flex items-center px-2 text-sm font-medium gap-2">
            <Globe size={16} className="text-primary"/>
            <select 
              className="select select-ghost select-sm px-1 font-bold"
              value={patientLanguage}
              onChange={(e) => setPatientLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Bangla">Bangla</option>
            </select>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-error mb-4 shadow-sm py-3 animate-fade-in-up">
          <AlertTriangle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      {renderFormEditModal()}

      <div className="glass-card flex-grow flex flex-col mb-4 overflow-hidden border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => {
            if (msg.sender === 'system') {
               return (
                 <div key={idx} className="flex justify-center animate-fade-in-up my-4">
                    <span className="badge badge-neutral bg-base-300 text-xs px-4 py-3">{msg.text}</span>
                 </div>
               );
            }

            return (
              <div key={idx} className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'} animate-fade-in-up`}>
                <div className="chat-image avatar">
                  <div className={`w-10 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-secondary' : 'bg-primary'}`}>
                    {msg.sender === 'user' ? <User className="text-white m-2" /> : <Bot className="text-white m-2" />}
                  </div>
                </div>
                <div className={`chat-bubble whitespace-pre-line shadow-lg max-w-[85%] font-medium tracking-wide ${msg.sender === 'user' ? 'bg-white text-drtext border border-drprimary/20' : 'bg-gradient-to-tr from-drprimary to-draccent text-[#112211] border border-white/40 shadow-[0_4px_25px_rgba(164,221,0,0.4)]'}`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          
          {isProcessing && (
             <div className="chat chat-start">
               <div className="chat-image avatar">
                 <div className="w-10 rounded-full flex items-center justify-center bg-primary">
                   <Bot className="text-white m-2" />
                 </div>
               </div>
               <div className="chat-bubble bg-white/60 text-drtext border border-drprimary/20 shadow-sm flex items-center gap-2 font-medium tracking-wide">
                 <span className="loading loading-dots loading-sm text-primary"></span>
                 Dr. Ai is analyzing...
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="bg-white/40 backdrop-blur-md border-t border-drprimary/10 p-4 z-20">
           <form onSubmit={handleSendMessage} className="flex gap-3 relative">
             <input 
               type="text" 
               className="input glass-input flex-grow rounded-xl pl-4 pr-12 font-medium" 
               placeholder={isProcessing ? "Waiting for AI..." : `Type your answer in ${patientLanguage}...`}
               value={inputVal}
               onChange={e => setInputVal(e.target.value)}
               disabled={isProcessing}
               autoFocus
             />
             <button type="submit" className="btn-glowing absolute right-2 top-1.5 bottom-1.5 w-10 flex items-center justify-center rounded-lg" disabled={isProcessing || !inputVal.trim()}>
               <Send size={18}/>
             </button>
           </form>
        </div>
      </div>
    </div>
  );
}
