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
  Trash2,
  ShoppingBag
} from 'lucide-react';
import { MedicationReminder } from '../services/geminiService';

interface MedicineReminderProps {
  schedule: MedicationReminder[];
  onUpdateStatus: (id: string, status: 'taken' | 'missed') => void;
  onAddReminder: (reminder: Omit<MedicationReminder, 'id' | 'status'>) => void;
  onDeleteReminder: (id: string) => void;
  onOrderMedicine?: (search: string) => void;
}

export const MedicineReminder: React.FC<MedicineReminderProps> = ({ 
  schedule, 
  onUpdateStatus, 
  onAddReminder,
  onDeleteReminder,
  onOrderMedicine
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
    <div className="bg-white rounded-[40px] p-10 shadow-card border border-slate-100">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shadow-inner">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Medication Hub</h3>
            <p className="text-sm text-slate-500 font-medium">Daily schedule & adherence</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="p-3 bg-accent text-white rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {insights && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4 shadow-sm"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800 leading-relaxed">
              <span className="text-xs font-black uppercase tracking-widest block mb-1 opacity-60">AI Insight</span>
              {insights}
            </p>
            <button 
              onClick={() => onOrderMedicine?.(schedule.find(s => s.status === 'missed')?.name || '')}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-sm"
            >
              <ShoppingBag className="w-3 h-3" />
              Order Missing Medicine
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-6 relative before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-1 before:bg-slate-50">
        {sortedSchedule.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-4 shadow-inner">
              <Pill className="w-8 h-8" />
            </div>
            <p className="text-sm text-slate-400 font-bold">No medications scheduled.</p>
          </div>
        ) : (
          sortedSchedule.map((item) => (
            <motion.div 
              layout
              key={item.id}
              className="relative pl-16 group"
            >
              <div className={`absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-md transition-all duration-500 ${
                item.status === 'taken' ? 'bg-emerald-500 text-white' :
                item.status === 'missed' ? 'bg-rose-500 text-white' :
                'bg-slate-100 text-slate-400'
              }`}>
                {item.status === 'taken' ? <CheckCircle2 className="w-6 h-6" /> : 
                 item.status === 'missed' ? <XCircle className="w-6 h-6" /> : 
                 <Clock className="w-6 h-6" />}
              </div>
              
              <div className={`p-6 rounded-[32px] border transition-all duration-300 ${
                item.status === 'taken' ? 'bg-emerald-50/30 border-emerald-100 shadow-sm' :
                item.status === 'missed' ? 'bg-rose-50/30 border-rose-100 shadow-sm' :
                'bg-white border-slate-100 hover:shadow-md'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.time}</span>
                      <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900">{item.name}</h4>
                    <p className="text-sm text-slate-500 font-bold">{item.dosage}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onUpdateStatus(item.id, 'taken')}
                          className="p-3 text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white rounded-xl transition-all active:scale-90"
                          title="Mark as Taken"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(item.id, 'missed')}
                          className="p-3 text-rose-600 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-xl transition-all active:scale-90"
                          title="Mark as Missed"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    <button 
                      onClick={() => onDeleteReminder(item.id)}
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
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
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white w-full max-w-lg rounded-[48px] p-12 relative z-10 shadow-2xl"
            >
              <h2 className="text-3xl font-black text-slate-900 mb-8">New Reminder</h2>
              <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Medicine Name</label>
                  <input 
                    type="text" 
                    required
                    value={newMed.name}
                    onChange={e => setNewMed({...newMed, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white outline-none font-bold transition-all"
                    placeholder="e.g. Lisinopril"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Dosage</label>
                  <input 
                    type="text" 
                    value={newMed.dosage}
                    onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white outline-none font-bold transition-all"
                    placeholder="e.g. 10mg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Date</label>
                    <input 
                      type="date" 
                      required
                      value={newMed.date}
                      onChange={e => setNewMed({...newMed, date: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white outline-none font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Time</label>
                    <input 
                      type="time" 
                      required
                      value={newMed.time}
                      onChange={e => setNewMed({...newMed, time: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white outline-none font-bold transition-all"
                    />
                  </div>
                </div>
                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-[24px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-5 bg-accent text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 active:scale-95"
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
