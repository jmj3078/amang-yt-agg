export function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.replace('/', '').split('/')[0];
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.searchParams.get('v')) return u.searchParams.get('v');
      const path = u.pathname.split('/').filter(Boolean);
      if (path[0] === 'shorts' && path[1]) return path[1];
      if (path[0] === 'embed' && path[1]) return path[1];
    }
  } catch {}
  return null;
}
export function toThumbnail(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/0.jpg` : null;
}
