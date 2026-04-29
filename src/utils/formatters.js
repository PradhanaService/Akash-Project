export const LANGUAGE_OPTIONS = [
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'cpp',
  'go',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'rust',
  'sql',
  'html',
  'css',
  'bash',
  'json',
  'markdown',
]

export function formatDate(value) {
  if (!value) return 'Just now'

  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value)

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function uniqueSortedTags(snippets) {
  return [...new Set(snippets.flatMap((snippet) => snippet.tags || []))].sort()
}

export function titleCase(value) {
  return value
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}
