import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, AlertCircle, Heart, Thermometer, Droplets, TrendingUp, User as UserIcon, Brain, Moon, Zap, Smile, ShieldAlert, Sparkles, Pill, Bed, Phone, Ambulance, Stethoscope, MapPin, X, ChevronRight, Play, ArrowRight, ShoppingBag } from 'lucide-react';
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
  onOrderMedicine?: (search: string) => void;
  onTabChange?: (tab: any) => void;
}

const MOCK_CHART_DATA = [
  { name: 'Mon', value: 65 },
  { name: 'Tue', value: 72 },
  { name: 'Wed', value: 68 },
  { name: 'Thu', value: 85 },
  { name: 'Fri', value: 78 },
  { name: 'Sat', value: 90 },
  { name: 'Sun', value: 88 },
];

export const Dashboard: React.FC<DashboardProps> = ({ 
  patient, 
  summary, 
  onTriggerEmergency,
  onUpdateMedStatus,
  onAddMedReminder,
  onDeleteMedReminder,
  onOrderMedicine,
  onTabChange
}) => {
  const [healthScore, setHealthScore] = useState(85);
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Moderate' | 'High'>('Low');
  const [localInsights, setLocalInsights] = useState<string[]>([]);
  const [simulationMode, setSimulationMode] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedAdherence, setSimulatedAdherence] = useState(patient.lifestyle.medicationAdherence);
  const [simulatedRisk, setSimulatedRisk] = useState(20);

  useEffect(() => {
    const baseRisk = patient.lifestyle.medicationAdherence < 70 ? 60 : 20;
    const adherenceDiff = patient.lifestyle.medicationAdherence - simulatedAdherence;
    setSimulatedRisk(Math.min(100, Math.max(0, baseRisk + (adherenceDiff * 0.8))));
  }, [simulatedAdherence, patient]);

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationMode(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1500);
  };

  useEffect(() => {
    if (healthScore > 80) setRiskLevel('Low');
    else if (healthScore > 50) setRiskLevel('Moderate');
    else setRiskLevel('High');
  }, [healthScore]);

  const handleEmergencyAction = (type: string, severity: Emergency['severity']) => {
    onTriggerEmergency?.(type, severity);
  };

  return (
    <div className="p-10 space-y-10">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          icon={<Heart className="w-6 h-6" />} 
          label="Heart Rate" 
          value={`${patient.vitals.heartRate} bpm`} 
          trend="+2%" 
          color="text-rose-500"
          bgColor="bg-rose-50"
        />
        <StatCard 
          icon={<Activity className="w-6 h-6" />} 
          label="Blood Pressure" 
          value={patient.vitals.bloodPressure} 
          trend="Stable" 
          color="text-blue-500"
          bgColor="bg-blue-50"
        />
        <StatCard 
          icon={<Droplets className="w-6 h-6" />} 
          label="Oxygen Saturation" 
          value={`${patient.vitals.oxygen}%`} 
          trend="-1%" 
          color="text-emerald-500"
          bgColor="bg-emerald-50"
        />
        <StatCard 
          icon={<Thermometer className="w-6 h-6" />} 
          label="Temperature" 
          value={`${patient.vitals.temperature}°F`} 
          trend="Normal" 
          color="text-amber-500"
          bgColor="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Health Trajectory */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[40px] p-10 shadow-card border border-slate-100 hover:shadow-xl transition-shadow duration-500">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Health Trajectory</h3>
                <p className="text-sm text-slate-500 font-medium">Real-time vitals monitoring</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Improving
                </span>
                <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none cursor-pointer">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} 
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '15px'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Digital Twin Summary */}
            <div className="bg-slate-900 rounded-[40px] p-10 shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Sparkles className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-extrabold">Digital Twin Insights</h3>
                </div>
                <div className="space-y-6">
                  <p className="text-slate-300 text-sm leading-relaxed font-medium">
                    {summary || "Analyzing your health data to generate personalized insights..."}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 text-sm font-bold text-white hover:text-amber-400 transition-colors group/btn">
                      View Full Analysis
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => onOrderMedicine?.('Vitamin C')}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-400 transition-all"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Order Suggested Vitamins
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cognitive Score Card */}
            <div className="bg-white rounded-[40px] p-10 shadow-card border border-slate-100 flex flex-col items-center justify-center text-center group hover:border-accent/20 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                <Brain className="w-24 h-24 text-accent" />
              </div>
              <div className="w-24 h-24 rounded-full border-[6px] border-slate-50 flex items-center justify-center relative mb-6 shadow-inner">
                <div 
                  className="absolute inset-0 rounded-full border-[6px] border-accent border-t-transparent transition-transform duration-1000" 
                  style={{ transform: `rotate(${(patient.cognitive.memoryScore / 100) * 360}deg)` }}
                />
                <span className="text-3xl font-black text-slate-900">{patient.cognitive.memoryScore}</span>
              </div>
              <h4 className="text-lg font-extrabold text-slate-900 mb-2">Cognitive Score</h4>
              <div className="flex items-center gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  patient.cognitive.memoryScore >= 80 ? 'bg-emerald-50 text-emerald-600' :
                  patient.cognitive.memoryScore >= 60 ? 'bg-amber-50 text-amber-600' :
                  'bg-rose-50 text-rose-600'
                }`}>
                  {patient.cognitive.memoryScore >= 80 ? 'Improving' : patient.cognitive.memoryScore >= 60 ? 'Stable' : 'Declining'}
                </span>
              </div>
              <button 
                onClick={() => onTabChange?.('game')}
                className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-300 active:scale-95"
              >
                Start Training
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-10">
          {/* Emergency Panel */}
          <div className="bg-rose-50 rounded-[40px] p-10 border border-rose-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-rose-900">Emergency Hub</h3>
                <p className="text-xs text-rose-600 font-bold uppercase tracking-wider">Immediate Assistance</p>
              </div>
            </div>
            <div className="space-y-4">
              <EmergencyOption 
                icon={<Ambulance className="w-5 h-5" />} 
                label="Call Ambulance" 
                onClick={() => handleEmergencyAction('Ambulance', 'Critical')}
              />
              <EmergencyOption 
                icon={<Phone className="w-5 h-5" />} 
                label="Doctor Connect" 
                onClick={() => handleEmergencyAction('Doctor Call', 'High')}
              />
              <EmergencyOption 
                icon={<MapPin className="w-5 h-5" />} 
                label="Nearby Hospitals" 
                onClick={() => handleEmergencyAction('Hospital Search', 'Moderate')}
              />
            </div>
          </div>

          {/* Lifestyle Adherence */}
          <div className="bg-white rounded-[40px] p-10 shadow-card border border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Activity className="w-5 h-5" />
              </div>
              Lifestyle Adherence
            </h3>
            <div className="space-y-8">
              <MetricRow label="Medication" value={patient.lifestyle.medicationAdherence} color="bg-blue-500" />
              <MetricRow label="Nutrition" value={patient.lifestyle.nutritionScore} color="bg-emerald-500" />
              <MetricRow label="Activity" value={(patient.lifestyle.steps / 10000) * 100} color="bg-amber-500" />
            </div>
          </div>

          {/* Medicine Reminder Component */}
          <MedicineReminder 
            schedule={patient.medicationSchedule}
            onUpdateStatus={onUpdateMedStatus}
            onAddReminder={onAddMedReminder}
            onDeleteReminder={onDeleteMedReminder}
            onOrderMedicine={onOrderMedicine}
          />

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
  );
};

const StatCard = ({ icon, label, value, trend, color, bgColor }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-[32px] shadow-card border border-slate-100 flex items-center gap-6 group transition-all duration-300 hover:border-accent/10"
  >
    <div className={`w-16 h-16 ${bgColor} ${color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-xl font-black text-slate-900">{value}</h4>
        <span className={`text-[10px] font-black ${trend.includes('+') ? 'text-emerald-500' : trend.includes('-') ? 'text-rose-500' : 'text-slate-400'}`}>
          {trend}
        </span>
      </div>
    </div>
  </motion.div>
);

const MetricRow = ({ label, value, color }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <span className="text-sm font-black text-slate-900">{Math.round(value)}%</span>
    </div>
    <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color} rounded-full shadow-sm`}
      />
    </div>
  </div>
);

const EmergencyOption = ({ icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl border border-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white transition-all duration-300 group shadow-sm active:scale-95"
  >
    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center group-hover:bg-white/20 transition-colors">
      {icon}
    </div>
    <span className="text-sm font-black uppercase tracking-widest">{label}</span>
    <ChevronRight className="w-5 h-5 ml-auto opacity-30 group-hover:opacity-100 transition-opacity" />
  </button>
);
