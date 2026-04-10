import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, ShieldCheck, Info, Loader2, TrendingUp } from 'lucide-react';
import { geminiService, PatientData, SimulationResult } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SimulationPanelProps {
  patient: PatientData;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({ patient }) => {
  const [scenario, setScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const runSim = async () => {
    if (!scenario) return;
    setLoading(true);
    try {
      const res = await geminiService.runSimulation(patient, scenario);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <Play className="w-5 h-5 text-indigo-600" />
          Digital Twin Simulation
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Simulate clinical interventions or lifestyle changes to predict future health trajectories.
        </p>

        <div className="flex gap-3">
          <input 
            type="text"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="e.g., Change medication to Metformin 500mg, increase daily steps to 10k"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
          />
          <button 
            onClick={runSim}
            disabled={loading || !scenario}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Run Simulation
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Prediction Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Simulation Outcome</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  {Math.round(result.confidence * 100)}% Confidence
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {result.prediction}
              </p>
              
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Recommendations</h4>
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl text-sm text-slate-700">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>

            {/* Projected Trend */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Projected Risk Score
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-amber-50 rounded-xl flex items-start gap-3">
                <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-[11px] text-amber-700 leading-tight">
                  This simulation is based on current digital twin modeling and historical patterns. 
                  Clinical judgment must be applied before implementing any changes.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
