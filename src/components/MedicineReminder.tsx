import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pill, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  AlertCircle, 
  Calendar, 
  ChevronRight,
  Sparkles,
  Trash2
} from 'lucide-react';
import { MedicationReminder } from '../services/geminiService';

interface MedicineReminderProps {
  schedule: MedicationReminder[];
  onUpdateStatus: (id: string, status: 'taken' | 'missed') => void;
  onAddReminder: (reminder: Omit<MedicationReminder, 'id' | 'status'>) => void;
  onDeleteReminder: (id: string) => void;
}

export const MedicineReminder: React.FC<MedicineReminderProps> = ({ 
  schedule, 
  onUpdateStatus, 
  onAddReminder,
  onDeleteReminder
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '', date: new Date().toISOString().split('T')[0] });

  const sortedSchedule = useMemo(() => {
    if (!Array.isArray(schedule)) return [];
    return [...schedule].sort((a, b) => {
      const timeA = `${a.date}T${a.time}`;
      const timeB = `${b.date}T${b.time}`;
      return new Date(timeA).getTime() - new Date(timeB).getTime();
    });
  }, [schedule]);

  const insights = useMemo(() => {
    if (!Array.isArray(schedule)) return null;
    const missed = schedule.filter(s => s.status === 'missed');
    if (missed.length === 0) return null;

    const eveningMissed = missed.filter(s => {
      const hour = parseInt(s.time.split(':')[0]);
      return hour >= 17;
    });

    if (eveningMissed.length >= 2) {
      return "You often miss your evening medication. Consider setting an earlier alarm or placing your pills near your dinner table.";
    }
    
    if (missed.length >= 3) {
      return "Frequent missed doses detected. Maintaining consistency is key to your treatment stability.";
    }

    return null;
  }, [schedule]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name || !newMed.time) return;
    onAddReminder(newMed);
    setNewMed({ name: '', dosage: '', time: '', date: new Date().toISOString().split('T')[0] });
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Smart Medication</h3>
            <p className="text-xs text-slate-500 font-medium">Daily schedule & adherence</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="p-2 bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {insights && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3"
        >
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-amber-800 leading-relaxed">
            <span className="font-bold">AI Insight:</span> {insights}
          </p>
        </motion.div>
      )}

      <div className="space-y-4 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
        {sortedSchedule.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-400 italic">No medications scheduled. Add one to start tracking.</p>
          </div>
        ) : (
          sortedSchedule.map((item) => (
            <motion.div 
              layout
              key={item.id}
              className="relative pl-12 group"
            >
              <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${
                item.status === 'taken' ? 'bg-emerald-500 text-white' :
                item.status === 'missed' ? 'bg-rose-500 text-white' :
                'bg-slate-100 text-slate-400'
              }`}>
                {item.status === 'taken' ? <CheckCircle2 className="w-5 h-5" /> : 
                 item.status === 'missed' ? <XCircle className="w-5 h-5" /> : 
                 <Clock className="w-5 h-5" />}
              </div>
              
              <div className={`p-4 rounded-2xl border transition-all ${
                item.status === 'taken' ? 'bg-emerald-50/30 border-emerald-100' :
                item.status === 'missed' ? 'bg-rose-50/30 border-rose-100' :
                'bg-white border-slate-100'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.time}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{item.dosage}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => onUpdateStatus(item.id, 'taken')}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Mark as Taken"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(item.id, 'missed')}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Mark as Missed"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => onDeleteReminder(item.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[40px] p-8 relative z-10 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-slate-900 mb-6">New Reminder</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Medicine Name</label>
                  <input 
                    type="text" 
                    required
                    value={newMed.name}
                    onChange={e => setNewMed({...newMed, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none"
                    placeholder="e.g. Lisinopril"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dosage</label>
                  <input 
                    type="text" 
                    value={newMed.dosage}
                    onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none"
                    placeholder="e.g. 10mg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date</label>
                    <input 
                      type="date" 
                      required
                      value={newMed.date}
                      onChange={e => setNewMed({...newMed, date: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Time</label>
                    <input 
                      type="time" 
                      required
                      value={newMed.time}
                      onChange={e => setNewMed({...newMed, time: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                  >
                    Set Reminder
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
