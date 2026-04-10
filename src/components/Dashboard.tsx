import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, AlertCircle, Heart, Thermometer, Droplets, TrendingUp, User as UserIcon, Brain, Moon, Zap, Smile, ShieldAlert, Sparkles, Pill, Bed, Phone, Ambulance, Stethoscope, MapPin, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PatientData, MedicationReminder } from '../services/geminiService';
import { Emergency } from '../App';
import { MedicineReminder } from './MedicineReminder';

interface DashboardProps {
  patient: PatientData;
  summary: string;
  onTriggerEmergency?: (type: string, severity: Emergency['severity']) => void;
  onUpdateMedStatus: (id: string, status: 'taken' | 'missed') => void;
  onAddMedReminder: (reminder: Omit<MedicationReminder, 'id' | 'status'>) => void;
  onDeleteMedReminder: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  patient, 
  summary, 
  onTriggerEmergency,
  onUpdateMedStatus,
  onAddMedReminder,
  onDeleteMedReminder
}) => {
  const [healthScore, setHealthScore] = useState(85);
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Moderate' | 'High'>('Low');
  const [localInsights, setLocalInsights] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  useEffect(() => {
    if (healthScore > 80) setRiskLevel('Low');
    else if (healthScore > 50) setRiskLevel('Moderate');
    else setRiskLevel('High');
  }, [healthScore]);

  const handleSimulate = (type: 'miss' | 'improve') => {
    setIsSimulating(true);
    setTimeout(() => {
      if (type === 'miss') {
        setHealthScore(prev => Math.max(0, prev - 12));
        setLocalInsights(prev => ["Patient shows declining adherence, risk increasing.", ...prev.slice(0, 2)]);
      } else {
        setHealthScore(prev => Math.min(100, prev + 8));
        setLocalInsights(prev => ["Improved sleep cycle detected. Cognitive recovery projected.", ...prev.slice(0, 2)]);
      }
      setIsSimulating(false);
    }, 600);
  };

  const handleEmergencyAction = (type: string, severity: Emergency['severity']) => {
    onTriggerEmergency?.(type, severity);
    setIsEmergencyModalOpen(false);
    // Visual feedback
    setLocalInsights(prev => [`Emergency Alert: ${type} triggered. Hospital notified.`, ...prev.slice(0, 2)]);
  };

  return (
    <div className="space-y-6 p-6 relative">
      {/* Top Row: Health Score & Vitals */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Health Score Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/10" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Overall Health Score</p>
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-100"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251.2}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * healthScore) / 100 }}
                className={`${healthScore > 80 ? 'text-secondary' : healthScore > 50 ? 'text-amber-500' : 'text-danger'} transition-colors duration-500`}
              />
            </svg>
            <span className="absolute text-2xl font-black text-slate-800">{healthScore}</span>
          </div>
          <div className={`mt-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            riskLevel === 'Low' ? 'bg-emerald-50 text-secondary' : 
            riskLevel === 'Moderate' ? 'bg-amber-50 text-amber-600' : 
            'bg-rose-50 text-danger'
          }`}>
            {riskLevel} Risk
          </div>
        </motion.div>

        <StatCard icon={<Heart className="text-danger" />} label="Heart Rate" value={`${patient.vitals.heartRate} bpm`} trend="+2%" />
        <StatCard icon={<Brain className="text-primary" />} label="Cognitive Score" value={`${Math.round(patient.cognitive.memoryScore)}`} trend="Stable" />
        <StatCard icon={<Moon className="text-blue-500" />} label="Sleep" value={`${patient.lifestyle.sleepHours}h`} trend="-5%" />
        <StatCard icon={<Activity className="text-secondary" />} label="Activity" value={`${patient.lifestyle.steps} steps`} trend="+12%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Summary & Trajectory */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" />
                Digital Twin Summary
              </h2>
              <span className="px-3 py-1 bg-blue-50 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">Live Sync</span>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                {summary || "Analyzing patient data to generate twin summary..."}
              </p>
            </div>
            
            <div className="mt-10">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Health Trajectory (6 Months)
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={patient.cognitive.gameHistory.map(h => ({ time: h.date, value: h.score }))}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" hide />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Emergency & Simulation Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Button Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-600 rounded-3xl p-8 shadow-xl shadow-rose-200 flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-rose-500 opacity-20"
              />
              <ShieldAlert className="w-12 h-12 text-white mb-4 relative z-10" />
              <h3 className="text-xl font-black text-white mb-2 relative z-10">Emergency System</h3>
              <p className="text-rose-100 text-xs mb-6 relative z-10">Immediate assistance required?</p>
              <button 
                onClick={() => setIsEmergencyModalOpen(true)}
                className="w-full py-4 bg-white text-rose-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-50 transition-colors relative z-10 shadow-lg"
              >
                Trigger SOS
              </button>
            </motion.div>

            {/* Simulate Change Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Simulate Change
              </h3>
              <div className="space-y-4">
                <button 
                  onClick={() => handleSimulate('miss')}
                  disabled={isSimulating}
                  className="w-full flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-2xl group hover:bg-rose-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl text-danger shadow-sm">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-rose-900">Miss Medication</p>
                    </div>
                  </div>
                  <TrendingUp className="w-4 h-4 text-danger rotate-180" />
                </button>

                <button 
                  onClick={() => handleSimulate('improve')}
                  disabled={isSimulating}
                  className="w-full flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl group hover:bg-emerald-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl text-secondary shadow-sm">
                      <Bed className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-emerald-900">Improve Sleep</p>
                    </div>
                  </div>
                  <TrendingUp className="w-4 h-4 text-secondary" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sidebar: AI Insights & Metrics */}
        <div className="space-y-6">
          {/* AI Insight Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24" />
            </div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              AI Insights
            </h3>
            <div className="space-y-4 relative z-10">
              <AnimatePresence mode="popLayout">
                {localInsights.length > 0 ? (
                  localInsights.map((insight, idx) => (
                    <motion.div 
                      key={insight + idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm"
                    >
                      <p className="text-sm leading-relaxed text-slate-200">
                        {insight}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10 italic text-slate-400 text-sm">
                    No recent simulation insights. Use the simulation panel to generate predictions.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Cognitive & Lifestyle Details */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Cognitive Health
            </h3>
            <div className="space-y-4">
              <MetricRow label="Memory" value={patient.cognitive.memoryScore} />
              <MetricRow label="Attention" value={patient.cognitive.attentionScore} />
              <MetricRow label="Reaction" value={Math.round((1000 / patient.cognitive.reactionTime) * 100)} />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" />
              Lifestyle Adherence
            </h3>
            <div className="space-y-4">
              <MetricRow label="Medication" value={patient.lifestyle.medicationAdherence} />
              <MetricRow label="Nutrition" value={patient.lifestyle.nutritionScore} />
              <MetricRow label="Activity" value={(patient.lifestyle.steps / 10000) * 100} />
            </div>
          </div>

          {/* Medicine Reminder Component */}
          <MedicineReminder 
            schedule={patient.medicationSchedule}
            onUpdateStatus={onUpdateMedStatus}
            onAddReminder={onAddMedReminder}
            onDeleteReminder={onDeleteMedReminder}
          />
        </div>
      </div>

      {/* Emergency Modal */}
      <AnimatePresence>
        {isEmergencyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEmergencyModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[40px] p-8 relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-rose-600" />
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Emergency SOS</h2>
                    <p className="text-xs text-slate-500">Select required assistance</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEmergencyModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <EmergencyOption 
                  icon={<Ambulance />} 
                  label="Call Ambulance" 
                  description="Dispatch emergency medical team"
                  color="bg-rose-600"
                  onClick={() => handleEmergencyAction('Ambulance Dispatch', 'Critical')}
                />
                <EmergencyOption 
                  icon={<Phone />} 
                  label="Connect to Doctor" 
                  description="Direct line to Dr. Robert Reed"
                  color="bg-blue-600"
                  onClick={() => handleEmergencyAction('Doctor Consultation', 'High')}
                />
                <EmergencyOption 
                  icon={<Stethoscope />} 
                  label="Medicine Suggestion" 
                  description="AI-guided emergency medication"
                  color="bg-amber-500"
                  onClick={() => handleEmergencyAction('Medication Guidance', 'Moderate')}
                />
                <EmergencyOption 
                  icon={<MapPin />} 
                  label="Nearby Hospitals" 
                  description="Find closest emergency care"
                  color="bg-emerald-600"
                  onClick={() => handleEmergencyAction('Hospital Search', 'Moderate')}
                />
              </div>

              <p className="mt-8 text-center text-[10px] text-slate-400 font-medium leading-relaxed">
                By triggering SOS, your real-time vitals and location will be shared with emergency responders.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EmergencyOption = ({ icon, label, description, color, onClick }: { icon: React.ReactNode, label: string, description: string, color: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-4 p-4 rounded-3xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-left group"
  >
    <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform`}>
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' }) : icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-black text-slate-800">{label}</p>
      <p className="text-[10px] text-slate-500 font-medium">{description}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
  </button>
);

const MetricRow = ({ label, value }: { label: string, value: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
      <span>{label}</span>
      <span>{Math.round(value)}%</span>
    </div>
    <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        className="h-full bg-primary rounded-full"
      />
    </div>
  </div>
);

const StatCard = ({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 transition-all hover:shadow-xl hover:shadow-blue-50"
  >
    <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-xl font-black text-slate-900">{value}</p>
        <span className={cn(
          "text-[10px] font-black px-2 py-0.5 rounded-full",
          trend.includes('+') ? "bg-rose-50 text-danger" : 
          trend === 'Stable' ? "bg-slate-50 text-slate-600" : "bg-emerald-50 text-secondary"
        )}>
          {trend}
        </span>
      </div>
    </div>
  </motion.div>
);

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
