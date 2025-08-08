import React from 'react';

export default function LinkGrid({ links }) {
  if (!links || links.length === 0) return <div>링크가 없습니다.</div>;

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: 12
    }}>
      {links.map((item, idx) => (
        <a key={idx} href={item.link} target="_blank" rel="noreferrer"
           style={{ display: 'block', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
          {item.thumb && (
            <img src={item.thumb} alt="thumb" style={{ width: '100%', display: 'block' }} />
          )}
          <div style={{ padding: 10, fontSize: 12, color: '#0369a1', wordBreak: 'break-all' }}>
            {item.link}
          </div>
        </a>
      ))}
    </div>
  );
}
