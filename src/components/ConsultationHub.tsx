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
  Info,
  ShoppingBag
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
  onOrderMedicine?: (search: string) => void;
}

export const ConsultationHub: React.FC<ConsultationHubProps> = ({ 
  patient, 
  viewMode: initialViewMode = 'patient',
  onOrderMedicine
}) => {
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
      <div className="max-w-3xl mx-auto p-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[48px] p-12 shadow-card border border-slate-100"
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="w-20 h-20 bg-accent/10 rounded-[32px] flex items-center justify-center text-accent shadow-inner">
              <Stethoscope className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900">Smart Consultation</h2>
              <p className="text-slate-500 font-bold">AI-Pre-screening for optimized care</p>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 block">Select Symptoms</label>
              <div className="flex flex-wrap gap-4">
                {symptoms.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSymptoms(prev => 
                      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                    )}
                    className={`px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                      selectedSymptoms.includes(s) 
                        ? 'bg-accent text-white shadow-xl shadow-blue-100 scale-105' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 block">Severity Level</label>
              <div className="grid grid-cols-3 gap-6">
                {(['Low', 'Medium', 'High'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSeverity(s)}
                    className={`py-6 rounded-3xl font-black text-sm transition-all border-2 duration-300 ${
                      severity === s 
                        ? s === 'Low' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-100' :
                          s === 'Medium' ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-lg shadow-amber-100' :
                          'bg-rose-50 border-rose-500 text-rose-700 shadow-lg shadow-rose-100'
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
              className="w-full py-6 bg-accent text-white rounded-[32px] font-black uppercase tracking-widest shadow-2xl shadow-blue-200 hover:bg-blue-600 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:shadow-none mt-6 active:scale-95"
            >
              Start Consultation
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex gap-10 p-10">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-[48px] shadow-card border border-slate-100 overflow-hidden">
        {/* Chat Header */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-14 h-14 bg-accent/10 rounded-[24px] flex items-center justify-center text-accent shadow-inner">
                {viewMode === 'patient' ? <Stethoscope className="w-7 h-7" /> : <User className="w-7 h-7" />}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-black text-slate-900">
                  {viewMode === 'patient' ? 'Dr. Robert Reed' : `${patient.firstName} ${patient.lastName}`}
                </h3>
                <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full">
                  Priority
                </span>
              </div>
              <p className="text-xs text-slate-500 font-bold">Active now • AI-Screened</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-4 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all hover:text-slate-900"><Phone className="w-5 h-5" /></button>
            <button className="p-4 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all hover:text-slate-900"><Video className="w-5 h-5" /></button>
            <button 
              onClick={() => setViewMode(viewMode === 'patient' ? 'doctor' : 'patient')}
              className="px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              Switch View
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/20">
          <div className="flex justify-center mb-10">
            <div className="px-6 py-2 bg-white rounded-full border border-slate-100 shadow-soft text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Consultation Started • {new Date().toLocaleDateString()}
            </div>
          </div>

          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === (viewMode === 'patient' ? 'patient' : 'doctor') ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] space-y-2 ${m.role === (viewMode === 'patient' ? 'patient' : 'doctor') ? 'items-end' : 'items-start'}`}>
                <div className={`p-5 rounded-[32px] shadow-soft text-sm font-medium leading-relaxed ${
                  m.role === 'patient' 
                    ? 'bg-accent text-white rounded-tr-none' 
                    : 'bg-emerald-500 text-white rounded-tl-none'
                }`}>
                  {m.text}
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-3">{m.timestamp}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-8 border-t border-slate-100 space-y-6">
          {/* Doctor Recommendations (Visible to Patient) */}
          {viewMode === 'patient' && (
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => onOrderMedicine?.('Paracetamol')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-100 transition-all shadow-sm"
              >
                <ShoppingBag className="w-3 h-3" />
                Order Recommended: Paracetamol
              </button>
              <button 
                onClick={() => onOrderMedicine?.('Ibuprofen')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-100 transition-all shadow-sm"
              >
                <ShoppingBag className="w-3 h-3" />
                Order Recommended: Ibuprofen
              </button>
            </div>
          )}

          {/* Suggestions */}
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {(viewMode === 'patient' ? patientSuggestions : doctorSuggestions).map(s => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-5 py-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all hover:shadow-md active:scale-95"
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
              className="w-full pl-8 pr-20 py-6 bg-slate-50 border border-slate-100 rounded-[32px] focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white outline-none text-sm font-bold transition-all"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-5 bg-accent text-white rounded-[24px] hover:bg-blue-600 disabled:opacity-50 transition-all shadow-xl shadow-blue-100 active:scale-90"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
            AI-Optimized Consultation Hub
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-96 space-y-8">
        {viewMode === 'doctor' ? (
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Patient Summary Card */}
            <div className="bg-white rounded-[40px] p-8 shadow-card border border-slate-100">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Pre-Consultation Summary</h4>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-6">
                <p className="text-sm text-slate-700 leading-relaxed font-bold">
                  Patient reports {severity?.toLowerCase()} {selectedSymptoms.join(' and ').toLowerCase()} for 2 days.
                </p>
              </div>
              <div className={`flex items-center justify-between p-4 rounded-2xl ${
                severity === 'Low' ? 'bg-emerald-50 text-emerald-700' :
                severity === 'Medium' ? 'bg-amber-50 text-amber-700' :
                'bg-rose-50 text-rose-700'
              }`}>
                <span className="text-[10px] font-black uppercase tracking-widest">Risk Level</span>
                <span className="text-xs font-black uppercase tracking-widest">{severity}</span>
              </div>
            </div>

            {/* AI Insight Box */}
            <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <Sparkles className="w-24 h-24 text-amber-400" />
              </div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Insight
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-bold relative z-10">
                Symptoms indicate low immediate risk but require monitoring for potential escalation.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-[40px] p-8 shadow-card border border-slate-100">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Quick Actions</h4>
              <div className="space-y-4">
                <ActionButton icon={<Pill className="w-4 h-4" />} label="Prescribe" color="text-blue-600 bg-blue-50" />
                <ActionButton icon={<Activity className="w-4 h-4" />} label="Recommend Test" color="text-emerald-600 bg-emerald-50" />
                <ActionButton icon={<ShieldAlert className="w-4 h-4" />} label="Emergency Alert" color="text-rose-600 bg-rose-50" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-[40px] p-10 shadow-card border border-slate-100">
              <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center text-accent mb-8 shadow-inner">
                <Info className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-4">Consultation Info</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-8 font-medium">
                Your doctor has been provided with your pre-screening summary and real-time vitals.
              </p>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation ID</span>
                  <span className="text-xs font-black text-slate-700">#CONS-9283</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority Level</span>
                  <span className="text-xs font-black text-accent uppercase tracking-widest">High</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) => (
  <button className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md ${color}`}>
    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/50">
      {icon}
    </div>
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    <ChevronRight className="w-5 h-5 ml-auto opacity-30" />
  </button>
);
