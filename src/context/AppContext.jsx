import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // role: 'patient' | 'doctor' | null
  const [role, setRole] = useState(() => {
    return localStorage.getItem('role') || null;
  });

  const [patientLanguage, setPatientLanguage] = useState('English');
  const [patientData, setPatientData] = useState(null);
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);

  // Sync role to localStorage
  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  const value = {
    role,
    setRole,
    patientLanguage,
    setPatientLanguage,
    patientData,
    setPatientData,
    aiChatHistory,
    setAiChatHistory,
    reportData,
    setReportData,
    prescriptionData,
    setPrescriptionData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
