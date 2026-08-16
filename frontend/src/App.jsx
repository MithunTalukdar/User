import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { api, setToken, getToken } from './api'
import { EMPTY_PROFILE, OUTPUT_TYPES, OUTPUT_LABELS } from './profile.meta'
import { ToastProvider } from './components/Toast'
import { useDarkMode } from './hooks/useDarkMode'
import Icon from './components/Icon'
import ThemeToggle from './components/ThemeToggle'
import Modal from './components/Modal'
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
      <div className="auth-card animate-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="brain-loader" style={{ width: 80, height: 80, marginBottom: 24 }}>
          <Icon name="brain" size={40} />
        </div>
        <h1 className="grad-text">Initializing Systems</h1>
        <p style={{ color: 'var(--muted)', marginTop: 8 }}>Please wait while the AI starts up...</p>
      </div>
    </div>
  )
}

function GlobalLoader({ isVisible }) {
  if (!isVisible) return null;
  return (
    <div className="global-loader-overlay animate-in">
      <div className="global-loader-content animate-scale">
        <div className="brain-loader">
          <Icon name="brain" size={28} />
        </div>
        <h3>Analyzing & Generating</h3>
        <p>Please wait while AI works its magic...</p>
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
  const [error, setError] = useState('')
  const { dark, toggle } = useDarkMode()

  const [mainTab, setMainTab] = useState('content') // 'content', 'assistant', 'saved'
  const [activeOutputTab, setActiveOutputTab] = useState('professionalHrSummary')
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

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
    setError('')
    setIsLogoutOpen(false)
  }

  async function generateAll() {
    setAllBusy(true)
    setError('')
    try {
      const { outputs: next } = await api.generateAll({ profile })
      setOutputs(next)
      setMainTab('content')
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
      setActiveOutputTab(type)
      setMainTab('content')
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
    setMainTab('content')
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

  const initial = (user.fullName || user.email || '?').charAt(0).toUpperCase()

  return (
    <div className="app">
      <GlobalLoader isVisible={allBusy} />
      
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
          <button className="btn btn-ghost" onClick={() => setIsLogoutOpen(true)}>
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
            <div className="single-btns" style={{ flexDirection: 'column' }}>
              <select
                className="btn"
                style={{ width: '100%', textAlign: 'left', paddingRight: '24px' }}
                value={busyType || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    generateType(e.target.value)
                  }
                }}
                disabled={allBusy || !!busyType}
              >
                <option value="" disabled>{busyType ? 'Working...' : 'Select feature to generate'}</option>
                {OUTPUT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {OUTPUT_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        <main className="content">
          <div className="main-tabs-header">
            <button className={`main-tab ${mainTab === 'content' ? 'active' : ''}`} onClick={() => setMainTab('content')}>
              Content
            </button>
            <button className={`main-tab ${mainTab === 'assistant' ? 'active' : ''}`} onClick={() => setMainTab('assistant')}>
              Assistant
            </button>
            <button className={`main-tab ${mainTab === 'saved' ? 'active' : ''}`} onClick={() => setMainTab('saved')}>
              Saved
            </button>
          </div>

          <div className="main-tab-content">
            <Suspense fallback={<div className="skeleton-lines"><div className="skeleton" style={{ height: 160 }} /></div>}>
              {mainTab === 'content' && (
                <Outputs
                  outputs={outputs}
                  activeTab={activeOutputTab}
                  onTabChange={setActiveOutputTab}
                  profile={profile}
                  onRefine={refine}
                  onAll={generateAll}
                  allBusy={allBusy}
                />
              )}
              {mainTab === 'assistant' && <Chat profile={profile} />}
              {mainTab === 'saved' && <SavedProfiles onLoad={loadProfile} />}
            </Suspense>
          </div>
        </main>
      </div>

      <footer className="footerbar">
        <div className="footer-content">
          <span className="footer-text">© 2026 AI Resume Builder. All rights reserved.</span>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help</a>
          </div>
        </div>
      </footer>

      <Modal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} title="Confirm Logout" className="logout-modal">
        <div className="logout-modal-content">
          <Icon name="alert" size={48} className="logout-icon" />
          <p>Are you sure you want to log out? Any unsaved changes may be lost.</p>
          <div className="logout-actions">
            <button className="btn" onClick={() => setIsLogoutOpen(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={logout}>Yes, Logout</button>
          </div>
        </div>
      </Modal>
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
