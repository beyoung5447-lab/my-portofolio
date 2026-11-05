export type TimeSlot = 'morning' | 'lunch' | 'dinner' | 'bedtime';

export interface AlarmItem {
  id: string;
  name: string;
  dosage: string; // e.g. "1정", "2캡슐"
  time: string; // "08:30"
  slot: TimeSlot;
  days: number[]; // 0: Sun, 1: Mon ... 6: Sat
  enabled: boolean;
  takenToday: boolean;
  takenAt?: string; // "08:35"
  notes?: string;
  color?: string; // Pill color accent
  shape?: 'round' | 'oval' | 'capsule' | 'square';
  prescribedHospital?: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  shape: '원형' | '타원형' | '장방형' | '캡슐' | '삼각형' | '기타';
  color: string;
  pillMark?: string; // e.g. "TY 500", "NVR 5"
  efficacy: string; // 효능 효과
  dosageInfo: string; // 복용법
  warnings: string[]; // 주의사항
  foodPrecautions: string[]; // 음식 상호작용
  storage: string;
  image?: string;
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string;
  days: number;
  purpose: string;
  cautions: string;
}

export interface PrescriptionItem {
  id: string;
  date: string;
  hospitalName: string;
  department: string;
  diagnosis: string;
  summary: string;
  easyExplanation: string;
  medicines: PrescriptionMedicine[];
  generalPrecautions: string[];
  imageUrl?: string;
}

export type TabType = 'dashboard' | 'search' | 'prescription' | 'alarm';
