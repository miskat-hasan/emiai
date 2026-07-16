const URL_REGEX = /((?:https?:\/\/|www\.)[^\s<]+)/g;

export function linkifyToNodes(text) {
  if (!text) return [];
  const nodes = [];
  let lastIndex = 0;
  let match;

  while ((match = URL_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    let url = match[0];
    const trailing = url.match(/[.,!?)]+$/);
    let trail = "";
    if (trailing) {
      trail = trailing[0];
      url = url.slice(0, -trail.length);
    }
    const href = url.startsWith("http") ? url : `https://${url}`;
    nodes.push({ type: "link", value: url, href });
    if (trail) nodes.push({ type: "text", value: trail });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length)
    nodes.push({ type: "text", value: text.slice(lastIndex) });
  return nodes;
}
