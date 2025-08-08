import { parse as parseCsv } from 'csv-parse/sync';
import fetch from 'node-fetch';
import { toThumbnail } from './youtube.js';

const YT_REGEX = /(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[\w\-?=&/%#\.]+)/ig;

let CACHE = { itemsBySender:{}, summary:{ totalSenders:0, totalLinks:0 } };

function build(items){
  const by = items.reduce((a,c)=>{
    (a[c.sender] ||= []).push({ link:c.link, thumb:c.thumb });
    return a;
  }, {});
  return {
    summary:{ totalSenders:Object.keys(by).length, totalLinks:items.length },
    itemsBySender: by
  };
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
    if(!sender || !msg) continue;
    for (const m of msg.matchAll(YT_REGEX)){
      const link = m[0];
      items.push({ sender, link, thumb: toThumbnail(link) });
    }
  }
  CACHE = build(items);
  return CACHE;
}

export const getCache = () => CACHE;
