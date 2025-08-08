import React, { useEffect, useState } from 'react';
import { fetchPublicData } from './api.js';
import SenderList from './components/SenderList.jsx';
import LinkGrid from './components/LinkGrid.jsx';

export default function App() {
  const [data, setData] = useState(null);
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await fetchPublicData();
        setData(result);
        const first = Object.keys(result.itemsBySender)[0] || null;
        setActive(first);
      } catch (e) {
        setError(e.message || '로드 실패');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>아망음악공유방 Youtube링크 모음 (CSV)</h1>

      {loading && <div style={{ marginBottom: 12 }}>로딩 중...</div>}
      {error && <div style={{ marginBottom: 12, color: 'crimson' }}>{error}</div>}

      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
          <div>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="보낸 사람 검색"
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8 }}
            />
            <div style={{ fontSize: 12, color: '#666', margin: '10px 0' }}>
              참여자: {Object.keys(data.itemsBySender).length}명 · 링크: {data.summary.totalLinks}개
            </div>
            <SenderList
              itemsBySender={data.itemsBySender}
              active={active}
              onSelect={setActive}
              filter={filter}
            />
          </div>
          <div>
            <h2 style={{ fontSize: 18, marginBottom: 10 }}>{active || '선택 없음'}</h2>
            <LinkGrid links={active ? data.itemsBySender[active] : []} />
          </div>
        </div>
      )}
    </div>
  );
}
