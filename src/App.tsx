import React, { useState } from 'react';
import { MedicationProvider, useMedication } from './context/MedicationContext';
import { Header } from './components/Header';
import { BottomTabBar } from './components/BottomTabBar';
import { DashboardView } from './components/DashboardView';
import { MedicineSearchView } from './components/MedicineSearchView';
import { PrescriptionView } from './components/PrescriptionView';
import { AlarmManagerView } from './components/AlarmManagerView';
import { AlarmRingingModal } from './components/AlarmRingingModal';
import { Smartphone, Maximize2, Minimize2, Battery, Wifi, Signal } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, highContrast } = useMedication();

  return (
    <main
      className={`min-h-full px-4 pt-3 transition-colors ${
        highContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'search' && <MedicineSearchView />}
      {activeTab === 'prescription' && <PrescriptionView />}
      {activeTab === 'alarm' && <AlarmManagerView />}
    </main>
  );
};

export default function App() {
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);

  // Status Bar Time
  const currentTime = new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <MedicationProvider>
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start sm:p-4 select-none">
        {/* Top Control Bar for previewing device frame vs full width */}
        <div className="w-full max-w-md hidden sm:flex items-center justify-between py-2 px-3 text-xs text-slate-400 font-bold mb-1">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span>모바일 앱 프리뷰 (React Native / Tailwind CSS)</span>
          </div>
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            title="화면 크기 전환"
          >
            {deviceFrameMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>전체 화면</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>스마트폰 프레임</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Device Frame or Container */}
        <div
          className={`w-full transition-all duration-300 overflow-hidden flex flex-col ${
            deviceFrameMode
              ? 'max-w-md sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl sm:ring-1 sm:ring-slate-700/60 bg-white relative min-h-[820px] max-h-[920px]'
              : 'max-w-xl rounded-none bg-white min-h-screen shadow-lg'
          }`}
        >
          {/* iOS / Android Status Bar simulation */}
          <div className="w-full bg-slate-900 text-white px-6 py-2 flex items-center justify-between text-xs font-bold shrink-0 select-none">
            <span className="tracking-tight text-[11px] font-black">{currentTime}</span>
            {/* Dynamic Island / Notch */}
            <div className="w-20 h-4 bg-black rounded-full mx-auto hidden sm:block opacity-90" />
            <div className="flex items-center gap-1.5 text-[11px]">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Top Sticky App Header with Accessibility & Date */}
          <Header />

          {/* Scrollable View Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative">
            <MainContent />
          </div>

          {/* Persistent Bottom Tab Navigation Bar */}
          <BottomTabBar />

          {/* Active Ringing Alarm simulation overlay */}
          <AlarmRingingModal />
        </div>
      </div>
    </MedicationProvider>
  );
}
