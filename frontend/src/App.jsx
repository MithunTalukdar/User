import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { api, setToken, getToken } from './api'
import { EMPTY_PROFILE } from './profile.meta'
import { ToastProvider } from './components/Toast'
import { useDarkMode } from './hooks/useDarkMode'
import Icon from './components/Icon'
import ThemeToggle from './components/ThemeToggle'
import './App.css'

const Auth = lazy(() => import('./components/Auth'))
const ProfileForm = lazy(() => import('./components/ProfileForm'))
const Outputs = lazy(() => import('./components/Outputs'))
const Chat = lazy(() => import('./components/Chat'))
const SavedProfiles = lazy(() => import('./components/SavedProfiles'))

function LoadingScreen() {
  return (
    <div className="auth-wrap" role="status" aria-label="Loading">
      <div className="auth-blob b1" />
      <div className="auth-blob b2" />
      <div className="auth-blob b3" />
      <div className="auth-card animate-up">
        <div className="auth-logo">
          <span className="logo">
            <Icon name="brain" size={22} />
          </span>
          <h1 className="grad-text">AI Resume Builder</h1>
        </div>
        <div className="skeleton-lines">
          <div className="skeleton" style={{ height: 20, width: '70%' }} />
          <div className="skeleton" style={{ width: '100%' }} />
          <div className="skeleton" style={{ width: '90%' }} />
          <div className="skeleton" style={{ width: '100%' }} />
          <div className="skeleton" style={{ height: 40, width: '100%', marginTop: 8 }} />
        </div>
      </div>
    </div>
  )
}

function Shell() {
  const [user, setUser] = useState(null)
  const [checked, setChecked] = useState(false)
  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [outputs, setOutputs] = useState({})
  const [allBusy, setAllBusy] = useState(false)
  const [busyType, setBusyType] = useState('')
  const [tab, setTab] = useState('outputs')
  const [error, setError] = useState('')
  const { dark, toggle } = useDarkMode()

  useEffect(() => {
    if (!getToken()) {
      setChecked(true)
      return
    }
    api
      .me()
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setChecked(true))
  }, [])

  const patchProfile = useCallback((patch) => {
    setProfile((p) => ({ ...p, ...patch }))
  }, [])

  function logout() {
    api.logout().catch(() => {})
    setToken(null)
    setUser(null)
    setTab('outputs')
    setError('')
  }

  async function generateAll() {
    setAllBusy(true)
    setError('')
    try {
      const { outputs: next } = await api.generateAll({ profile })
      setOutputs(next)
      setTab('outputs')
    } catch (err) {
      setError(err.message)
    } finally {
      setAllBusy(false)
    }
  }

  async function generateType(type) {
    setBusyType(type)
    setError('')
    try {
      const { text } = await api.generateType({ type, profile })
      setOutputs((o) => ({ ...o, [type]: text }))
      setTab('outputs')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyType('')
    }
  }

  function refine(type, text) {
    setOutputs((o) => ({ ...o, [type]: text }))
  }

  function loadProfile(p) {
    const { id: _id, userId: _u, createdAt: _c, variants, pinned: _p, ...rest } = p
    setProfile({ ...EMPTY_PROFILE, ...rest })
    if (variants) setOutputs(variants)
    setTab('outputs')
  }

  if (!checked) {
    return <LoadingScreen />
  }

  if (!user) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Auth onLogin={(u) => setUser(u)} />
      </Suspense>
    )
  }

  const grouped = [
    { key: 'outputs', label: 'Content', busy: allBusy, onGenerate: generateAll },
    { key: 'chat', label: 'Assistant' },
    { key: 'saved', label: 'Saved' },
  ]

  const initial = (user.fullName || user.email || '?').charAt(0).toUpperCase()

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo">
            <Icon name="brain" size={18} />
          </span>
          AI Resume Builder
        </div>
        <div className="userbox">
          <span className="user-avatar" aria-hidden="true">
            {initial}
          </span>
          <span className="username">{user.fullName || user.email}</span>
          <ThemeToggle dark={dark} onToggle={toggle} />
          <button className="btn btn-ghost" onClick={logout}>
            <Icon name="logout" size={16} />
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="banner error" role="alert">
          <Icon name="alert" size={17} />
          <span>{error}</span>
        </div>
      )}

      <div className="layout">
        <aside className="sidebar" aria-label="Profile editor">
          <Suspense
            fallback={
              <div className="skeleton-lines">
                <div className="skeleton" style={{ width: '40%' }} />
                <div className="skeleton" style={{ width: '100%' }} />
                <div className="skeleton" style={{ width: '100%' }} />
                <div className="skeleton" style={{ width: '80%' }} />
              </div>
            }
          >
            <ProfileForm profile={profile} onChange={patchProfile} />
          </Suspense>
          <div className="single-gen">
            <h3>Generate One</h3>
            <div className="single-btns">
              {Object.entries({
                professionalHrSummary: 'HR Summary',
                coverLetter: 'Cover Letter',
                linkedinSummary: 'LinkedIn',
                careerObjective: 'Objective',
              }).map(([k, label]) => (
                <button
                  key={k}
                  className="btn"
                  onClick={() => generateType(k)}
                  disabled={busyType === k}
                >
                  {busyType === k ? <span className="spinner" aria-hidden="true" /> : <Icon name="sparkles" size={15} />}
                  {busyType === k ? 'Working…' : label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="content">
          <nav className="tabs" aria-label="Workspace sections" role="tablist">
            {grouped.map((g) => (
              <button
                key={g.key}
                className={tab === g.key ? 'active' : ''}
                onClick={() => setTab(g.key)}
                aria-selected={tab === g.key}
                role="tab"
              >
                {g.label}
                {g.key === 'outputs' && g.busy ? ' (…)' : ''}
              </button>
            ))}
          </nav>

          <Suspense fallback={<div className="skeleton-lines"><div className="skeleton" style={{ height: 160 }} /></div>}>
            {tab === 'outputs' && (
              <Outputs
                outputs={outputs}
                profile={profile}
                onRefine={refine}
                onAll={generateAll}
                allBusy={allBusy}
              />
            )}
            {tab === 'chat' && <Chat profile={profile} />}
            {tab === 'saved' && <SavedProfiles onLoad={loadProfile} />}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  )
}
