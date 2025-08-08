import React from 'react';
import { sortSenderKeys } from '../utils/groupBySender.js';

export default function SenderList({ itemsBySender, active, onSelect, filter }) {
  const senders = sortSenderKeys(itemsBySender).filter((s) => s.includes(filter));
  return (
    <div className="overflow-y-auto max-h-[70vh] space-y-2">
      {senders.map((s) => (
        <div
          key={s}
          onClick={() => onSelect(s)}
          className={`px-3 py-2 rounded-lg border cursor-pointer ${
            s===active ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          {s} <span className="text-slate-400">({itemsBySender[s].length})</span>
        </div>
      ))}
    </div>
  );
}
