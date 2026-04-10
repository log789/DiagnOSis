import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  User, 
  Stethoscope, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  Pill, 
  Activity, 
  ChevronRight,
  MoreVertical,
  Phone,
  Video,
  Info
} from 'lucide-react';
import { PatientData } from '../services/geminiService';

interface Message {
  id: string;
  role: 'patient' | 'doctor';
  text: string;
  timestamp: string;
}

interface ConsultationHubProps {
  patient: PatientData;
  viewMode?: 'patient' | 'doctor';
}

export const ConsultationHub: React.FC<ConsultationHubProps> = ({ patient, viewMode: initialViewMode = 'patient' }) => {
  const [viewMode, setViewMode] = useState<'patient' | 'doctor'>(initialViewMode);
  const [step, setStep] = useState<'pre-consultation' | 'chat'>('pre-consultation');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const symptoms = ['Headache', 'Fever', 'Fatigue', 'Chest pain', 'Cough', 'Dizziness'];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartConsultation = () => {
    if (selectedSymptoms.length > 0 && severity) {
      const summary = `Patient reports ${severity.toLowerCase()} ${selectedSymptoms.join(' and ').toLowerCase()} for 2 days.`;
      const initialMessages: Message[] = [
        {
          id: '1',
          role: 'doctor',
          text: "Hello! I've reviewed your pre-consultation summary. How are you feeling right now?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(initialMessages);
      setStep('chat');
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      role: viewMode === 'patient' ? 'patient' : 'doctor',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Mock auto-reply for demo
    if (viewMode === 'patient') {
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          role: 'doctor',
          text: "I understand. Let's look into that. Have you taken any medication for it?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, reply]);
      }, 1500);
    }
  };

  const patientSuggestions = [
    "What should I do now?",
    "Is this serious?",
    "Do I need medication?"
  ];

  const doctorSuggestions = [
    "Monitor symptoms for 24 hours",
    "Stay hydrated and rest",
    "Recommend further checkup"
  ];

  if (step === 'pre-consultation') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-primary">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Smart Consultation</h2>
              <p className="text-slate-500 font-medium">AI-Pre-screening for faster care</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Select Symptoms</label>
              <div className="flex flex-wrap gap-3">
                {symptoms.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSymptoms(prev => 
                      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                    )}
                    className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                      selectedSymptoms.includes(s) 
                        ? 'bg-primary text-white shadow-lg shadow-blue-100' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Severity Level</label>
              <div className="grid grid-cols-3 gap-4">
                {(['Low', 'Medium', 'High'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSeverity(s)}
                    className={`py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                      severity === s 
                        ? s === 'Low' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' :
                          s === 'Medium' ? 'bg-amber-50 border-amber-500 text-amber-700' :
                          'bg-rose-50 border-rose-500 text-rose-700'
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={selectedSymptoms.length === 0 || !severity}
              onClick={handleStartConsultation}
              className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:shadow-none mt-4"
            >
              Start Consultation
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6 p-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        {/* Chat Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-primary">
                {viewMode === 'patient' ? <Stethoscope className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900">
                  {viewMode === 'patient' ? 'Dr. Robert Reed' : `${patient.firstName} ${patient.lastName}`}
                </h3>
                <span className="px-2 py-0.5 bg-blue-50 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                  Priority
                </span>
              </div>
              <p className="text-xs text-slate-500">Active now • AI-Screened</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><Phone className="w-5 h-5" /></button>
            <button className="p-3 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><Video className="w-5 h-5" /></button>
            <button 
              onClick={() => setViewMode(viewMode === 'patient' ? 'doctor' : 'patient')}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Switch to {viewMode === 'patient' ? 'Doctor' : 'Patient'} View
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
          <div className="flex justify-center mb-8">
            <div className="px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Consultation Started • {new Date().toLocaleDateString()}
            </div>
          </div>

          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === (viewMode === 'patient' ? 'patient' : 'doctor') ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] space-y-1 ${m.role === (viewMode === 'patient' ? 'patient' : 'doctor') ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-3xl shadow-sm text-sm leading-relaxed ${
                  m.role === 'patient' 
                    ? 'bg-blue-500 text-white rounded-tr-none' 
                    : 'bg-emerald-500 text-white rounded-tl-none'
                }`}>
                  {m.text}
                </div>
                <p className="text-[10px] text-slate-400 font-medium px-2">{m.timestamp}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-100 space-y-4">
          {/* Suggestions */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {(viewMode === 'patient' ? patientSuggestions : doctorSuggestions).map(s => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Type your message..."
              className="w-full pl-6 pr-16 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm font-medium"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-4 bg-primary text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 font-medium">
            This consultation is optimized using AI to save doctor time.
          </p>
        </div>
      </div>

      {/* Sidebar (Doctor View Only) */}
      {viewMode === 'doctor' && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 space-y-6"
        >
          {/* Patient Summary Card */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Pre-Consultation Summary</h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Patient reports {severity?.toLowerCase()} {selectedSymptoms.join(' and ').toLowerCase()} for 2 days.
              </p>
            </div>
            <div className={`flex items-center justify-between p-3 rounded-xl ${
              severity === 'Low' ? 'bg-emerald-50 text-emerald-700' :
              severity === 'Medium' ? 'bg-amber-50 text-amber-700' :
              'bg-rose-50 text-rose-700'
            }`}>
              <span className="text-[10px] font-black uppercase tracking-widest">Risk Level</span>
              <span className="text-xs font-bold">{severity}</span>
            </div>
          </div>

          {/* AI Insight Box */}
          <div className="bg-slate-900 rounded-[32px] p-6 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-16 h-16" />
            </div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              AI Insight
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed relative z-10">
              Symptoms indicate low immediate risk but require monitoring for potential escalation.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <ActionButton icon={<Pill className="w-4 h-4" />} label="Prescribe" color="text-blue-600 bg-blue-50" />
              <ActionButton icon={<Activity className="w-4 h-4" />} label="Recommend Test" color="text-emerald-600 bg-emerald-50" />
              <ActionButton icon={<ShieldAlert className="w-4 h-4" />} label="Emergency Alert" color="text-rose-600 bg-rose-50" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Sidebar (Patient View Only - Info) */}
      {viewMode === 'patient' && (
        <div className="w-80 space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mb-6">
              <Info className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Consultation Info</h4>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Your doctor has been provided with your pre-screening summary and real-time vitals.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Consultation ID</span>
                <span className="font-bold text-slate-700">#CONS-9283</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Priority Level</span>
                <span className="font-bold text-blue-600">High</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) => (
  <button className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] ${color}`}>
    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <span className="text-xs font-bold">{label}</span>
    <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
  </button>
);
