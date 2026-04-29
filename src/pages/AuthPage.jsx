import { Code2, Settings } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { Field } from '../components/Field'
import { useAuth } from '../hooks/useAuth'
import { inputClass } from '../utils/inputClass'

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup'
  const { isFirebaseConfigured, login, signup } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignup) {
        await signup(form)
      } else {
        await login(form.email, form.password)
      }
    } catch (authError) {
      setError(authError.message.replace('Firebase: ', '') || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <div className="inline-flex items-center gap-3 rounded-md border border-slate-800 bg-slate-900 px-3 py-2">
            <Code2 className="text-cyan-300" size={22} />
            <span className="font-semibold">SnippetVault</span>
          </div>
          <h1 className="mt-8 max-w-3xl text-4xl font-bold tracking-normal text-white md:text-6xl">
            Build a private library for the code you actually reuse.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Save snippets with language labels, tags, highlighted previews, fast search, and one-click copy. Powered only by Firebase Authentication and Firestore.
          </p>
          <div className="mt-8 grid max-w-xl gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <strong className="block text-slate-50">Private</strong>
              Per-user Firestore data
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <strong className="block text-slate-50">Fast</strong>
              Search, tag, and filter
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <strong className="block text-slate-50">Polished</strong>
              Responsive developer UI
            </div>
          </div>
        </section>

        {!isFirebaseConfigured ? (
          <section className="rounded-lg border border-cyan-400/30 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-lg bg-cyan-400/10 text-cyan-200">
                <Settings size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Firebase setup required</h2>
                <p className="text-sm text-slate-400">Add your project config before using auth.</p>
              </div>
            </div>
            <ol className="mt-6 grid gap-3 text-sm leading-6 text-slate-300">
              <li>1. Copy <code className="rounded bg-slate-950 px-1.5 py-0.5">.env.example</code> to <code className="rounded bg-slate-950 px-1.5 py-0.5">.env</code>.</li>
              <li>2. Paste your Firebase Web App values into the <code className="rounded bg-slate-950 px-1.5 py-0.5">VITE_FIREBASE_*</code> fields.</li>
              <li>3. Enable Email/Password Authentication and Firestore in Firebase Console.</li>
              <li>4. Restart the dev server with <code className="rounded bg-slate-950 px-1.5 py-0.5">npm run dev</code>.</li>
            </ol>
            <p className="mt-5 rounded-md border border-slate-800 bg-slate-950 px-4 py-3 text-xs leading-5 text-slate-400">
              This prevents the blank screen caused by Firebase rejecting an empty or placeholder API key.
            </p>
          </section>
        ) : (
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <h2 className="text-2xl font-semibold">{isSignup ? 'Create your account' : 'Welcome back'}</h2>
          <p className="mt-2 text-sm text-slate-400">
            {isSignup ? 'Start saving snippets in your own workspace.' : 'Log in to open your dashboard.'}
          </p>

          {error ? (
            <div className="mt-5 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4">
            {isSignup ? (
              <Field label="Name">
                <input className={inputClass()} name="name" onChange={updateField} value={form.name} />
              </Field>
            ) : null}
            <Field label="Email">
              <input
                className={inputClass()}
                name="email"
                onChange={updateField}
                type="email"
                value={form.email}
                required
              />
            </Field>
            <Field label="Password">
              <input
                className={inputClass()}
                minLength={6}
                name="password"
                onChange={updateField}
                type="password"
                value={form.password}
                required
              />
            </Field>
          </div>

          <Button className="mt-6 w-full" disabled={loading} type="submit">
            {loading ? 'Please wait...' : isSignup ? 'Sign up' : 'Log in'}
          </Button>

          <p className="mt-5 text-center text-sm text-slate-400">
            {isSignup ? 'Already have an account?' : 'New here?'}{' '}
            <Link className="font-semibold text-cyan-200 hover:text-cyan-100" to={isSignup ? '/login' : '/signup'}>
              {isSignup ? 'Log in' : 'Create an account'}
            </Link>
          </p>
        </form>
        )}
      </div>
    </main>
  )
}
