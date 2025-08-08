import { parse as parseCsv } from 'csv-parse/sync';
import fetch from 'node-fetch';
import { toThumbnail } from './youtube.js';

const YT_REGEX = /(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[\w\-?=&/%#\.]+)/ig;

let CACHE = { itemsBySender:{}, itemsFlat: [], summary:{ totalSenders:0, totalLinks:0 } };

function build(items){
  const by = items.reduce((a,c)=>{
    (a[c.sender] ||= []).push({ link:c.link, thumb:c.thumb, date:c.date ?? null, ts:c.ts ?? null });
    return a;
  }, {});
  return { summary:{ totalSenders:Object.keys(by).length, totalLinks:items.length }, itemsBySender: by, itemsFlat: items };
}

function parseKakaoDate(str) {
  if (!str) return null;
  const m = str.match(/(\d+)\.\s*(\d+)\.\s*(\d+)\.\s*(오전|오후)\s*(\d+):(\d+)/);
  if (!m) return null;
  let [_, year, month, day, ampm, hour, minute] = m;
  year = parseInt(year, 10);
  month = parseInt(month, 10) - 1;
  day = parseInt(day, 10);
  hour = parseInt(hour, 10);
  minute = parseInt(minute, 10);
  if (ampm === '오후' && hour < 12) hour += 12;
  if (ampm === '오전' && hour === 12) hour = 0;
  return new Date(year, month, day, hour, minute).valueOf();
}

export async function loadFromCsvUrl(url){
  if (!url) throw new Error('CSV_URL is not set');
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const rows = parseCsv(buf, { columns:true, skip_empty_lines:true });

  const items = [];
  for (const r of rows){
    const sender = String(r.User ?? r.Sender ?? '').trim();
    const msg = String(r.Message ?? r.Content ?? '').trim();
    const dateStr = String(r.Date ?? r.Timestamp ?? r['날짜'] ?? '').trim();
    const ts = parseKakaoDate(dateStr);
    if(!sender || !msg) continue;
    for (const m of msg.matchAll(YT_REGEX)){
      const link = m[0];
      items.push({ sender, link, thumb: toThumbnail(link), date: dateStr || null, ts });
    }
  }
  CACHE = build(items);
  return CACHE;
}

export const getCache = () => CACHE;

export function startPollingIfEnabled(){
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
