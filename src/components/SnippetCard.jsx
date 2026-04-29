import { CalendarDays, Code2, Copy, Maximize2, Pencil, Tag, Trash2 } from 'lucide-react'
import Button from './Button'
import { formatDate, titleCase } from '../utils/formatters'

export default function SnippetCard({
  snippet,
  onCopy,
  onDelete,
  onEdit,
  onView,
  copied,
}) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/20 transition hover:border-slate-700">
      <div className="flex flex-col gap-4 border-b border-slate-800 p-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-semibold text-slate-50">{snippet.title}</h3>
            <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-xs font-medium text-cyan-200">
              <Code2 size={13} />
              {titleCase(snippet.language)}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
            {snippet.description || 'No description added.'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" className="size-10 px-0" title="Copy code" onClick={() => onCopy(snippet)}>
            <Copy size={17} />
            <span className="sr-only">Copy code</span>
          </Button>
          <Button variant="ghost" className="size-10 px-0" title="Full-screen view" onClick={() => onView(snippet)}>
            <Maximize2 size={17} />
            <span className="sr-only">Full-screen view</span>
          </Button>
          <Button variant="ghost" className="size-10 px-0" title="Edit snippet" onClick={() => onEdit(snippet)}>
            <Pencil size={17} />
            <span className="sr-only">Edit snippet</span>
          </Button>
          <Button variant="danger" className="size-10 px-0" title="Delete snippet" onClick={() => onDelete(snippet)}>
            <Trash2 size={17} />
            <span className="sr-only">Delete snippet</span>
          </Button>
        </div>
      </div>

      <div className="p-5">
        <pre className="max-h-48 overflow-hidden rounded-md border border-slate-800 bg-slate-950 p-4 text-left text-xs leading-6 text-slate-300">
          <code>{snippet.code}</code>
        </pre>
        <div className="mt-4 flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(snippet.tags || []).length ? (
              snippet.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-300">
                  <Tag size={12} />
                  {tag}
                </span>
              ))
            ) : (
              <span>No tags</span>
            )}
          </div>
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={13} />
            Updated {formatDate(snippet.updatedAt)}
          </span>
        </div>
        {copied ? <p className="mt-3 text-xs font-medium text-cyan-200">Copied to clipboard.</p> : null}
      </div>
    </article>
  )
}
