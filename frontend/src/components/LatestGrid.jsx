import React, { useState, useMemo } from 'react';

export default function LatestGrid({ items = [] }) {
  const [sortOrder, setSortOrder] = useState('latest'); // latest | oldest

  const sortedList = useMemo(() => {
    if (sortOrder === 'latest') {
      return [...items].reverse(); // 최신순
    }
    return items; // 오래된순
  }, [items, sortOrder]);

  if (!sortedList.length) {
    return <div className="text-sm text-slate-500">링크가 없습니다.</div>;
  }

  return (
    <div>
      {/* 정렬 토글 버튼 */}
      <div className="flex justify-end mb-3">
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === 'latest' ? 'oldest' : 'latest'))
          }
          className="px-3 py-1 text-sm bg-sky-100 text-sky-800 rounded hover:bg-sky-200 transition"
        >
          {sortOrder === 'latest' ? '📜 오래된순 보기' : '🆕 최신순 보기'}
        </button>
      </div>

      {/* 그리드 */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sortedList.map((it, idx) => (
          <a
            key={idx}
            href={it.link}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl overflow-hidden border border-slate-200 bg-white hover:shadow transition"
          >
            {it.thumb && (
              <img
                src={it.thumb}
                alt=""
                className="w-full block aspect-video object-cover"
              />
            )}
            <div className="p-3">
              <div className="text-xs text-slate-500 mb-1">
                {it.date || '날짜 없음'} · {it.sender}
              </div>
              <div className="text-xs text-sky-700 break-all">{it.link}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}