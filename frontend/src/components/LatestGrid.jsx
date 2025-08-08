import React, { useMemo } from 'react';

export default function LatestGrid({ items=[] }) {
  const list = useMemo(()=>[...items].sort((a,b)=> (b.ts||0)-(a.ts||0)),[items]);
  if (!list.length) return <div className="text-sm text-slate-500">링크가 없습니다.</div>;
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {list.map((it, idx)=>(
        <a key={idx} href={it.link} target="_blank" rel="noreferrer"
           className="block rounded-xl overflow-hidden border border-slate-200 bg-white hover:shadow transition">
          {it.thumb && <img src={it.thumb} alt="" className="w-full block aspect-video object-cover" />}
          <div className="p-3">
            <div className="text-xs text-slate-500 mb-1">{it.date || '날짜 없음'} · {it.sender}</div>
            <div className="text-xs text-sky-700 break-all">{it.link}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
