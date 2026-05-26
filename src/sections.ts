export const defaultRequiredSections = [
  'goal',
  'inputs',
  'boundaries',
  'steps',
  'verification',
  'rollback',
  'done-criteria'
] as const;

const aliases = new Map<string, string>([
  ['objective', 'goal'],
  ['purpose', 'goal'],
  ['input', 'inputs'],
  ['constraints', 'boundaries'],
  ['boundary', 'boundaries'],
  ['tasks', 'steps'],
  ['checks', 'verification'],
  ['verify', 'verification'],
  ['backout', 'rollback'],
  ['done', 'done-criteria'],
  ['acceptance-criteria', 'done-criteria'],
  ['completion-criteria', 'done-criteria']
]);

export function normalizeSectionTitle(title: string): string {
  const key = title
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return aliases.get(key) ?? key;
}

export function humanizeSectionKey(key: string): string {
  return key
    .split('-')
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(' ');
}
