import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  ChevronRight, 
  Brain, 
  Activity, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  Sparkles, 
  Calendar,
  Filter,
  ArrowRight,
  ShieldAlert,
  Play,
  Pill,
  Stethoscope
} from 'lucide-react';
import { PatientData, geminiService } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DoctorDashboardProps {
  patients: PatientData[];
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ patients }) => {
  const [selectedPatient, setSelectedPatient] = useState<PatientData>(patients[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSummary, setAiSummary] = useState<{ summary: string; actions: string[] } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedAdherence, setSimulatedAdherence] = useState(selectedPatient.lifestyle.medicationAdherence);
  const [simulatedRisk, setSimulatedRisk] = useState(0);

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setAiSummary(null);
    setSimulationMode(false);
    setSimulatedAdherence(selectedPatient.lifestyle.medicationAdherence);
  }, [selectedPatient]);

  useEffect(() => {
    const baseRisk = selectedPatient.lifestyle.medicationAdherence < 70 ? 60 : 20;
    const adherenceDiff = selectedPatient.lifestyle.medicationAdherence - simulatedAdherence;
    setSimulatedRisk(Math.min(100, Math.max(0, baseRisk + (adherenceDiff * 0.8))));
  }, [simulatedAdherence, selectedPatient]);

  const generateAISummary = async () => {
    setIsGenerating(true);
    try {
      const summary = await geminiService.generateDigitalTwinSummary(selectedPatient);
      const actions = [
        "Schedule follow-up for cognitive assessment",
        "Adjust lisinopril dosage if BP remains elevated",
        "Recommend increased physical activity (target 5k steps)"
      ];
      setAiSummary({ summary: summary || "No summary available.", actions });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationMode(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-180px)] bg-white rounded-[40px] shadow-card border border-slate-200 overflow-hidden m-10">
      {/* Left Panel: Patient List */}
      <div className="w-96 border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-8 border-b border-slate-100 bg-white">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all"
            />
          </div>
          <div className="flex items-center justify-between mt-6">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Patient Directory</span>
            <button className="p-2 text-slate-400 hover:text-accent hover:bg-slate-50 rounded-xl transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredPatients.map((p) => (
            <button
              key={`${p.firstName}-${p.lastName}`}
              onClick={() => setSelectedPatient(p)}
              className={`w-full flex items-center gap-4 p-5 rounded-[28px] transition-all text-left group ${
                selectedPatient === p 
                  ? 'bg-white shadow-xl shadow-slate-200/50 border-accent/10 border' 
                  : 'hover:bg-white hover:shadow-md border border-transparent'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 ${
                selectedPatient === p ? 'bg-accent text-white rotate-3' : 'bg-slate-100 text-slate-400 group-hover:rotate-3'
              }`}>
                {p.firstName[0]}{p.lastName[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-extrabold text-slate-900 truncate">{p.firstName} {p.lastName}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{p.diagnoses[0]}</p>
              </div>
              {selectedPatient === p && (
                <motion.div layoutId="active-indicator">
                  <ChevronRight className="w-5 h-5 text-accent" />
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel: Patient Details */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-10 space-y-10">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-black text-slate-900">{selectedPatient.firstName} {selectedPatient.lastName}</h2>
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest">Active Twin</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500 font-bold">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  DOB: {selectedPatient.dob}
                </div>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {selectedPatient.gender}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all">
                <Clock className="w-5 h-5" />
              </button>
              <button 
                onClick={generateAISummary}
                disabled={isGenerating}
                className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 active:scale-95"
              >
                {isGenerating ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Sparkles className="w-5 h-5 text-amber-400" />
                )}
                AI Clinical Summary
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Insights Column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Digital Twin Summary Card */}
              <motion.div 
                layout
                className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                  <Brain className="w-48 h-48" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                    <Activity className="w-5 h-5" />
                  </div>
                  Digital Twin Analysis
                </h3>
                <AnimatePresence mode="wait">
                  {aiSummary ? (
                    <motion.div 
                      key="summary"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <p className="text-slate-600 leading-relaxed font-medium">
                        {aiSummary.summary}
                      </p>
                      <div className="space-y-4">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinical Recommendations</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {aiSummary.actions.map((action, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 text-xs font-bold text-slate-700 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="w-2 h-2 rounded-full bg-accent" />
                              {action}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="py-20 text-center">
                      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-inner">
                        <Sparkles className="w-10 h-10" />
                      </div>
                      <p className="text-slate-400 font-bold">Click "AI Clinical Summary" to generate deep insights.</p>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Health Timeline */}
              <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-card">
                <h3 className="text-xl font-extrabold text-slate-900 mb-10 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  Health Timeline
                </h3>
                <div className="space-y-10 relative before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-1 before:bg-slate-50">
                  <TimelineItem 
                    date="Today" 
                    title="Vitals Stabilized" 
                    description="BP recorded at 128/84. Heart rate consistent with target range." 
                    type="success"
                  />
                  <TimelineItem 
                    date="2 Days Ago" 
                    title="Cognitive Dip" 
                    description="Reaction time increased by 15% during memory training session." 
                    type="warning"
                  />
                  <TimelineItem 
                    date="1 Week Ago" 
                    title="Medication Refill" 
                    description="Lisinopril and Metformin refilled at local pharmacy." 
                    type="info"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-10">
              {/* Risk Alerts */}
              <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-card">
                <h3 className="text-lg font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  Risk Alerts
                </h3>
                <div className="space-y-4">
                  {selectedPatient.lifestyle.medicationAdherence < 80 && (
                    <RiskCard 
                      level="High" 
                      title="Adherence Risk" 
                      message="Patient has missed 3 doses this week." 
                    />
                  )}
                  {selectedPatient.cognitive.memoryScore < 70 && (
                    <RiskCard 
                      level="Moderate" 
                      title="Cognitive Decline" 
                      message="Memory scores trending downward over 30 days." 
                    />
                  )}
                  <RiskCard 
                    level="Low" 
                    title="Cardiovascular" 
                    message="Heart rate and BP within target range." 
                  />
                </div>
              </div>

              {/* What-If Simulation */}
              <div className="bg-slate-900 rounded-[40px] p-10 shadow-2xl text-white relative overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                  <Zap className="w-40 h-40 text-amber-400" />
                </div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-extrabold flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-amber-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    What-If Simulation
                  </h3>
                  <button 
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className={`p-3 rounded-xl transition-all active:scale-90 ${simulationMode ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/20' : 'bg-white/10 text-white'} ${isSimulating ? 'animate-pulse' : ''}`}
                  >
                    {isSimulating ? <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>

                <div className="space-y-10 relative z-10">
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Medication Adherence</span>
                      <span className="text-white">{simulatedAdherence}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={simulatedAdherence}
                      onChange={(e) => setSimulatedAdherence(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>

                  <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center backdrop-blur-sm relative overflow-hidden">
                    {isSimulating && (
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                      />
                    )}
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Projected Risk Impact</p>
                    <div className="flex items-center justify-center gap-4">
                      <div className={`text-4xl font-black transition-colors duration-500 ${
                        isSimulating ? 'text-slate-500' :
                        simulatedRisk > 50 ? 'text-rose-400' : simulatedRisk > 30 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {isSimulating ? '--' : `${Math.round(simulatedRisk)}%`}
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-600" />
                      <div className="text-xs font-black uppercase tracking-widest text-slate-300">
                        {isSimulating ? 'Calculating...' : (simulatedRisk > 50 ? 'Critical' : simulatedRisk > 30 ? 'Moderate' : 'Stable')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ date, title, description, type }: { date: string, title: string, description: string, type: 'success' | 'warning' | 'info' }) => (
  <div className="relative pl-16">
    <div className={`absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-md transition-transform hover:scale-110 duration-300 ${
      type === 'success' ? 'bg-emerald-500 text-white' :
      type === 'warning' ? 'bg-amber-500 text-white' :
      'bg-accent text-white'
    }`}>
      {type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : 
       type === 'warning' ? <AlertCircle className="w-6 h-6" /> : 
       <Clock className="w-6 h-6" />}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{date}</p>
      <h4 className="text-base font-extrabold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-500 mt-1 leading-relaxed font-medium">{description}</p>
    </div>
  </div>
);

const RiskCard = ({ level, title, message }: { level: 'High' | 'Moderate' | 'Low', title: string, message: string }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className={`p-5 rounded-3xl border transition-all ${
      level === 'High' ? 'bg-rose-50 border-rose-100' :
      level === 'Moderate' ? 'bg-amber-50 border-amber-100' :
      'bg-emerald-50 border-emerald-100'
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <h4 className={`text-[10px] font-black uppercase tracking-widest ${
        level === 'High' ? 'text-rose-600' :
        level === 'Moderate' ? 'text-amber-600' :
        'text-emerald-600'
      }`}>{title}</h4>
      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
        level === 'High' ? 'bg-rose-100 text-rose-700' :
        level === 'Moderate' ? 'bg-amber-100 text-amber-700' :
        'bg-emerald-100 text-emerald-700'
      }`}>{level}</span>
    </div>
    <p className="text-xs text-slate-600 font-bold leading-relaxed">{message}</p>
  </motion.div>
);
