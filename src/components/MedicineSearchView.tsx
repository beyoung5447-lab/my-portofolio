import React, { useState, useMemo } from 'react';
import { useMedication } from '../context/MedicationContext';
import { MOCK_MEDICINES } from '../data/mockMedicines';
import { MedicineItem } from '../types';
import {
  Search,
  Filter,
  AlertTriangle,
  Info,
  PlusCircle,
  Volume2,
  VolumeX,
  X,
  Check,
  ShieldAlert,
  Apple
} from 'lucide-react';
import { speakText, stopSpeech } from '../utils/audio';

export const MedicineSearchView: React.FC = () => {
  const {
    highContrast,
    fontSize,
    addAlarm,
    setActiveTab,
    selectedMedicationIdForSearch
  } = useMedication();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [activeMedicine, setActiveMedicine] = useState<MedicineItem | null>(() => {
    if (selectedMedicationIdForSearch) {
      return MOCK_MEDICINES.find(m => m.id === selectedMedicationIdForSearch) || null;
    }
    return null;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const shapes = ['all', '원형', '타원형', '장방형', '캡슐'];
  const colors = ['all', '하얀색', '파란색', '갈색'];

  const quickKeywords = ['타이레놀', '혈압약', '당뇨', '진통제', '소화제', '기침·가래'];

  const filteredMedicines = useMemo(() => {
    return MOCK_MEDICINES.filter(med => {
      const matchQuery =
        !searchQuery ||
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.efficacy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (med.pillMark && med.pillMark.toLowerCase().includes(searchQuery.toLowerCase())) ||
        med.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchShape = selectedShape === 'all' || med.shape === selectedShape;
      const matchColor = selectedColor === 'all' || med.color === selectedColor;

      return matchQuery && matchShape && matchColor;
    });
  }, [searchQuery, selectedShape, selectedColor]);

  const handleSpeak = (med: MedicineItem) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const text = `${med.name}. 성분명은 ${med.genericName}입니다. 효능은 ${med.efficacy}. 복용 방법은 ${med.dosageInfo}. 주의사항: ${med.warnings.join('. ')}`;
      speakText(text, () => setIsSpeaking(false));
    }
  };

  const handleAddToAlarm = (med: MedicineItem) => {
    addAlarm({
      name: med.name,
      dosage: '1정',
      time: '08:30',
      slot: 'morning',
      days: [0, 1, 2, 3, 4, 5, 6],
      enabled: true,
      notes: `${med.efficacy.slice(0, 30)}... 식후 복용 권장`,
      color: med.color === '파란색' ? '#3B82F6' : '#10B981',
      shape: 'round'
    });
    setAddedToast(`'${med.name}' 알람이 추가되었습니다!`);
    setTimeout(() => {
      setAddedToast(null);
    }, 2500);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-sm mx-auto p-3.5 rounded-2xl bg-emerald-700 text-white font-bold flex items-center justify-between shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="text-sm">{addedToast}</span>
          </div>
          <button
            onClick={() => setActiveTab('alarm')}
            className="text-xs bg-white text-emerald-800 px-2.5 py-1 rounded-lg font-black hover:bg-emerald-50"
          >
            알람 보기
          </button>
        </div>
      )}

      {/* Title */}
      <div>
        <h2
          className={`font-black tracking-tight ${
            fontSize === 'large' ? 'text-2xl' : 'text-xl'
          } ${highContrast ? 'text-yellow-400' : 'text-slate-900'}`}
        >
          약 검색 (의약품 식별)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          약 이름, 증상(두통, 혈압), 모양과 알약에 적힌 글자로 찾아보세요.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${
            highContrast ? 'text-yellow-400' : 'text-slate-400'
          }`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="약 이름, 성분, 각인, 증상(예: 두통, 속쓰림)"
          className={`w-full pl-11 pr-10 py-3.5 rounded-2xl text-sm font-semibold transition-all outline-none border-2 ${
            highContrast
              ? 'bg-zinc-900 text-white border-yellow-400 placeholder:text-zinc-500 focus:ring-2 focus:ring-yellow-400'
              : 'bg-white text-slate-900 border-slate-200 placeholder:text-slate-400 focus:border-blue-500 shadow-xs'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Keyword Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 shrink-0">추천:</span>
        {quickKeywords.map(kw => (
          <button
            key={kw}
            onClick={() => setSearchQuery(kw)}
            className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              searchQuery === kw
                ? 'bg-blue-600 text-white font-bold'
                : highContrast
                ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {kw}
          </button>
        ))}
      </div>

      {/* Pill Shape & Color Filter Bars */}
      <div
        className={`p-3 rounded-2xl border space-y-2.5 text-xs ${
          highContrast ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        {/* Shape */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500 w-12 shrink-0">모양:</span>
          <div className="flex flex-wrap gap-1">
            {shapes.map(s => (
              <button
                key={s}
                onClick={() => setSelectedShape(s)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedShape === s
                    ? highContrast
                      ? 'bg-yellow-400 text-black'
                      : 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {s === 'all' ? '모든 모양' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500 w-12 shrink-0">색상:</span>
          <div className="flex flex-wrap gap-1">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedColor === c
                    ? highContrast
                      ? 'bg-yellow-400 text-black'
                      : 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c === 'all' ? '모든 색상' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
        <span>검색 결과: <strong className="text-slate-800 dark:text-white font-bold">{filteredMedicines.length}</strong>건</span>
        {(selectedShape !== 'all' || selectedColor !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedShape('all');
              setSelectedColor('all');
            }}
            className="text-blue-600 font-bold hover:underline"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* Medicines List */}
      <div className="space-y-3">
        {filteredMedicines.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 text-slate-500">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-bold text-sm">일치하는 약품 정보가 없습니다.</p>
            <p className="text-xs text-slate-400 mt-1">다른 검색어(예: 타이레놀, 노바스크)로 검색해 보세요.</p>
          </div>
        ) : (
          filteredMedicines.map(med => (
            <div
              key={med.id}
              onClick={() => setActiveMedicine(med)}
              role="button"
              tabIndex={0}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                highContrast
                  ? 'bg-zinc-900 border-zinc-700 text-white hover:border-yellow-400'
                  : 'bg-white border-slate-200 hover:border-blue-400 text-slate-900 shadow-xs'
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                      highContrast
                        ? 'bg-yellow-400 text-black'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {med.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {med.manufacturer}
                  </span>
                </div>

                <h3
                  className={`font-black tracking-tight ${
                    fontSize === 'large' ? 'text-lg' : 'text-base'
                  } ${highContrast ? 'text-yellow-300' : 'text-slate-900'}`}
                >
                  {med.name}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-1">
                  성분: {med.genericName}
                </p>

                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 line-clamp-2">
                  {med.efficacy}
                </p>

                {/* Pill Shape Badge */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                    {med.shape} / {med.color}
                  </span>
                  {med.pillMark && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold">
                      각인: {med.pillMark}
                    </span>
                  )}
                </div>
              </div>

              {/* Right side icon */}
              <div className="shrink-0 flex flex-col items-end justify-between h-full pt-1">
                <span className="text-xs font-bold text-blue-600 flex items-center gap-0.5 hover:underline">
                  상세보기 &rarr;
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Medication Detail Modal */}
      {activeMedicine && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 border-t sm:border-2 shadow-2xl space-y-4 ${
              highContrast
                ? 'bg-zinc-950 text-white border-yellow-400'
                : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
              <div>
                <span className="text-xs font-black text-blue-600 uppercase">
                  {activeMedicine.category}
                </span>
                <h3
                  className={`font-black mt-0.5 ${
                    fontSize === 'large' ? 'text-2xl' : 'text-xl'
                  }`}
                >
                  {activeMedicine.name}
                </h3>
                <p className="text-xs text-slate-500">
                  제조사: {activeMedicine.manufacturer} · 성분: {activeMedicine.genericName}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Voice read-aloud button */}
                <button
                  onClick={() => handleSpeak(activeMedicine)}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 ${
                    isSpeaking
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title={isSpeaking ? '음성 멈추기' : '약 설명 음성으로 듣기'}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    stopSpeech();
                    setIsSpeaking(false);
                    setActiveMedicine(null);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Pill Shape Visual Summary Box */}
            <div
              className={`p-3.5 rounded-2xl flex items-center justify-between ${
                highContrast ? 'bg-zinc-900 border border-zinc-700' : 'bg-blue-50/80 border border-blue-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex flex-col items-center justify-center font-mono text-[10px] text-slate-700 font-bold p-1 text-center">
                  <span>알약</span>
                  <span className="text-blue-600 font-black">{activeMedicine.shape}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">식별 정보</p>
                  <p className="text-sm font-black">
                    {activeMedicine.color} · {activeMedicine.shape}
                    {activeMedicine.pillMark ? ` (각인: ${activeMedicine.pillMark})` : ''}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {activeMedicine.storage}
              </span>
            </div>

            {/* Efficacy & Usage */}
            <div className="space-y-3 text-sm">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>효능 및 효과</span>
                </h4>
                <p className="text-slate-700 dark:text-zinc-300 font-medium leading-relaxed">
                  {activeMedicine.efficacy}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>올바른 복용법</span>
                </h4>
                <p className="text-slate-700 dark:text-zinc-300 font-medium leading-relaxed">
                  {activeMedicine.dosageInfo}
                </p>
              </div>

              {/* Warnings */}
              <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
                <h4 className="font-black text-rose-800 dark:text-rose-300 flex items-center gap-1.5 mb-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>주의사항 (부작용 예방)</span>
                </h4>
                <ul className="space-y-1 text-xs text-rose-900 dark:text-rose-200 font-medium list-disc list-inside">
                  {activeMedicine.warnings.map((w, idx) => (
                    <li key={idx} className="leading-snug">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Food Precautions */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <h4 className="font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1.5">
                  <Apple className="w-4 h-4 text-amber-600" />
                  <span>함께 먹으면 안 되는 음식</span>
                </h4>
                <ul className="space-y-1 text-xs text-amber-900 dark:text-amber-200 font-medium list-disc list-inside">
                  {activeMedicine.foodPrecautions.map((fp, idx) => (
                    <li key={idx} className="leading-snug">
                      {fp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="pt-2">
              <button
                onClick={() => handleAddToAlarm(activeMedicine)}
                className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 ${
                  highContrast
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <PlusCircle className="w-5 h-5 stroke-[2.4]" />
                <span>이 약을 복약 알람에 추가하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
