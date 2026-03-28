export function getParentWbs(wbsInDottedTemplate: string, splitter = '.'): string {
  if (!wbsInDottedTemplate) return '';

  const parts = wbsInDottedTemplate.split(splitter);
  if (parts.length === 1) return '';

  return parts.slice(0, parts.length - 1).join(splitter);
}
