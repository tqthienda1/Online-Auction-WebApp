export function maskUsername(username) {
  if (!username) return "";

  const len = username.length;

  if (len <= 4) return username[0] + "*".repeat(len - 1);

  const keep = Math.ceil(len * 0.3); // giữ 30%
  const start = username.slice(0, keep);
  const end = username.slice(-keep);
  const masked = "*".repeat(len - keep * 2);

  return start + masked + end;
}
