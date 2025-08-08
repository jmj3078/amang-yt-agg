import React from 'react';
import { sortSenderKeys } from '../utils/groupBySender.js';

function formatDate(d) {
  if (!d) return '날짜 없음';
  // "YYYY-MM-DD HH:mm:ss" → "YYYY.MM.DD HH:mm"
  return d.replace(/-/g, '.').replace(/:(\d{2})$/, ''); // 초 제거
}

export default function SenderList({ itemsBySender, active, onSelect, filter }) {
  const senders = sortSenderKeys(itemsBySender).filter((s) => s.includes(filter));
  return (
    <div className="overflow-y-auto max-h-[70vh] space-y-2">
      {senders.map((s) => {
        const arr = itemsBySender[s] || [];
        const latest = arr.length ? arr[arr.length - 1].date : null; // CSV 순서가 오래된→최신
        return (
          <div
            key={s}
            onClick={() => onSelect(s)}
            className={`px-3 py-2 rounded-lg border cursor-pointer ${
              s===active ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{s}</div>
              <span className="text-slate-400 text-sm">({arr.length})</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              📅 {formatDate(latest)}
            </div>
          </div>
        );
      })}
    </div>
  );
}