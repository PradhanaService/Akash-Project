import { Code2, Filter, LogOut, Moon, Plus, Search, Sun } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import SnippetCard from '../components/SnippetCard'
import SnippetForm from '../components/SnippetForm'
import SnippetViewer from '../components/SnippetViewer'
import { useAuth } from '../hooks/useAuth'
import {
  createSnippet,
  deleteSnippet,
  subscribeToUserSnippets,
  updateSnippet,
} from '../services/snippets'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'
import { LANGUAGE_OPTIONS, titleCase, uniqueSortedTags } from '../utils/formatters'
import { inputClass } from '../utils/inputClass'

export default function Dashboard() {
  const { currentUser, logout } = useAuth()
  const [snippets, setSnippets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('all')
  const [tag, setTag] = useState('all')
  const [sort, setSort] = useState('newest')
  const [editingSnippet, setEditingSnippet] = useState(null)
  const [viewingSnippet, setViewingSnippet] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [copiedId, setCopiedId] = useState('')
  const [theme, setTheme] = useState(() => localStorage.getItem('snippet-theme') || 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    localStorage.setItem('snippet-theme', theme)
  }, [theme])

  useEffect(() => {
    const unsubscribe = subscribeToUserSnippets(
      currentUser.uid,
      (nextSnippets) => {
        setSnippets(nextSnippets)
        setLoading(false)
      },
      (snapshotError) => {
        setError(getFriendlyFirebaseError(snapshotError))
        setLoading(false)
      },
    )

    return unsubscribe
  }, [currentUser.uid])

  const availableTags = useMemo(() => uniqueSortedTags(snippets), [snippets])

  const filteredSnippets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return snippets
      .filter((snippet) => {
        const matchesQuery =
          !normalizedQuery ||
          snippet.title?.toLowerCase().includes(normalizedQuery) ||
          snippet.language?.toLowerCase().includes(normalizedQuery) ||
          snippet.tags?.some((snippetTag) => snippetTag.includes(normalizedQuery))
        const matchesLanguage = language === 'all' || snippet.language === language
        const matchesTag = tag === 'all' || snippet.tags?.includes(tag)

        return matchesQuery && matchesLanguage && matchesTag
      })
      .sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0
        const bTime = b.createdAt?.toMillis?.() || 0

        return sort === 'newest' ? bTime - aTime : aTime - bTime
      })
  }, [language, query, snippets, sort, tag])

  async function copySnippet(snippet) {
    await navigator.clipboard.writeText(snippet.code)
    setCopiedId(snippet.id)
    window.setTimeout(() => setCopiedId(''), 1800)
  }

  function openCreateForm() {
    setEditingSnippet(null)
    setIsFormOpen(true)
  }

  function openEditForm(snippet) {
    setEditingSnippet(snippet)
    setIsFormOpen(true)
  }

  async function handleFormSubmit(input) {
    setError('')

    if (editingSnippet) {
      await updateSnippet(editingSnippet.id, input, currentUser.uid)
      return
    }

    await createSnippet(input, currentUser.uid)
  }

  async function handleDelete(snippet) {
    const confirmed = window.confirm(`Delete "${snippet.title}"? This cannot be undone.`)
    if (!confirmed) return

    try {
      await deleteSnippet(snippet.id, currentUser.uid)
    } catch (deleteError) {
      setError(getFriendlyFirebaseError(deleteError))
    }
  }

  const hasActiveFilters = Boolean(query || language !== 'all' || tag !== 'all')

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-lg bg-cyan-400 text-slate-950">
              <Code2 size={23} />
            </div>
            <div>
              <h1 className="text-lg font-bold">SnippetVault</h1>
              <p className="text-sm text-slate-400">{currentUser.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              type="button"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
              {theme === 'dark' ? 'Dark' : 'Light'}
            </Button>
            <Button onClick={openCreateForm}>
              <Plus size={17} />
              New snippet
            </Button>
            <Button variant="ghost" onClick={logout}>
              <LogOut size={17} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6">
        <section className="grid gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4 lg:grid-cols-[1fr_180px_180px_160px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
            <input
              className={inputClass('pl-10')}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, tag, or language"
              value={query}
            />
          </div>
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <select className={inputClass('pl-9')} onChange={(event) => setLanguage(event.target.value)} value={language}>
              <option value="all">All languages</option>
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {titleCase(option)}
                </option>
              ))}
            </select>
          </div>
          <select className={inputClass()} onChange={(event) => setTag(event.target.value)} value={tag}>
            <option value="all">All tags</option>
            {availableTags.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select className={inputClass()} onChange={(event) => setSort(event.target.value)} value={sort}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </section>

        {error ? (
          <div className="rounded-md border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-100">
            <strong className="block text-amber-50">Firebase setup needs one more step</strong>
            {error}
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-500">Total snippets</p>
            <strong className="mt-1 block text-2xl">{snippets.length}</strong>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-500">Languages</p>
            <strong className="mt-1 block text-2xl">{new Set(snippets.map((snippet) => snippet.language)).size}</strong>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-500">Tags</p>
            <strong className="mt-1 block text-2xl">{availableTags.length}</strong>
          </div>
        </section>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-56 animate-pulse rounded-lg border border-slate-800 bg-slate-900" />
            ))}
          </div>
        ) : filteredSnippets.length ? (
          <section className="grid gap-4">
            {filteredSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                copied={copiedId === snippet.id}
                onCopy={copySnippet}
                onDelete={handleDelete}
                onEdit={openEditForm}
                onView={setViewingSnippet}
                snippet={snippet}
              />
            ))}
          </section>
        ) : (
          <EmptyState isFiltered={hasActiveFilters} onCreate={openCreateForm} />
        )}
      </div>

      {isFormOpen ? (
        <SnippetForm
          snippet={editingSnippet}
          onClose={() => {
            setIsFormOpen(false)
            setEditingSnippet(null)
          }}
          onSubmit={handleFormSubmit}
        />
      ) : null}

      <SnippetViewer
        copied={copiedId === viewingSnippet?.id}
        onClose={() => setViewingSnippet(null)}
        onCopy={copySnippet}
        snippet={viewingSnippet}
      />
    </main>
  )
}
