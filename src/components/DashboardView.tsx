import React, { useState } from 'react';
import { useMedication } from '../context/MedicationContext';
import {
  CheckCircle2,
  Circle,
  Clock,
  Search,
  FileText,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Sun,
  Sunset,
  Moon,
  Coffee,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { TimeSlot } from '../types';

export const DashboardView: React.FC = () => {
  const {
    alarms,
    toggleTaken,
    stats,
    fontSize,
    highContrast,
    setActiveTab,
    triggerAlarmTest,
    resetTodayAlarms
  } = useMedication();

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | 'all'>('all');

  const slots: Array<{ id: TimeSlot; label: string; icon: React.ComponentType<{ className?: string }>; timeRange: string }> = [
    { id: 'morning', label: '아침', icon: Sun, timeRange: '07:00 ~ 10:00' },
    { id: 'lunch', label: '점심', icon: Coffee, timeRange: '11:30 ~ 14:00' },
    { id: 'dinner', label: '저녁', icon: Sunset, timeRange: '17:30 ~ 20:00' },
    { id: 'bedtime', label: '취침 전', icon: Moon, timeRange: '21:00 ~ 23:30' }
  ];

  const filteredAlarms = alarms.filter(alarm => {
    if (!alarm.enabled) return false;
    if (selectedSlot === 'all') return true;
    return alarm.slot === selectedSlot;
  });

  return (
    <div className="space-y-5 pb-24">
      {/* 1. Main Status Hero Card (High Contrast & Big Typography) */}
      <section
        className={`rounded-3xl p-5 border-2 transition-all shadow-md ${
          highContrast
            ? 'bg-zinc-950 text-white border-yellow-400'
            : stats.total > 0 && stats.taken === stats.total
            ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-500'
            : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white border-blue-600'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100 opacity-90">
                오늘의 복약 달성률
              </span>
            </div>
            <h2
              className={`font-black tracking-tight leading-snug ${
                fontSize === 'large' ? 'text-2xl' : 'text-xl'
              }`}
            >
              {stats.total === 0
                ? '등록된 복약 알람이 없습니다'
                : stats.taken === stats.total
                ? '오늘 약을 모두 챙겨 드셨어요! 👏'
                : `오늘 먹을 약 ${stats.total - stats.taken}개 남았습니다`}
            </h2>
            <p className="text-xs text-blue-100 mt-1 font-medium">
              {stats.total > 0 && stats.taken === stats.total
                ? '훌륭해요! 정해진 시간에 꾸준히 복용하셨습니다.'
                : '잊지 않고 제시간에 드시도록 도와드릴게요.'}
            </p>
          </div>

          {/* Adherence Percentage Circle Badge */}
          <div
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 shrink-0 ${
              highContrast
                ? 'bg-yellow-400 text-black border-white font-black'
                : 'bg-white/15 backdrop-blur-md text-white border-white/30'
            }`}
          >
            <span className="text-xl font-black">{stats.percentage}%</span>
            <span className="text-[10px] font-bold opacity-80">
              {stats.taken}/{stats.total} 완료
            </span>
          </div>
        </div>

        {/* Big visual progress bar */}
        <div className="mt-4">
          <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                highContrast
                  ? 'bg-yellow-400'
                  : stats.taken === stats.total
                  ? 'bg-emerald-300'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2. Next Upcoming Dose Card (High Impact, 1-Click Action) */}
      {stats.nextAlarm && (
        <section
          className={`rounded-2xl p-4.5 border-2 transition-all ${
            highContrast
              ? 'bg-black text-white border-yellow-400 ring-2 ring-yellow-400/40'
              : 'bg-amber-50/90 border-amber-300 text-slate-900 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-black uppercase ${
                  highContrast ? 'bg-yellow-400 text-black' : 'bg-amber-500 text-white'
                }`}
              >
                지금 먹을 약
              </span>
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {stats.nextAlarm.time} 예정
              </span>
            </div>
            {/* Quick Test Alarm trigger */}
            <button
              onClick={() => triggerAlarmTest(stats.nextAlarm!)}
              className="text-xs font-bold px-2 py-1 rounded-md bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 flex items-center gap-1"
              title="알람 울림 체험하기"
            >
              <Volume2 className="w-3 h-3" />
              <span>알람 테스트</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3
                className={`font-black truncate ${
                  fontSize === 'large' ? 'text-xl' : 'text-lg'
                } ${highContrast ? 'text-yellow-300' : 'text-slate-900'}`}
              >
                {stats.nextAlarm.name}
              </h3>
              <p
                className={`font-semibold text-slate-600 mt-0.5 ${
                  fontSize === 'large' ? 'text-sm' : 'text-xs'
                } ${highContrast ? 'text-zinc-300' : 'text-slate-600'}`}
              >
                용량: <span className="font-bold text-slate-900 dark:text-white">{stats.nextAlarm.dosage}</span>
                {stats.nextAlarm.notes && ` · ${stats.nextAlarm.notes}`}
              </p>
            </div>

            {/* Giant 1-Tap Check Button */}
            <button
              onClick={() => toggleTaken(stats.nextAlarm!.id)}
              className={`shrink-0 flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl font-black text-sm shadow-md active:scale-95 transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300 ring-2 ring-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>먹었어요</span>
            </button>
          </div>
        </section>
      )}

      {/* 3. Time Slot Filters (아침, 점심, 저녁, 취침전) */}
      <section>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3
            className={`font-black tracking-tight ${
              fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${highContrast ? 'text-white' : 'text-slate-800'}`}
          >
            오늘 복약 체크리스트
          </h3>
          <button
            onClick={resetTodayAlarms}
            className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100"
            title="오늘 상태 다시 체크하기 위해 초기화"
          >
            <RotateCcw className="w-3 h-3" />
            <span>오늘 초기화</span>
          </button>
        </div>

        {/* Slot selector pills */}
        <div className="grid grid-cols-5 gap-1.5 mb-3">
          <button
            onClick={() => setSelectedSlot('all')}
            className={`py-2 px-1 rounded-xl text-center font-bold transition-all text-xs ${
              selectedSlot === 'all'
                ? highContrast
                  ? 'bg-yellow-400 text-black'
                  : 'bg-slate-900 text-white'
                : highContrast
                ? 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            전체 ({alarms.filter(a => a.enabled).length})
          </button>

          {slots.map(s => {
            const count = alarms.filter(a => a.enabled && a.slot === s.id).length;
            const Icon = s.icon;
            const isSelected = selectedSlot === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSlot(s.id)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? highContrast
                      ? 'bg-yellow-400 text-black font-black'
                      : 'bg-blue-600 text-white font-black shadow-xs'
                    : highContrast
                    ? 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center gap-0.5">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{s.label}</span>
                </div>
                <span className="text-[10px] opacity-80">{count}개</span>
              </button>
            );
          })}
        </div>

        {/* Alarms List */}
        <div className="space-y-2.5">
          {filteredAlarms.length === 0 ? (
            <div
              className={`p-8 text-center rounded-2xl border-2 border-dashed ${
                highContrast
                  ? 'border-zinc-700 text-zinc-400 bg-zinc-950'
                  : 'border-slate-200 text-slate-500 bg-slate-50'
              }`}
            >
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-bold text-sm">해당 시간대에 복용할 약이 없습니다.</p>
              <button
                onClick={() => setActiveTab('alarm')}
                className="mt-3 text-xs font-bold text-blue-600 underline"
              >
                새로운 알람 등록하기
              </button>
            </div>
          ) : (
            filteredAlarms.map(alarm => {
              const isTaken = alarm.takenToday;

              return (
                <div
                  key={alarm.id}
                  onClick={() => toggleTaken(alarm.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isTaken}
                  className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99] ${
                    isTaken
                      ? highContrast
                        ? 'bg-zinc-950/90 border-emerald-500/80 text-zinc-300'
                        : 'bg-emerald-50/70 border-emerald-300/80 text-slate-800'
                      : highContrast
                      ? 'bg-zinc-900 border-zinc-700 text-white hover:border-yellow-400'
                      : 'bg-white border-slate-200 hover:border-blue-400 text-slate-900 shadow-xs'
                  }`}
                >
                  {/* Left Pill Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Time Slot Badge & Time */}
                    <div className="flex flex-col items-center justify-center w-14 py-1.5 rounded-xl bg-slate-100 text-slate-800 shrink-0 font-bold">
                      <span className="text-[10px] text-slate-500 uppercase">
                        {alarm.slot === 'morning'
                          ? '아침'
                          : alarm.slot === 'lunch'
                          ? '점심'
                          : alarm.slot === 'dinner'
                          ? '저녁'
                          : '취침전'}
                      </span>
                      <span className="text-sm font-black tracking-tight">{alarm.time}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4
                          className={`font-black truncate ${
                            fontSize === 'large' ? 'text-base' : 'text-sm'
                          } ${
                            isTaken
                              ? 'line-through opacity-70'
                              : highContrast
                              ? 'text-white'
                              : 'text-slate-900'
                          }`}
                        >
                          {alarm.name}
                        </h4>
                        <span
                          className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                            isTaken
                              ? 'bg-emerald-200 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {alarm.dosage}
                        </span>
                      </div>

                      {alarm.notes && (
                        <p
                          className={`truncate mt-0.5 text-xs ${
                            isTaken ? 'opacity-60' : 'text-slate-500'
                          }`}
                        >
                          {alarm.notes}
                        </p>
                      )}

                      {isTaken && alarm.takenAt && (
                        <p className="text-[11px] font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{alarm.takenAt} 복용 완료</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Checkbox Button (Large Touch Area) */}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleTaken(alarm.id);
                    }}
                    aria-label={isTaken ? '복용 취소' : '복용 완료 체크'}
                    className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform active:scale-90 ${
                      isTaken
                        ? highContrast
                          ? 'bg-emerald-500 text-black'
                          : 'bg-emerald-600 text-white shadow-xs'
                        : highContrast
                        ? 'bg-zinc-800 border-2 border-zinc-600 text-zinc-400 hover:border-yellow-400'
                        : 'bg-slate-100 border-2 border-slate-300 text-slate-400 hover:border-blue-500'
                    }`}
                  >
                    {isTaken ? (
                      <CheckCircle2 className="w-7 h-7 stroke-[2.8]" />
                    ) : (
                      <Circle className="w-6 h-6 stroke-[2]" />
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 4. Quick Action Cards (약 검색, 처방전 설명, 알람 추가) */}
      <section className="pt-2">
        <h3
          className={`font-black mb-3 px-1 ${
            fontSize === 'large' ? 'text-lg' : 'text-base'
          } ${highContrast ? 'text-white' : 'text-slate-800'}`}
        >
          빠른 도우미
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Action 1: Search */}
          <button
            onClick={() => setActiveTab('search')}
            className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-98 ${
              highContrast
                ? 'bg-zinc-900 border-zinc-700 text-white hover:border-yellow-400'
                : 'bg-blue-50/70 border-blue-200 hover:border-blue-400 text-slate-900 shadow-xs'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2.5">
              <Search className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h4 className="font-black text-sm">약 검색하기</h4>
            <p className="text-xs text-slate-500 mt-0.5">이름·모양·효능으로 찾기</p>
          </button>

          {/* Action 2: Prescription */}
          <button
            onClick={() => setActiveTab('prescription')}
            className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-98 ${
              highContrast
                ? 'bg-zinc-900 border-zinc-700 text-white hover:border-yellow-400'
                : 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400 text-slate-900 shadow-xs'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2.5">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h4 className="font-black text-sm">처방전 설명</h4>
            <p className="text-xs text-slate-500 mt-0.5">사진 찍고 쉬운 말로 풀기</p>
          </button>

          {/* Action 3: Add Alarm Full Span */}
          <button
            onClick={() => setActiveTab('alarm')}
            className={`col-span-2 p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition-all active:scale-98 ${
              highContrast
                ? 'bg-yellow-400 text-black border-white font-bold'
                : 'bg-slate-900 text-white border-slate-900 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <PlusCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-black text-sm">새로운 복약 알람 등록</h4>
                <p className="text-xs opacity-80">시간대별 알람 및 반복 요일 설정</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};
