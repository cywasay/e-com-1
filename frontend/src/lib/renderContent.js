export function renderContentHtml(content) {
  if (!content) return "";
  if (/<[a-z][\s\S]*>/i.test(content)) return content;
  return content.replace(/\n/g, "<br />");
}

export function contentExcerpt(content, maxLength = 160) {
  if (!content) return "";
  const plain = content.replace(/<[^>]+>/g, "").replace(/[#*`]/g, "");
  if (plain.length <= maxLength) return plain;
  return `${plain.substring(0, maxLength).trim()}...`;
}
