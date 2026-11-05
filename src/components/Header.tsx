import React from 'react';
import { useMedication } from '../context/MedicationContext';
import { Bell, Contrast, Type } from 'lucide-react';

export const Header: React.FC = () => {
  const { fontSize, setFontSize, highContrast, setHighContrast, stats } = useMedication();

  // Current Korean date format: e.g. 11월 6일 (목)
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });

  return (
    <header
      className={`sticky top-0 z-20 px-4 py-3 border-b transition-colors ${
        highContrast
          ? 'bg-black text-white border-yellow-400'
          : 'bg-white/95 backdrop-blur-md text-slate-900 border-slate-200 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* App Title & Date */}
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-black text-xs ${
                highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-600 text-white'
              }`}
            >
              +
            </span>
            <h1 className={`font-black tracking-tight ${fontSize === 'large' ? 'text-xl' : 'text-lg'}`}>
              메디알람
            </h1>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                stats.total > 0 && stats.taken === stats.total
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : highContrast
                  ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {stats.total > 0 && stats.taken === stats.total
                ? '오늘 완벽 복용'
                : `${stats.taken}/${stats.total} 복용 완료`}
            </span>
          </div>
          <p
            className={`font-semibold mt-0.5 ${
              fontSize === 'large' ? 'text-sm' : 'text-xs'
            } ${highContrast ? 'text-yellow-300 font-bold' : 'text-slate-500'}`}
          >
            {dateFormatted}
          </p>
        </div>

        {/* Accessibility & Quick Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Font Size Toggle Button */}
          <button
            onClick={() => setFontSize(fontSize === 'large' ? 'normal' : 'large')}
            aria-label="글자 크기 변경"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
              fontSize === 'large'
                ? highContrast
                  ? 'bg-yellow-400 text-black ring-2 ring-white'
                  : 'bg-blue-100 text-blue-900 ring-2 ring-blue-500'
                : highContrast
                ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="큰 글씨 모드 전환"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{fontSize === 'large' ? '큰글씨' : '보통'}</span>
          </button>

          {/* High Contrast Mode Toggle Button */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            aria-label="고대비 모드 전환"
            className={`p-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
              highContrast
                ? 'bg-yellow-400 text-black ring-2 ring-yellow-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={highContrast ? '일반 화면으로 변경' : '고대비(선명) 모드 켜기'}
          >
            <Contrast className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
