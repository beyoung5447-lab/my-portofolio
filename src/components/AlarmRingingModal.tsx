import React from 'react';
import { useMedication } from '../context/MedicationContext';
import { Bell, CheckCircle2, Clock, Volume2, X } from 'lucide-react';

export const AlarmRingingModal: React.FC = () => {
  const { activeRingingAlarm, dismissRingingAlarm, highContrast, fontSize } = useMedication();

  if (!activeRingingAlarm) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl border-4 ${
          highContrast
            ? 'bg-zinc-900 text-white border-yellow-400'
            : 'bg-white text-slate-900 border-blue-500'
        }`}
      >
        {/* Pulsing Alarm Icon */}
        <div className="relative inline-flex items-center justify-center mb-4">
          <span className="absolute inline-flex h-20 w-20 rounded-full bg-red-400 opacity-75 animate-ping" />
          <div
            className={`relative flex items-center justify-center w-20 h-20 rounded-full shadow-lg ${
              highContrast ? 'bg-yellow-400 text-black' : 'bg-red-500 text-white'
            }`}
          >
            <Bell className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
          <Volume2 className="w-4 h-4" />
          <span>지금 복용할 시간입니다!</span>
        </div>

        <h3
          className={`font-black tracking-tight ${
            fontSize === 'large' ? 'text-2xl' : 'text-xl'
          } mb-1`}
        >
          {activeRingingAlarm.name}
        </h3>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-sm font-bold mb-4">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>설정 시간: {activeRingingAlarm.time} ({activeRingingAlarm.dosage})</span>
        </div>

        {activeRingingAlarm.notes && (
          <div
            className={`p-3 rounded-xl text-left text-sm font-semibold mb-6 border ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400/50'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}
          >
            <p className="font-bold text-xs opacity-75 mb-0.5">복용 안내</p>
            <p>{activeRingingAlarm.notes}</p>
          </div>
        )}

        {/* Big Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => dismissRingingAlarm(true)}
            className={`w-full py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2 text-lg shadow-lg transition-transform active:scale-95 ${
              highContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300 ring-2 ring-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            <span>약 먹었어요 (복용 완료)</span>
          </button>

          <button
            onClick={() => dismissRingingAlarm(false)}
            className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-1.5 text-sm transition-colors ${
              highContrast
                ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>5분 뒤 다시 알리기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
