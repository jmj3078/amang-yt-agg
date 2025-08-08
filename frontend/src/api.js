export async function fetchPublicData(){
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
  const res = await fetch(`${base}/api/parse/public`);
  if(!res.ok) throw new Error('Fetch failed');
  return res.json();
}
