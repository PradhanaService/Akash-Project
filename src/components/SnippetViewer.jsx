import { Copy, X } from 'lucide-react'
import { Highlight, themes } from 'prism-react-renderer'
import Button from './Button'
import { formatDate, titleCase } from '../utils/formatters'

export default function SnippetViewer({ snippet, copied, onClose, onCopy }) {
  if (!snippet) return null

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-950 text-slate-100">
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-4 border-b border-slate-800 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-semibold">{snippet.title}</h2>
              <span className="rounded bg-cyan-400/10 px-2 py-1 text-xs font-medium text-cyan-200">
                {titleCase(snippet.language)}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Created {formatDate(snippet.createdAt)} · Updated {formatDate(snippet.updatedAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => onCopy(snippet)}>
              <Copy size={17} />
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="ghost" className="size-10 px-0" onClick={onClose}>
              <X size={18} />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-5 lg:grid-cols-[1fr_280px]">
          <div className="min-w-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
            <Highlight theme={themes.vsDark} code={snippet.code || ''} language={snippet.language || 'javascript'}>
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`${className} h-full overflow-auto p-5 text-left text-sm leading-6`}
                  style={{ ...style, margin: 0, minHeight: '100%' }}
                >
                  {tokens.map((line, index) => (
                    <div key={index} {...getLineProps({ line })}>
                      <span className="mr-5 inline-block w-8 select-none text-right text-slate-600">
                        {index + 1}
                      </span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>

          <aside className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Details</h3>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              {snippet.description || 'No description added.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(snippet.tags || []).length ? (
                snippet.tags.map((tag) => (
                  <span key={tag} className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">No tags</span>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
