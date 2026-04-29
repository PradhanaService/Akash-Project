import { FileCode2 } from 'lucide-react'
import Button from './Button'

export default function EmptyState({ onCreate, isFiltered }) {
  return (
    <section className="grid min-h-72 place-items-center rounded-lg border border-dashed border-slate-700 bg-slate-900/50 px-6 py-10 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-lg bg-cyan-400/10 text-cyan-200">
          <FileCode2 size={24} />
        </div>
        <h2 className="text-xl font-semibold text-slate-100">
          {isFiltered ? 'No snippets match your filters' : 'Start your snippet library'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {isFiltered
            ? 'Try a different keyword, tag, language, or sort setting.'
            : 'Save reusable commands, functions, and patterns with searchable tags and highlighted code.'}
        </p>
        {!isFiltered ? (
          <Button className="mt-5" onClick={onCreate}>
            Create first snippet
          </Button>
        ) : null}
      </div>
    </section>
  )
}
