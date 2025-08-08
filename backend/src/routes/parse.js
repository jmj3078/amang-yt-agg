import { Router } from 'express';
import { loadFromCsvUrl, getCache, startPollingIfEnabled } from '../utils/parseChat.js';

const router = Router();

let readyPromise = null;
async function ensureLoaded(){
  if (!readyPromise) readyPromise = loadFromCsvUrl(process.env.CSV_URL);
  await readyPromise;
}

startPollingIfEnabled();

router.get('/public', async (req,res,next)=>{
  try { await ensureLoaded(); res.json(getCache()); }
  catch(e){ next(e); }
});

router.post('/admin/reload', async (req,res,next)=>{
  try{
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token !== process.env.ADMIN_TOKEN) return res.status(401).json({ message: 'unauthorized' });
    const data = await loadFromCsvUrl(process.env.CSV_URL);
    res.json({ ok: true, summary: data.summary });
  }catch(e){ next(e); }
});

export default router;
