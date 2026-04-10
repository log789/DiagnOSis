import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Users, 
  Bed, 
  Activity, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  User,
  MapPin,
  Ambulance,
  Phone,
  Check
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Emergency } from '../App';

const MOCK_HOSPITAL_DATA = [
  { department: 'ER', occupancy: 85, status: 'High' },
  { department: 'ICU', occupancy: 92, status: 'Critical' },
  { department: 'Surgery', occupancy: 60, status: 'Normal' },
  { department: 'Pediatrics', occupancy: 45, status: 'Normal' },
  { department: 'Cardiology', occupancy: 78, status: 'High' },
];

interface HospitalPanelProps {
  emergencies?: Emergency[];
  onResolveEmergency?: (id: string) => void;
}

export const HospitalPanel: React.FC<HospitalPanelProps> = ({ emergencies = [], onResolveEmergency }) => {
  return (
    <div className="p-6 space-y-8">
      {/* Active Emergencies Section */}
      <AnimatePresence>
        {emergencies.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-rose-600 rounded-[40px] p-8 shadow-2xl shadow-rose-200 text-white relative overflow-hidden"
          >
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-white"
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <ShieldAlert className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">Active Emergencies</h3>
                    <p className="text-rose-100 text-sm font-medium">Immediate response required for {emergencies.length} incoming {emergencies.length === 1 ? 'request' : 'requests'}</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-xs font-black uppercase tracking-widest backdrop-blur-md">
                  Live Monitoring
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {emergencies.map((emergency) => (
                  <motion.div 
                    key={emergency.id}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl p-6 text-slate-900 shadow-xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black">{emergency.patientName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{emergency.timestamp}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        emergency.severity === 'Critical' ? 'bg-rose-100 text-rose-600' :
                        emergency.severity === 'High' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {emergency.severity}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        {emergency.type.includes('Ambulance') ? <Ambulance className="w-4 h-4 text-rose-500" /> : 
                         emergency.type.includes('Doctor') ? <Phone className="w-4 h-4 text-blue-500" /> :
                         <Activity className="w-4 h-4 text-amber-500" />}
                        <span>{emergency.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>Home Location (Syncing...)</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => onResolveEmergency?.(emergency.id)}
                        className="flex-1 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100"
                      >
                        Dispatch
                      </button>
                      <button 
                        onClick={() => onResolveEmergency?.(emergency.id)}
                        className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <HospitalStatCard 
          icon={<Bed className="text-primary" />} 
          label="Bed Occupancy" 
          value="78%" 
          subValue="245 / 312 Beds" 
        />
        <HospitalStatCard 
          icon={<Users className="text-secondary" />} 
          label="Active Patients" 
          value="1,240" 
          subValue="+12 from yesterday" 
        />
        <HospitalStatCard 
          icon={<Clock className="text-amber-500" />} 
          label="Avg. Wait Time" 
          value="24m" 
          subValue="ER Department" 
        />
        <HospitalStatCard 
          icon={<Activity className="text-indigo-500" />} 
          label="Staff on Duty" 
          value="182" 
          subValue="42 Doctors, 140 Nurses" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Occupancy Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="text-primary" />
              Department Load Analysis
            </h3>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_HOSPITAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="occupancy" radius={[6, 6, 0, 0]}>
                  {MOCK_HOSPITAL_DATA.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.occupancy > 90 ? '#EF4444' : entry.occupancy > 75 ? '#F59E0B' : '#2563EB'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Facility Alerts & Status */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="text-danger" />
            Facility Alerts
          </h3>
          <div className="space-y-4">
            <AlertItem 
              type="danger" 
              title="ICU Capacity Warning" 
              time="10 mins ago" 
              message="ICU occupancy reached 92%. Divert non-critical cases." 
            />
            <AlertItem 
              type="warning" 
              title="Staffing Shortage" 
              time="1 hour ago" 
              message="Night shift nursing staff below minimum threshold in Ward B." 
            />
            <AlertItem 
              type="success" 
              title="System Maintenance" 
              time="4 hours ago" 
              message="EHR system update completed successfully." 
            />
          </div>
        </div>
      </div>

      {/* Resource Management */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="text-primary" />
          Resource Allocation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ResourceItem label="Oxygen Supply" value={85} color="bg-primary" />
          <ResourceItem label="Blood Bank (O-)" value={42} color="bg-danger" />
          <ResourceItem label="Emergency Meds" value={94} color="bg-secondary" />
        </div>
      </div>
    </div>
  );
};

const HospitalStatCard = ({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue: string }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 transition-all hover:shadow-xl hover:shadow-indigo-50"
  >
    <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-black text-slate-900">{value}</p>
      <p className="text-[10px] text-slate-500 font-medium">{subValue}</p>
    </div>
  </motion.div>
);

const AlertItem = ({ type, title, time, message }: { type: 'danger' | 'warning' | 'success', title: string, time: string, message: string }) => (
  <div className={`p-4 rounded-2xl border ${
    type === 'danger' ? 'bg-rose-50 border-rose-100' :
    type === 'warning' ? 'bg-amber-50 border-amber-100' :
    'bg-emerald-50 border-emerald-100'
  }`}>
    <div className="flex justify-between items-start mb-1">
      <h4 className={`text-sm font-bold ${
        type === 'danger' ? 'text-rose-700' :
        type === 'warning' ? 'text-amber-700' :
        'text-emerald-700'
      }`}>{title}</h4>
      <span className="text-[10px] text-slate-400 font-medium">{time}</span>
    </div>
    <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
  </div>
);

const ResourceItem = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-xs font-bold text-slate-600">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full ${color}`}
      />
    </div>
    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
      {value < 50 ? <AlertTriangle className="w-3 h-3 text-danger" /> : <CheckCircle2 className="w-3 h-3 text-secondary" />}
      {value < 50 ? 'Low Stock' : 'Optimal'}
    </div>
  </div>
);
