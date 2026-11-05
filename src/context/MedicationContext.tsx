import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AlarmItem, PrescriptionItem, TabType, TimeSlot } from '../types';
import { playSuccessChime, playAlarmSound } from '../utils/audio';

const STORAGE_KEY = 'medialarm_alarms_v2';
const PREF_KEY = 'medialarm_pref_v2';

const DEFAULT_ALARMS: AlarmItem[] = [
  {
    id: 'alarm-1',
    name: '노바스크정 5mg (혈압약)',
    dosage: '1정',
    time: '08:00',
    slot: 'morning',
    days: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
    takenToday: true,
    takenAt: '08:05',
    notes: '아침 식사 후 물과 함께 복용, 자몽주스 피하기',
    color: '#3B82F6', // Blue
    shape: 'round',
    prescribedHospital: '연세심장내과'
  },
  {
    id: 'alarm-2',
    name: '가스모틴정 5mg (소화제)',
    dosage: '1정',
    time: '08:30',
    slot: 'morning',
    days: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
    takenToday: false,
    notes: '아침 식후 즉시 복용',
    color: '#10B981', // Green
    shape: 'oval',
    prescribedHospital: '속편한내과'
  },
  {
    id: 'alarm-3',
    name: '다이아벡스정 500mg (혈당약)',
    dosage: '1정',
    time: '12:30',
    slot: 'lunch',
    days: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
    takenToday: false,
    notes: '점심 식사 중 또는 식후 즉시 복용 (속쓰림 방지)',
    color: '#F59E0B', // Amber
    shape: 'round',
    prescribedHospital: '서울삼성내과'
  },
  {
    id: 'alarm-4',
    name: '타이레놀정 500mg (진통소염)',
    dosage: '1정',
    time: '19:00',
    slot: 'dinner',
    days: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
    takenToday: false,
    notes: '저녁 식후 복용. 술 절대 마시지 않기',
    color: '#EF4444', // Red
    shape: 'capsule',
    prescribedHospital: '서울삼성내과'
  },
  {
    id: 'alarm-5',
    name: '리피토정 20mg (고지혈증약)',
    dosage: '1정',
    time: '22:00',
    slot: 'bedtime',
    days: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
    takenToday: false,
    notes: '자기 전에 미온수 1컵과 함께 복용',
    color: '#8B5CF6', // Purple
    shape: 'oval',
    prescribedHospital: '연세심장내과'
  }
];

interface MedicationContextType {
  alarms: AlarmItem[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  fontSize: 'normal' | 'large';
  setFontSize: (size: 'normal' | 'large') => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  toggleTaken: (id: string) => void;
  toggleAlarm: (id: string) => void;
  addAlarm: (alarm: Omit<AlarmItem, 'id' | 'takenToday'>) => void;
  updateAlarm: (id: string, updates: Partial<AlarmItem>) => void;
  deleteAlarm: (id: string) => void;
  resetTodayAlarms: () => void;
  addAlarmsFromPrescription: (prescription: PrescriptionItem) => number;
  stats: {
    total: number;
    taken: number;
    percentage: number;
    nextAlarm: AlarmItem | null;
  };
  activeRingingAlarm: AlarmItem | null;
  triggerAlarmTest: (alarm: AlarmItem) => void;
  dismissRingingAlarm: (takePill: boolean) => void;
  selectedMedicationIdForSearch: string | null;
  openMedicineDetail: (id: string) => void;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alarms, setAlarms] = useState<AlarmItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_ALARMS;
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('large'); // default large for optimal readability
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [activeRingingAlarm, setActiveRingingAlarm] = useState<AlarmItem | null>(null);
  const [selectedMedicationIdForSearch, setSelectedMedicationIdForSearch] = useState<string | null>(null);

  // Save alarms
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
    } catch {
      // ignore
    }
  }, [alarms]);

  // Save prefs
  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify({ fontSize, highContrast }));
    } catch {
      // ignore
    }
  }, [fontSize, highContrast]);

  const toggleTaken = (id: string) => {
    setAlarms(prev =>
      prev.map(alarm => {
        if (alarm.id === id) {
          const nextTaken = !alarm.takenToday;
          if (nextTaken) {
            playSuccessChime();
          }
          const nowStr = new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
          });
          return {
            ...alarm,
            takenToday: nextTaken,
            takenAt: nextTaken ? nowStr : undefined
          };
        }
        return alarm;
      })
    );
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev =>
      prev.map(alarm => (alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm))
    );
  };

  const addAlarm = (alarmData: Omit<AlarmItem, 'id' | 'takenToday'>) => {
    const newAlarm: AlarmItem = {
      ...alarmData,
      id: `alarm-${Date.now()}`,
      takenToday: false
    };
    setAlarms(prev => [...prev, newAlarm]);
  };

  const updateAlarm = (id: string, updates: Partial<AlarmItem>) => {
    setAlarms(prev => prev.map(alarm => (alarm.id === id ? { ...alarm, ...updates } : alarm)));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const resetTodayAlarms = () => {
    setAlarms(prev =>
      prev.map(alarm => ({
        ...alarm,
        takenToday: false,
        takenAt: undefined
      }))
    );
  };

  const addAlarmsFromPrescription = (prescription: PrescriptionItem): number => {
    let addedCount = 0;
    const newAlarms: AlarmItem[] = [];

    prescription.medicines.forEach((med, idx) => {
      // Check if already in alarms
      const exists = alarms.some(a => a.name.includes(med.name.slice(0, 4)));
      if (exists) return;

      const timeSlotMap: Record<number, { slot: TimeSlot; time: string }> = {
        0: { slot: 'morning', time: '08:30' },
        1: { slot: 'lunch', time: '12:30' },
        2: { slot: 'dinner', time: '19:00' }
      };

      const timing = timeSlotMap[idx % 3];

      newAlarms.push({
        id: `alarm-rx-${Date.now()}-${idx}`,
        name: med.name,
        dosage: med.dosage,
        time: timing.time,
        slot: timing.slot,
        days: [0, 1, 2, 3, 4, 5, 6],
        enabled: true,
        takenToday: false,
        notes: `${prescription.hospitalName} 처방 - ${med.purpose} (${med.cautions})`,
        color: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][idx % 4],
        shape: 'round',
        prescribedHospital: prescription.hospitalName
      });
      addedCount++;
    });

    if (newAlarms.length > 0) {
      setAlarms(prev => [...prev, ...newAlarms]);
      playSuccessChime();
    }
    return addedCount;
  };

  const triggerAlarmTest = (alarm: AlarmItem) => {
    setActiveRingingAlarm(alarm);
    playAlarmSound();
  };

  const dismissRingingAlarm = (takePill: boolean) => {
    if (activeRingingAlarm && takePill) {
      toggleTaken(activeRingingAlarm.id);
    }
    setActiveRingingAlarm(null);
  };

  const openMedicineDetail = (id: string) => {
    setSelectedMedicationIdForSearch(id);
    setActiveTab('search');
  };

  // Stats calculation
  const enabledAlarms = alarms.filter(a => a.enabled);
  const total = enabledAlarms.length;
  const taken = enabledAlarms.filter(a => a.takenToday).length;
  const percentage = total === 0 ? 0 : Math.round((taken / total) * 100);

  // Find next upcoming untaken alarm
  const untaken = enabledAlarms.filter(a => !a.takenToday);
  // Sort untaken by time HH:mm
  const sortedUntaken = [...untaken].sort((a, b) => a.time.localeCompare(b.time));
  const nextAlarm = sortedUntaken.length > 0 ? sortedUntaken[0] : null;

  return (
    <MedicationContext.Provider
      value={{
        alarms,
        activeTab,
        setActiveTab,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        toggleTaken,
        toggleAlarm,
        addAlarm,
        updateAlarm,
        deleteAlarm,
        resetTodayAlarms,
        addAlarmsFromPrescription,
        stats: {
          total,
          taken,
          percentage,
          nextAlarm
        },
        activeRingingAlarm,
        triggerAlarmTest,
        dismissRingingAlarm,
        selectedMedicationIdForSearch,
        openMedicineDetail
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedication must be used within MedicationProvider');
  }
  return context;
};
