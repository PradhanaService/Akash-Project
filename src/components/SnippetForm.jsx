import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import Button from './Button'
import { Field } from './Field'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'
import { inputClass } from '../utils/inputClass'
import { LANGUAGE_OPTIONS, titleCase } from '../utils/formatters'

const emptyForm = {
  title: '',
  language: 'javascript',
  description: '',
  tags: '',
  code: '',
}

export default function SnippetForm({ snippet, onClose, onSubmit }) {
  const [form, setForm] = useState(() =>
    snippet
      ? {
          title: snippet.title || '',
          language: snippet.language || 'javascript',
          description: snippet.description || '',
          tags: (snippet.tags || []).join(', '),
          code: snippet.code || '',
        }
      : emptyForm,
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const isEditing = Boolean(snippet)
  const tags = useMemo(
    () =>
      form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    [form.tags],
  )

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!form.title.trim() || !form.code.trim() || !form.language.trim()) {
      setError('Title, language, and code are required.')
      return
    }

    setSaving(true)

    try {
      await onSubmit({
        ...form,
        tags,
      })
      onClose()
    } catch (submitError) {
      setError(getFriendlyFirebaseError(submitError))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-stretch justify-center overflow-y-auto bg-slate-950/80 p-3 backdrop-blur sm:items-center sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="my-auto flex max-h-[calc(100dvh-1.5rem)] min-h-0 w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-2xl sm:max-h-[92dvh]"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-50">
              {isEditing ? 'Edit snippet' : 'Create snippet'}
            </h2>
            <p className="text-sm text-slate-400">Keep it searchable, tagged, and ready to reuse.</p>
          </div>
          <Button type="button" variant="ghost" className="size-10 px-0" onClick={onClose}>
            <X size={18} />
            <span className="sr-only">Close</span>
          </Button>
        </header>

        <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto overscroll-contain p-5">
          {error ? (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <Field label="Title">
              <input
                className={inputClass()}
                name="title"
                onChange={updateField}
                placeholder="JWT middleware helper"
                value={form.title}
              />
            </Field>
            <Field label="Language">
              <select className={inputClass()} name="language" onChange={updateField} value={form.language}>
                {LANGUAGE_OPTIONS.map((language) => (
                  <option key={language} value={language}>
                    {titleCase(language)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea
              className={inputClass('min-h-24 resize-y')}
              name="description"
              onChange={updateField}
              placeholder="What problem does this solve?"
              value={form.description}
            />
          </Field>

          <Field label="Tags">
            <input
              className={inputClass()}
              name="tags"
              onChange={updateField}
              placeholder="auth, middleware, node"
              value={form.tags}
            />
          </Field>

          <Field label="Code">
            <textarea
              className={inputClass('min-h-72 resize-y font-mono text-[13px] leading-6')}
              name="code"
              onChange={updateField}
              placeholder="Paste your snippet here..."
              value={form.code}
            />
          </Field>
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-800 px-5 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Create snippet'}
          </Button>
        </footer>
      </form>
    </div>
  )
}
