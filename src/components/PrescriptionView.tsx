import React, { useState } from 'react';
import { useMedication } from '../context/MedicationContext';
import { MOCK_PRESCRIPTIONS } from '../data/mockPrescriptions';
import { PrescriptionItem } from '../types';
import {
  FileText,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Building2,
  Clock
} from 'lucide-react';
import { speakText, stopSpeech } from '../utils/audio';

export const PrescriptionView: React.FC = () => {
  const {
    highContrast,
    fontSize,
    addAlarmsFromPrescription,
    setActiveTab
  } = useMedication();

  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionItem>(MOCK_PRESCRIPTIONS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [batchAddedCount, setBatchAddedCount] = useState<number | null>(null);

  // Simulate prescription scan / upload
  const handleSimulateScan = (index: number) => {
    setIsScanning(true);
    setScanSuccessMessage(null);
    setBatchAddedCount(null);

    setTimeout(() => {
      setSelectedPrescription(MOCK_PRESCRIPTIONS[index]);
      setIsScanning(false);
      setScanSuccessMessage('처방전을 성공적으로 스캔하고 알기 쉽게 분석했습니다!');
      setTimeout(() => setScanSuccessMessage(null), 3000);
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleSimulateScan(0);
    }
  };

  const handleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const text = `${selectedPrescription.hospitalName}에서 처방된 ${selectedPrescription.diagnosis}에 대한 설명입니다. ${selectedPrescription.easyExplanation} 처방 약품 목록: ${selectedPrescription.medicines.map(m => `${m.name}, ${m.purpose}, ${m.cautions}`).join('. ')}. 주의사항: ${selectedPrescription.generalPrecautions.join('. ')}`;
      speakText(text, () => setIsSpeaking(false));
    }
  };

  const handleBatchRegisterAlarms = () => {
    const count = addAlarmsFromPrescription(selectedPrescription);
    setBatchAddedCount(count);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Title */}
      <div>
        <h2
          className={`font-black tracking-tight ${
            fontSize === 'large' ? 'text-2xl' : 'text-xl'
          } ${highContrast ? 'text-yellow-400' : 'text-slate-900'}`}
        >
          처방전 쉬운 설명
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          처방전 사진을 올리시면 어려운 의학 용어를 알기 쉽게 풀어드립니다.
        </p>
      </div>

      {/* 1. Upload & Camera Box */}
      <section
        className={`p-4 rounded-3xl border-2 transition-all ${
          highContrast
            ? 'bg-zinc-950 border-yellow-400 text-white'
            : 'bg-gradient-to-b from-blue-50/60 to-white border-blue-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-5 h-5 text-blue-600" />
          <h3 className="font-black text-sm">처방전 촬영 또는 사진 업로드</h3>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div
              className={`p-3.5 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 border-2 transition-all active:scale-95 ${
                highContrast
                  ? 'bg-yellow-400 text-black border-white font-bold'
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-xs'
              }`}
            >
              <Camera className="w-6 h-6 stroke-[2.2]" />
              <span className="text-xs font-black">처방전 사진 촬영</span>
            </div>
          </label>

          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div
              className={`p-3.5 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 border-2 transition-all active:scale-95 ${
                highContrast
                  ? 'bg-zinc-900 text-white border-zinc-700 hover:border-yellow-400'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs'
              }`}
            >
              <Upload className="w-6 h-6 stroke-[2.2] text-blue-600" />
              <span className="text-xs font-black">갤러리에서 선택</span>
            </div>
          </label>
        </div>

        {/* Sample Prescription Presets */}
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500">
              샘플 처방전 바로 확인하기:
            </span>
            <span className="text-[10px] text-blue-600 font-bold">클릭 시 자동 분석</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {MOCK_PRESCRIPTIONS.map((rx, idx) => (
              <button
                key={rx.id}
                onClick={() => handleSimulateScan(idx)}
                className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPrescription.id === rx.id
                    ? highContrast
                      ? 'bg-yellow-400 text-black font-black'
                      : 'bg-slate-900 text-white shadow-xs'
                    : highContrast
                    ? 'bg-zinc-900 text-zinc-300 border border-zinc-700'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {rx.department} · {rx.diagnosis.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading Scanning State */}
      {isScanning && (
        <div className="p-8 rounded-3xl bg-blue-50 border-2 border-blue-400 text-center animate-pulse">
          <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-spin" />
          <h4 className="font-black text-blue-900 text-base">처방전 글자를 판독하는 중입니다...</h4>
          <p className="text-xs text-blue-700 mt-1">약품 이름과 복약 주의사항을 쉬운 말로 바꾸고 있어요.</p>
        </div>
      )}

      {/* Scan Success Toast */}
      {scanSuccessMessage && (
        <div className="p-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{scanSuccessMessage}</span>
        </div>
      )}

      {/* Batch Added Alert */}
      {batchAddedCount !== null && (
        <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-bold flex items-center justify-between">
          <div>
            <p className="text-sm font-black">
              {batchAddedCount > 0
                ? `처방약 ${batchAddedCount}개가 복약 알람에 자동 등록되었습니다! 🔔`
                : '이미 모든 약이 알람에 등록되어 있습니다.'}
            </p>
            <p className="text-xs text-emerald-800 mt-0.5">시간대별로 알람이 울려 잊지 않고 드실 수 있습니다.</p>
          </div>
          <button
            onClick={() => setActiveTab('alarm')}
            className="text-xs px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-black hover:bg-emerald-800"
          >
            알람 확인
          </button>
        </div>
      )}

      {/* 2. Prescription Card & Breakdown */}
      <section
        className={`rounded-3xl border-2 p-5 space-y-4 ${
          highContrast
            ? 'bg-zinc-950 border-zinc-800 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        {/* Header of Prescription */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                {selectedPrescription.hospitalName}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {selectedPrescription.date}
              </span>
            </div>
            <h3
              className={`font-black tracking-tight ${
                fontSize === 'large' ? 'text-xl' : 'text-lg'
              } ${highContrast ? 'text-yellow-400' : 'text-slate-900'}`}
            >
              {selectedPrescription.diagnosis}
            </h3>
          </div>

          {/* Voice Read Aloud Button */}
          <button
            onClick={handleSpeech}
            className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95 ${
              isSpeaking
                ? 'bg-red-500 text-white animate-pulse'
                : highContrast
                ? 'bg-zinc-800 text-yellow-400 border border-yellow-400'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="처방전 쉬운 설명 음성으로 듣기"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
            <span className="hidden sm:inline">{isSpeaking ? '음성 중지' : '음성 설명'}</span>
          </button>
        </div>

        {/* Easy Layman Summary Box (핵심) */}
        <div
          className={`p-4 rounded-2xl border ${
            highContrast
              ? 'bg-zinc-900 border-yellow-400/60 text-yellow-200'
              : 'bg-blue-50/80 border-blue-200 text-blue-950'
          }`}
        >
          <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wide mb-1 text-blue-700 dark:text-yellow-400">
            <Sparkles className="w-4 h-4" />
            <span>약사 선생님의 쉬운 풀이</span>
          </div>
          <p
            className={`font-semibold leading-relaxed ${
              fontSize === 'large' ? 'text-base' : 'text-sm'
            }`}
          >
            "{selectedPrescription.easyExplanation}"
          </p>
        </div>

        {/* Medicines List In Prescription */}
        <div className="space-y-2.5">
          <h4
            className={`font-black ${
              fontSize === 'large' ? 'text-base' : 'text-sm'
            } text-slate-800 dark:text-white`}
          >
            처방된 약 상세 안내 ({selectedPrescription.medicines.length}종)
          </h4>

          {selectedPrescription.medicines.map((med, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all ${
                highContrast
                  ? 'bg-zinc-900 border-zinc-700'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-black text-sm text-slate-900 dark:text-white">
                    {idx + 1}. {med.name}
                  </h5>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    {med.frequency} · {med.dosage} ({med.days}일분)
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600 shrink-0">
                  처방약
                </span>
              </div>

              <div className="mt-2 text-xs space-y-1">
                <p className="text-slate-700 dark:text-zinc-300 font-medium">
                  <strong className="text-slate-900 dark:text-white font-bold">효능:</strong> {med.purpose}
                </p>
                <p className="text-rose-700 dark:text-rose-400 font-medium">
                  <strong className="font-bold">주의:</strong> {med.cautions}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* General Precautions */}
        <div
          className={`p-3.5 rounded-2xl border ${
            highContrast
              ? 'bg-zinc-900 border-zinc-700'
              : 'bg-amber-50/70 border-amber-200'
          }`}
        >
          <h4 className="font-black text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>복용 기간 중 꼭 지켜야 할 주의사항</span>
          </h4>
          <ul className="space-y-1 text-xs text-amber-950 dark:text-amber-200 font-medium list-disc list-inside">
            {selectedPrescription.generalPrecautions.map((p, idx) => (
              <li key={idx} className="leading-snug">
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* 1-Tap Batch Add to Alarm Button (Main UX Win!) */}
        <div className="pt-2">
          <button
            onClick={handleBatchRegisterAlarms}
            className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 ${
              highContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300 ring-2 ring-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Clock className="w-5 h-5 stroke-[2.4]" />
            <span>이 처방전 약들 복약 알람에 한 번에 등록하기</span>
          </button>
        </div>
      </section>
    </div>
  );
};
