import { parse as parseCsv } from 'csv-parse/sync';
import fetch from 'node-fetch';
import { toThumbnail } from './youtube.js';

const YT_REGEX = /(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[\w\-?=&/%#\.]+)/ig;

let CACHE = {
  itemsBySender: {},
  itemsFlat: [],
  summary: { totalSenders: 0, totalLinks: 0 }
};

function build(items) {
  const by = items.reduce((a, c) => {
    (a[c.sender] ||= []).push({
      link: c.link,
      thumb: c.thumb,
      date: c.date ?? null // ts 제거
    });
    return a;
  }, {});

  return {
    summary: {
      totalSenders: Object.keys(by).length,
      totalLinks: items.length
    },
    itemsBySender: by,
    itemsFlat: items
  };
}

export async function loadFromCsvUrl(url) {
  if (!url) throw new Error('CSV_URL is not set');
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const rows = parseCsv(buf, {
      bom: true,                               // UTF-8 BOM 제거
      skip_empty_lines: true,
      columns: (header) =>
        header.map(h => String(h).replace(/^\uFEFF/, '').trim()) // 헤더 정규화
    });
  const items = [];
  for (const r of rows) {
    const dateStr = String(r.Date ??'').trim();
    const sender  = String(r.User ?? '').trim();
    const msg     = String(r.Message ?? '').trim();

    if (!sender || !msg) continue;

    for (const m of msg.matchAll(YT_REGEX)) {
      items.push({
        sender,
        link: m[0],
        thumb: toThumbnail(m[0]),
        date: dateStr || null
      });
    }
  }

  CACHE = build(items);
  console.log(items.slice(0, 5));
  return CACHE;
}

export const getCache = () => CACHE;

export function startPollingIfEnabled() {
  const POLL_MS = parseInt(process.env.POLL_MS || "0", 10);
  if (POLL_MS > 0) {
    console.log("[poll] enabled every", POLL_MS, "ms");
    setInterval(() => {
      loadFromCsvUrl(process.env.CSV_URL)
        .then(d => console.log("[poll] reloaded:", d.summary))
        .catch(e => console.error("[poll] error:", e.message));
    }, POLL_MS);
  }
}