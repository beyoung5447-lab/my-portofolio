import React, { useState } from 'react';
import { useMedication } from '../context/MedicationContext';
import { AlarmItem, TimeSlot } from '../types';
import {
  Bell,
  Plus,
  Clock,
  Trash2,
  CheckCircle2,
  Volume2,
  Calendar,
  AlertCircle,
  X,
  Edit2
} from 'lucide-react';

export const AlarmManagerView: React.FC = () => {
  const {
    alarms,
    toggleAlarm,
    toggleTaken,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    triggerAlarmTest,
    fontSize,
    highContrast
  } = useMedication();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlarmId, setEditingAlarmId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDosage, setFormDosage] = useState('1정');
  const [formTime, setFormTime] = useState('08:30');
  const [formSlot, setFormSlot] = useState<TimeSlot>('morning');
  const [formDays, setFormDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [formNotes, setFormNotes] = useState('');

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const handleOpenAddModal = () => {
    setEditingAlarmId(null);
    setFormName('');
    setFormDosage('1정');
    setFormTime('08:30');
    setFormSlot('morning');
    setFormDays([0, 1, 2, 3, 4, 5, 6]);
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (alarm: AlarmItem) => {
    setEditingAlarmId(alarm.id);
    setFormName(alarm.name);
    setFormDosage(alarm.dosage);
    setFormTime(alarm.time);
    setFormSlot(alarm.slot);
    setFormDays(alarm.days);
    setFormNotes(alarm.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingAlarmId) {
      updateAlarm(editingAlarmId, {
        name: formName,
        dosage: formDosage,
        time: formTime,
        slot: formSlot,
        days: formDays,
        notes: formNotes
      });
    } else {
      addAlarm({
        name: formName,
        dosage: formDosage,
        time: formTime,
        slot: formSlot,
        days: formDays,
        enabled: true,
        notes: formNotes,
        color: '#3B82F6',
        shape: 'round'
      });
    }
    setIsModalOpen(false);
  };

  const toggleDay = (dayIdx: number) => {
    if (formDays.includes(dayIdx)) {
      if (formDays.length > 1) {
        setFormDays(formDays.filter(d => d !== dayIdx));
      }
    } else {
      setFormDays([...formDays, dayIdx].sort());
    }
  };

  const slotLabels: Record<TimeSlot, string> = {
    morning: '아침',
    lunch: '점심',
    dinner: '저녁',
    bedtime: '취침 전'
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Title & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`font-black tracking-tight ${
              fontSize === 'large' ? 'text-2xl' : 'text-xl'
            } ${highContrast ? 'text-yellow-400' : 'text-slate-900'}`}
          >
            복약 알람 설정
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            제시간에 약을 챙겨 드실 수 있도록 소리와 화면으로 알려드립니다.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-black text-xs shadow-md transition-transform active:scale-95 ${
            highContrast
              ? 'bg-yellow-400 text-black hover:bg-yellow-300 ring-2 ring-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>알람 추가</span>
        </button>
      </div>

      {/* Alarms List */}
      <div className="space-y-3">
        {alarms.length === 0 ? (
          <div className="p-8 text-center rounded-3xl border-2 border-dashed border-slate-200 text-slate-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-bold text-sm">등록된 복약 알람이 없습니다.</p>
            <button
              onClick={handleOpenAddModal}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black"
            >
              첫 알람 등록하기
            </button>
          </div>
        ) : (
          alarms.map(alarm => (
            <div
              key={alarm.id}
              className={`p-4 rounded-3xl border-2 transition-all ${
                !alarm.enabled
                  ? 'opacity-60 bg-slate-50 border-slate-200'
                  : highContrast
                  ? 'bg-zinc-900 border-zinc-700 text-white'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: Time and Name */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        highContrast
                          ? 'bg-yellow-400 text-black'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {slotLabels[alarm.slot]}
                    </span>
                    <span className="text-lg font-black tracking-tight flex items-center gap-1 text-slate-900 dark:text-white">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {alarm.time}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      ({alarm.dosage})
                    </span>
                  </div>

                  <h3
                    className={`font-black truncate ${
                      fontSize === 'large' ? 'text-lg' : 'text-base'
                    }`}
                  >
                    {alarm.name}
                  </h3>

                  {alarm.notes && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {alarm.notes}
                    </p>
                  )}

                  {/* Repeat Days */}
                  <div className="flex items-center gap-1 mt-2">
                    {dayNames.map((day, idx) => {
                      const isActive = alarm.days.includes(idx);
                      return (
                        <span
                          key={day}
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                            isActive
                              ? highContrast
                                ? 'bg-yellow-400 text-black'
                                : 'bg-slate-800 text-white'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {day}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Toggle Switch & Actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {/* On/Off Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alarm.enabled}
                      onChange={() => toggleAlarm(alarm.id)}
                      className="sr-only peer"
                    />
                    <div
                      className={`w-12 h-7 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all ${
                        highContrast
                          ? 'bg-zinc-700 peer-checked:bg-yellow-400'
                          : 'bg-slate-300 peer-checked:bg-blue-600'
                      }`}
                    />
                  </label>

                  {/* Quick Test Sound */}
                  <button
                    onClick={() => triggerAlarmTest(alarm)}
                    className="p-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-100 flex items-center gap-1"
                    title="알람 소리 테스트"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="text-[10px]">테스트</span>
                  </button>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <button
                  onClick={() => toggleTaken(alarm.id)}
                  className={`text-xs font-black flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                    alarm.takenToday
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      alarm.takenToday ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{alarm.takenToday ? '오늘 복용 완료됨' : '복용 완료로 체크'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(alarm)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    title="알람 수정"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAlarm(alarm.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="알람 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Alarm Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 border-t sm:border-2 shadow-2xl space-y-4 ${
              highContrast
                ? 'bg-zinc-950 text-white border-yellow-400'
                : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
              <h3 className="font-black text-lg">
                {editingAlarmId ? '복약 알람 수정' : '새 복약 알람 등록'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlarm} className="space-y-4">
              {/* Medicine Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  약 이름 *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="예: 혈압약, 타이레놀, 당뇨약"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-bold text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Dosage & Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    복용량
                  </label>
                  <input
                    type="text"
                    value={formDosage}
                    onChange={e => setFormDosage(e.target.value)}
                    placeholder="예: 1정, 2캡슐, 1포"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-bold text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    시간대 분류
                  </label>
                  <select
                    value={formSlot}
                    onChange={e => setFormSlot(e.target.value as TimeSlot)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-bold text-sm outline-none focus:border-blue-500"
                  >
                    <option value="morning">아침</option>
                    <option value="lunch">점심</option>
                    <option value="dinner">저녁</option>
                    <option value="bedtime">취침 전</option>
                  </select>
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  알람 시간 *
                </label>
                <input
                  type="time"
                  required
                  value={formTime}
                  onChange={e => setFormTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-black text-lg outline-none focus:border-blue-500"
                />
              </div>

              {/* Days repeat */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                  반복 요일
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {dayNames.map((day, idx) => {
                    const isSelected = formDays.includes(idx);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(idx)}
                        className={`py-2 rounded-xl text-xs font-black transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  메모 및 복용 유의사항
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="예: 식후 즉시, 미온수 1컵과 함께"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold text-xs outline-none focus:border-blue-500"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-4 rounded-2xl font-black text-base shadow-lg transition-transform active:scale-95 ${
                    highContrast
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {editingAlarmId ? '알람 변경 저장' : '알람 등록 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
