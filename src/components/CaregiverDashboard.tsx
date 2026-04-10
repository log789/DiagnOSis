import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Heart, 
  Brain, 
  Moon, 
  Zap, 
  MessageSquare, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PatientData } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CaregiverDashboardProps {
  patient: PatientData;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({ patient }) => {
  // Mock alerts based on patient data
  const alerts = [
    { id: 1, type: 'warning', message: 'Sleep quality dropped by 15% this week', icon: <Moon className="w-4 h-4" /> },
    { id: 2, type: 'info', message: 'Medication adherence is excellent (98%)', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 3, type: 'danger', message: 'Cognitive reaction time increased by 200ms', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Critical Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((alert) => (
          <motion.div 
            key={alert.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-2xl border flex items-start gap-4 ${
              alert.type === 'danger' ? 'bg-rose-50 border-rose-100 text-danger' :
              alert.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-700' :
              'bg-blue-50 border-blue-100 text-primary'
            }`}
          >
            <div className="mt-1">{alert.icon}</div>
            <div className="text-sm font-medium">{alert.message}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cognitive Stability */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Brain className="text-primary" />
              Cognitive Stability Index
            </h3>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" /> Memory
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-secondary" /> Attention
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patient.cognitive.gameHistory.map(h => ({ date: h.date, score: h.score }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" hide />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <MetricBox label="Memory" value={`${patient.cognitive.memoryScore}%`} status="stable" />
            <MetricBox label="Attention" value={`${patient.cognitive.attentionScore}%`} status="improving" />
            <MetricBox label="Reaction" value={`${patient.cognitive.reactionTime}ms`} status="declining" />
          </div>
        </div>

        {/* Daily Routine & Adherence */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Clock className="text-primary" />
              Daily Routine
            </h3>
            <div className="space-y-6">
              <ProgressBar label="Sleep Quality" value={patient.lifestyle.sleepHours * 10} color="bg-primary" />
              <ProgressBar label="Physical Activity" value={(patient.lifestyle.steps / 10000) * 100} color="bg-secondary" />
              <ProgressBar label="Medication Adherence" value={patient.lifestyle.medicationAdherence} color="bg-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MessageSquare className="text-primary" />
              Recent Journal Sentiment
            </h3>
            <div className="space-y-4">
              {patient.emotional.journalEntries.slice(-2).map((entry, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{entry.date}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      entry.sentiment === 'Positive' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {entry.sentiment}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic line-clamp-2">"{entry.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricBox = ({ label, value, status }: { label: string, value: string, status: 'stable' | 'improving' | 'declining' }) => (
  <div className="p-4 bg-slate-50 rounded-2xl text-center">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xl font-black text-slate-800">{value}</p>
    <p className={`text-[10px] font-bold mt-1 ${
      status === 'improving' ? 'text-secondary' :
      status === 'declining' ? 'text-danger' :
      'text-slate-500'
    }`}>
      {status.toUpperCase()}
    </p>
  </div>
);

const ProgressBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold text-slate-600">
      <span>{label}</span>
      <span>{Math.round(value)}%</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
);
