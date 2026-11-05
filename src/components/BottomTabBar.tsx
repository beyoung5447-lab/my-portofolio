import React from 'react';
import { useMedication } from '../context/MedicationContext';
import { Home, Search, FileText, Bell } from 'lucide-react';
import { TabType } from '../types';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, fontSize, highContrast, stats } = useMedication();

  const tabs: Array<{
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | null;
  }> = [
    {
      id: 'dashboard',
      label: '메인 홈',
      icon: Home
    },
    {
      id: 'search',
      label: '약 검색',
      icon: Search
    },
    {
      id: 'prescription',
      label: '처방전 설명',
      icon: FileText
    },
    {
      id: 'alarm',
      label: '복약 알람',
      icon: Bell,
      badge: stats.total - stats.taken > 0 ? stats.total - stats.taken : null
    }
  ];

  return (
    <nav
      role="navigation"
      aria-label="하단 메뉴"
      className={`fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto border-t transition-colors ${
        highContrast
          ? 'bg-black text-white border-yellow-400 shadow-2xl'
          : 'bg-white/95 backdrop-blur-md text-slate-700 border-slate-200 shadow-lg'
      }`}
    >
      <div className="grid grid-cols-4 h-16 items-center px-1">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full w-full py-1 transition-all rounded-lg active:scale-95 ${
                isActive
                  ? highContrast
                    ? 'text-yellow-400 font-black'
                    : 'text-blue-600 font-extrabold'
                  : highContrast
                  ? 'text-zinc-400 hover:text-white font-medium'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`transition-transform ${
                    isActive ? 'scale-110 stroke-[2.6]' : 'stroke-[1.8]'
                  } ${fontSize === 'large' ? 'w-6 h-6' : 'w-5 h-5'}`}
                />
                {tab.badge && tab.badge > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 px-1.5 py-0.2 text-[10px] font-black rounded-full flex items-center justify-center leading-tight ${
                      highContrast
                        ? 'bg-yellow-400 text-black border border-black ring-1 ring-yellow-400'
                        : 'bg-red-500 text-white shadow-xs'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`mt-1 tracking-tight leading-none ${
                  fontSize === 'large' ? 'text-xs' : 'text-[11px]'
                } ${isActive ? 'font-black' : 'font-semibold'}`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span
                  className={`absolute top-0 w-8 h-1 rounded-b-full ${
                    highContrast ? 'bg-yellow-400' : 'bg-blue-600'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
