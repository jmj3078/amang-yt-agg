import React, { useEffect, useState } from 'react';
import { fetchPublicData } from './api.js';
import SenderList from './components/SenderList.jsx';
import LinkGrid from './components/LinkGrid.jsx';
import LatestGrid from './components/LatestGrid.jsx';

export default function App() {
  const [data, setData] = useState(null);
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('bySender');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await fetchPublicData();
        setData(result);
        const first = Object.keys(result.itemsBySender || {})[0] || null;
        setActive(first);
      } catch (e) {
        setError(e.message || '로드 실패');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Kakao → YouTube 링크 모음</h1>
        {data && (
          <div className="text-sm text-slate-500">
            참여자 {Object.keys(data.itemsBySender||{}).length} · 링크 {data.summary?.totalLinks ?? 0}
          </div>
        )}
      </header>

      <div className="mb-4 inline-flex rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <button
          className={`px-4 py-2 text-sm ${tab==='bySender'?'bg-slate-900 text-white':'text-slate-700 hover:bg-slate-100'}`}
          onClick={()=>setTab('bySender')}
        >보낸 사람별</button>
        <button
          className={`px-4 py-2 text-sm ${tab==='latest'?'bg-slate-900 text-white':'text-slate-700 hover:bg-slate-100'}`}
          onClick={()=>setTab('latest')}
        >최신순</button>
      </div>

      {loading && <div className="mb-3">로딩 중...</div>}
      {error && <div className="mb-3 text-red-600">{error}</div>}

      {data && (tab === 'bySender' ? (
        <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-4">
          <div className="space-y-3">
            <input
              value={filter}
              onChange={(e)=>setFilter(e.target.value)}
              placeholder="보낸 사람 검색"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
            />
            <SenderList
              itemsBySender={data?.itemsBySender||{}}
              active={active}
              onSelect={setActive}
              filter={filter}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">{active || '선택 없음'}</h2>
            <LinkGrid links={active ? data.itemsBySender[active] : []} />
          </div>
        </div>
      ) : (
        <LatestGrid items={data?.itemsFlat || []} />
      ))}
    </div>
  );
}
