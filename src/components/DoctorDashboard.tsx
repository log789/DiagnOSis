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
  Play
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
    // Simple risk simulation logic
    const baseRisk = selectedPatient.lifestyle.medicationAdherence < 70 ? 60 : 20;
    const adherenceDiff = selectedPatient.lifestyle.medicationAdherence - simulatedAdherence;
    setSimulatedRisk(Math.min(100, Math.max(0, baseRisk + (adherenceDiff * 0.8))));
  }, [simulatedAdherence, selectedPatient]);

  const generateAISummary = async () => {
    setIsGenerating(true);
    try {
      // In a real app, we'd call a specific clinical summary prompt
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

  return (
    <div className="flex h-[calc(100vh-180px)] bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden m-6">
      {/* Left Panel: Patient List */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Cases</span>
            <button className="p-1 text-slate-400 hover:text-primary transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredPatients.map((p) => (
            <button
              key={`${p.firstName}-${p.lastName}`}
              onClick={() => setSelectedPatient(p)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
                selectedPatient === p 
                  ? 'bg-white shadow-md border-primary/10 border ring-1 ring-primary/5' 
                  : 'hover:bg-white hover:shadow-sm border border-transparent'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                selectedPatient === p ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {p.firstName[0]}{p.lastName[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{p.firstName} {p.lastName}</p>
                <p className="text-[10px] text-slate-500 font-medium">{p.diagnoses[0]}</p>
              </div>
              {selectedPatient === p && <ChevronRight className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel: Patient Details */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-8 space-y-8">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-900">{selectedPatient.firstName} {selectedPatient.lastName}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
                <span>DOB: {selectedPatient.dob}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>{selectedPatient.gender}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="px-2 py-0.5 bg-blue-50 text-primary rounded-md text-[10px] font-black uppercase tracking-widest">Digital Twin Active</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={generateAISummary}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
              >
                {isGenerating ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-400" />
                )}
                AI Clinical Summary
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Insights Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Digital Twin Summary Card */}
              <motion.div 
                layout
                className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Brain className="w-32 h-32" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Digital Twin Analysis
                </h3>
                <AnimatePresence mode="wait">
                  {aiSummary ? (
                    <motion.div 
                      key="summary"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {aiSummary.summary}
                      </p>
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suggested Actions</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {aiSummary.actions.map((action, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 text-xs font-bold text-slate-700">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              {action}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-slate-400 text-sm italic">Click "AI Clinical Summary" to generate deep insights for {selectedPatient.firstName}.</p>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Health Timeline */}
              <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Health Timeline
                </h3>
                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  <TimelineItem 
                    date="Today" 
                    title="Vitals Stabilized" 
                    description="BP recorded at 128/84. Heart rate consistent." 
                    type="success"
                  />
                  <TimelineItem 
                    date="2 Days Ago" 
                    title="Cognitive Dip" 
                    description="Reaction time increased by 15% during memory game." 
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
            <div className="space-y-6">
              {/* Risk Alerts */}
              <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-danger" />
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
              <div className="bg-slate-900 rounded-[32px] p-8 shadow-xl text-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    What-If Simulation
                  </h3>
                  <button 
                    onClick={() => setSimulationMode(!simulationMode)}
                    className={`p-2 rounded-lg transition-all ${simulationMode ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-white'}`}
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span>Medication Adherence</span>
                      <span className="text-white">{simulatedAdherence}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={simulatedAdherence}
                      onChange={(e) => setSimulatedAdherence(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>

                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Projected Risk Impact</p>
                    <div className="flex items-center justify-center gap-3">
                      <div className={`text-3xl font-black ${
                        simulatedRisk > 50 ? 'text-rose-400' : simulatedRisk > 30 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {Math.round(simulatedRisk)}%
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                      <div className="text-xs font-bold text-slate-300">
                        {simulatedRisk > 50 ? 'Critical Intervention' : simulatedRisk > 30 ? 'Monitor Closely' : 'Maintain Plan'}
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
  <div className="relative pl-12">
    <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
      type === 'success' ? 'bg-emerald-500 text-white' :
      type === 'warning' ? 'bg-amber-500 text-white' :
      'bg-blue-500 text-white'
    }`}>
      {type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
       type === 'warning' ? <AlertCircle className="w-5 h-5" /> : 
       <Clock className="w-5 h-5" />}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{date}</p>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
    </div>
  </div>
);

const RiskCard = ({ level, title, message }: { level: 'High' | 'Moderate' | 'Low', title: string, message: string }) => (
  <div className={`p-4 rounded-2xl border ${
    level === 'High' ? 'bg-rose-50 border-rose-100' :
    level === 'Moderate' ? 'bg-amber-50 border-amber-100' :
    'bg-emerald-50 border-emerald-100'
  }`}>
    <div className="flex items-center justify-between mb-1">
      <h4 className={`text-xs font-black uppercase tracking-widest ${
        level === 'High' ? 'text-rose-600' :
        level === 'Moderate' ? 'text-amber-600' :
        'text-emerald-600'
      }`}>{title}</h4>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
        level === 'High' ? 'bg-rose-100 text-rose-700' :
        level === 'Moderate' ? 'bg-amber-100 text-amber-700' :
        'bg-emerald-100 text-emerald-700'
      }`}>{level}</span>
    </div>
    <p className="text-xs text-slate-600 font-medium">{message}</p>
  </div>
);
