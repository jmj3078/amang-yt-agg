export function sortSenderKeys(obj) {
  return Object.keys(obj).sort((a, b) => a.localeCompare(b, 'ko'));
}
