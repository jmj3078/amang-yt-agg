import React from 'react';
import { sortSenderKeys } from '../utils/groupBySender.js';

export default function SenderList({ itemsBySender, active, onSelect, filter }) {
  const senders = sortSenderKeys(itemsBySender).filter((s) => s.includes(filter));
  return (
    <div style={{ overflowY: 'auto', maxHeight: '70vh' }}>
      {senders.map((s) => (
        <div
          key={s}
          onClick={() => onSelect(s)}
          style={{
            padding: '8px 10px', borderRadius: 8, marginBottom: 6,
            background: s === active ? '#eef4ff' : '#fff',
            border: '1px solid #e5e7eb', cursor: 'pointer'
          }}
        >
          {s} <span style={{ color: '#999' }}>({itemsBySender[s].length})</span>
        </div>
      ))}
    </div>
  );
}
