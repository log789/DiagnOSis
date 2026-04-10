import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlayCircle, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Plus, 
  LogOut,
  ChevronRight,
  Shield,
  Stethoscope,
  Brain,
  Heart,
  Building2,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Dashboard } from './components/Dashboard';
import { SimulationPanel } from './components/SimulationPanel';
import { ChatAssistant } from './components/ChatAssistant';
import { MemoryGame } from './components/MemoryGame';
import { DoctorDashboard } from './components/DoctorDashboard';
import { HospitalPanel } from './components/HospitalPanel';
import { ConsultationHub } from './components/ConsultationHub';
import { geminiService, PatientData } from './services/geminiService';

export interface Emergency {
  id: string;
  patientName: string;
  type: string;
  severity: 'Critical' | 'High' | 'Moderate';
  timestamp: string;
  status: 'pending' | 'dispatched' | 'resolved';
}

const MOCK_PATIENTS: PatientData[] = [
  {
    firstName: "Sarah",
    lastName: "Chen",
    dob: "1978-05-12",
    gender: "Female",
    vitals: {
      heartRate: 72,
      bloodPressure: "128/84",
      oxygen: 98,
      temperature: 98.6
    },
    lifestyle: {
      sleepHours: 7.5,
      steps: 8432,
      nutritionScore: 85,
      medicationAdherence: 98
    },
    cognitive: {
      memoryScore: 82,
      attentionScore: 78,
      reactionTime: 450,
      gameHistory: [
        { date: '2026-04-01', score: 50, level: 5 },
        { date: '2026-04-03', score: 70, level: 7 },
        { date: '2026-04-05', score: 60, level: 6 },
        { date: '2026-04-07', score: 80, level: 8 },
      ]
    },
    emotional: {
      mood: 'Calm',
      stressLevel: 30,
      journalEntries: [
        { date: '2026-04-08', text: 'Felt a bit tired today but managed to walk in the park.', sentiment: 'Neutral' },
        { date: '2026-04-09', text: 'Had a great lunch with my daughter. Feeling very happy.', sentiment: 'Positive' },
      ]
    },
    medications: ["Lisinopril 10mg", "Metformin 500mg", "Atorvastatin 20mg"],
    medicationSchedule: [
      { id: '1', name: 'Lisinopril', dosage: '10mg', time: '08:00', status: 'taken', date: '2026-04-10' },
      { id: '2', name: 'Metformin', dosage: '500mg', time: '12:00', status: 'pending', date: '2026-04-10' },
      { id: '3', name: 'Atorvastatin', dosage: '20mg', time: '20:00', status: 'pending', date: '2026-04-10' },
    ],
    diagnoses: ["Type 2 Diabetes", "Hypertension", "Hyperlipidemia"],
    labs: {
      hba1c: 7.2,
      ldl: 110,
      creatinine: 0.9
    }
  },
  {
    firstName: "James",
    lastName: "Wilson",
    dob: "1955-11-23",
    gender: "Male",
    vitals: {
      heartRate: 85,
      bloodPressure: "145/92",
      oxygen: 96,
      temperature: 98.4
    },
    lifestyle: {
      sleepHours: 5.5,
      steps: 2100,
      nutritionScore: 60,
      medicationAdherence: 65
    },
    cognitive: {
      memoryScore: 65,
      attentionScore: 60,
      reactionTime: 680,
      gameHistory: [
        { date: '2026-04-01', score: 40, level: 4 },
        { date: '2026-04-04', score: 45, level: 4 },
      ]
    },
    emotional: {
      mood: 'Anxious',
      stressLevel: 75,
      journalEntries: [
        { date: '2026-04-08', text: 'Struggling to remember my keys today.', sentiment: 'Negative' },
      ]
    },
    medications: ["Donepezil 5mg", "Amlodipine 5mg"],
    medicationSchedule: [
      { id: '4', name: 'Donepezil', dosage: '5mg', time: '08:00', status: 'missed', date: '2026-04-09' },
      { id: '5', name: 'Donepezil', dosage: '5mg', time: '08:00', status: 'pending', date: '2026-04-10' },
    ],
    diagnoses: ["Early-stage Alzheimer's", "Hypertension"],
    labs: {
      hba1c: 6.1,
      ldl: 135,
      creatinine: 1.2
    }
  },
  {
    firstName: "Elena",
    lastName: "Rodriguez",
    dob: "1992-02-28",
    gender: "Female",
    vitals: {
      heartRate: 68,
      bloodPressure: "115/75",
      oxygen: 99,
      temperature: 98.6
    },
    lifestyle: {
      sleepHours: 8.2,
      steps: 12500,
      nutritionScore: 92,
      medicationAdherence: 100
    },
    cognitive: {
      memoryScore: 95,
      attentionScore: 92,
      reactionTime: 320,
      gameHistory: [
        { date: '2026-04-05', score: 95, level: 10 },
      ]
    },
    emotional: {
      mood: 'Energetic',
      stressLevel: 15,
      journalEntries: [
        { date: '2026-04-09', text: 'Feeling great after my morning run!', sentiment: 'Positive' },
      ]
    },
    medications: ["Multivitamin"],
    medicationSchedule: [
      { id: '6', name: 'Multivitamin', dosage: '1 tab', time: '09:00', status: 'taken', date: '2026-04-10' },
    ],
    diagnoses: ["Healthy"],
    labs: {
      hba1c: 5.2,
      ldl: 85,
      creatinine: 0.8
    }
  }
];

const MOCK_PATIENT = MOCK_PATIENTS[0];

type Tab = 'patient' | 'doctor' | 'hospital' | 'game' | 'simulation' | 'consultation';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('patient');
  const [patient, setPatient] = useState<PatientData>(() => {
    const saved = localStorage.getItem('diagnosis_patient');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with MOCK_PATIENT to ensure all fields exist
      return { ...MOCK_PATIENT, ...parsed };
    }
    return MOCK_PATIENT;
  });
  const [summary, setSummary] = useState('');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);

  const triggerEmergency = (type: string, severity: Emergency['severity']) => {
    const newEmergency: Emergency = {
      id: Math.random().toString(36).substr(2, 9),
      patientName: `${patient.firstName} ${patient.lastName}`,
      type,
      severity,
      timestamp: new Date().toLocaleTimeString(),
      status: 'pending'
    };
    setEmergencies(prev => [newEmergency, ...prev]);
  };

  const resolveEmergency = (id: string) => {
    setEmergencies(prev => prev.filter(e => e.id !== id));
  };

  const updateMedicationStatus = (id: string, status: 'taken' | 'missed') => {
    setPatient(prev => ({
      ...prev,
      medicationSchedule: prev.medicationSchedule.map(m => 
        m.id === id ? { ...m, status } : m
      )
    }));
  };

  const addMedicationReminder = (reminder: any) => {
    const newReminder = {
      ...reminder,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending'
    };
    setPatient(prev => ({
      ...prev,
      medicationSchedule: [...prev.medicationSchedule, newReminder]
    }));
  };

  const deleteMedicationReminder = (id: string) => {
    setPatient(prev => ({
      ...prev,
      medicationSchedule: prev.medicationSchedule.filter(m => m.id !== id)
    }));
  };

  useEffect(() => {
    localStorage.setItem('diagnosis_patient', JSON.stringify(patient));
  }, [patient]);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const res = await geminiService.generateDigitalTwinSummary(patient);
        setSummary(res || '');
      } catch (error) {
        console.error(error);
      }
    };
    loadSummary();
  }, [patient]);

  const handleGameComplete = (score: number, level: number, reactionTime: number) => {
    setPatient(prev => ({
      ...prev,
      cognitive: {
        ...prev.cognitive,
        memoryScore: Math.min(100, prev.cognitive.memoryScore + (level / 2)),
        reactionTime: (prev.cognitive.reactionTime + reactionTime) / 2,
        gameHistory: [
          ...prev.cognitive.gameHistory,
          { date: new Date().toISOString().split('T')[0], score, level }
        ]
      }
    }));
  };

  return (
    <div className="flex h-screen bg-background font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-sm">
        <div className="p-8 flex items-center gap-3">
          <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 rotate-3 hover:rotate-0 transition-transform duration-300">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">DiagnOSis</h1>
            <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Health OS</p>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4">
          <NavItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Patient Dashboard" 
            active={activeTab === 'patient'} 
            onClick={() => setActiveTab('patient')} 
          />
          <NavItem 
            icon={<Heart className="w-5 h-5" />} 
            label="Doctor Dashboard" 
            active={activeTab === 'doctor'} 
            onClick={() => setActiveTab('doctor')} 
          />
          <NavItem 
            icon={<Building2 className="w-5 h-5" />} 
            label="Hospital Panel" 
            active={activeTab === 'hospital'} 
            onClick={() => setActiveTab('hospital')} 
          />
          <NavItem 
            icon={<MessageSquare className="w-5 h-5" />} 
            label="Consultation Hub" 
            active={activeTab === 'consultation'} 
            onClick={() => setActiveTab('consultation')} 
          />
          <NavItem 
            icon={<Brain className="w-5 h-5" />} 
            label="Memory Game" 
            active={activeTab === 'game'} 
            onClick={() => setActiveTab('game')} 
          />
          
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Advanced</div>
          <NavItem 
            icon={<PlayCircle className="w-5 h-5" />} 
            label="Simulation Lab" 
            active={activeTab === 'simulation'} 
            onClick={() => setActiveTab('simulation')} 
          />
          <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-all duration-300 cursor-pointer group border border-transparent hover:border-slate-100">
            <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold shadow-inner">
              DR
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">Dr. Robert Reed</p>
              <p className="text-xs text-slate-500 truncate font-medium">Chief Cardiologist</p>
            </div>
            <LogOut className="w-4 h-4 text-slate-300 group-hover:text-danger transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search records, patients, or facility data..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all relative group">
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white animate-pulse"></span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-2xl text-sm font-bold hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all duration-300 active:scale-95">
              <Plus className="w-4 h-4" />
              New Entry
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-background/50">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs / Subheader */}
            <div className="px-8 py-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
                  <span>DiagnOSis</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-slate-600 capitalize">{activeTab}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {activeTab === 'patient' ? 'Patient Overview' : 
                   activeTab === 'doctor' ? 'Clinical Insights' :
                   activeTab === 'hospital' ? 'Facility Operations' :
                   activeTab === 'game' ? 'Cognitive Training' :
                   activeTab === 'consultation' ? 'Smart Consultation' :
                   'Simulation Lab'}
                </h2>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                  <Shield className="w-3.5 h-3.5 text-secondary" />
                  HIPAA Compliant
                </div>
                <div className="text-xs text-slate-400">
                  System Status: <span className="font-medium text-secondary">Operational</span>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'patient' && (
                <motion.div
                  key="patient"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Dashboard 
                    patient={patient} 
                    summary={summary} 
                    onTriggerEmergency={triggerEmergency}
                    onUpdateMedStatus={updateMedicationStatus}
                    onAddMedReminder={addMedicationReminder}
                    onDeleteMedReminder={deleteMedicationReminder}
                  />
                </motion.div>
              )}
              {activeTab === 'doctor' && (
                <motion.div
                  key="doctor"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <DoctorDashboard patients={MOCK_PATIENTS} />
                </motion.div>
              )}
              {activeTab === 'hospital' && (
                <motion.div
                  key="hospital"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <HospitalPanel 
                    emergencies={emergencies} 
                    onResolveEmergency={resolveEmergency} 
                  />
                </motion.div>
              )}
              {activeTab === 'game' && (
                <motion.div
                  key="game"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <MemoryGame onGameComplete={handleGameComplete} history={patient.cognitive.gameHistory} />
                </motion.div>
              )}
              {activeTab === 'consultation' && (
                <motion.div
                  key="consultation"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <ConsultationHub patient={patient} />
                </motion.div>
              )}
              {activeTab === 'simulation' && (
                <motion.div
                  key="simulation"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <SimulationPanel patient={patient} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating AI Assistant Toggle */}
        <button 
          onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center hover:scale-110 transition-transform z-50"
        >
          <Bot className="w-7 h-7" />
        </button>

        {/* AI Assistant Sidebar */}
        <AnimatePresence>
          {isAssistantOpen && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 border-l border-slate-200"
            >
              <ChatAssistant patient={patient} />
              <button 
                onClick={() => setIsAssistantOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group ${
      active 
        ? 'bg-accent text-white shadow-lg shadow-blue-100' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <div className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-accent'}`}>
      {icon}
    </div>
    {label}
    {active && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
  </button>
);

const Bot = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);
