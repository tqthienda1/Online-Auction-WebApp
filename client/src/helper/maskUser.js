export function maskUsername(username) {
  if (!username) return null;
  if (username.length <= 3) return username[0] + "**";

  const first = username.slice(0, 2);
  const last = username.slice(-2);

  return `${first}***${last}`;
}
