import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { api, setToken, getToken } from './api'
import { EMPTY_PROFILE, OUTPUT_TYPES, OUTPUT_LABELS } from './profile.meta'
import { ToastProvider } from './components/Toast'
import { useDarkMode } from './hooks/useDarkMode'
import Icon from './components/Icon'
import ThemeToggle from './components/ThemeToggle'
import Modal from './components/Modal'
import OnboardingModal from './components/OnboardingModal'
import SEOHead from './components/SEOHead'
import './App.css'

// Lazy loaded feature components
const Auth = lazy(() => import('./components/Auth'))
const ProfileForm = lazy(() => import('./components/ProfileForm'))
const Outputs = lazy(() => import('./components/Outputs'))
const Chat = lazy(() => import('./components/Chat'))
const SavedProfiles = lazy(() => import('./components/SavedProfiles'))

// Public SEO Pages
const FAQPage = lazy(() => import('./pages/FAQPage'))
const ResumeTemplatesPage = lazy(() => import('./pages/ResumeTemplatesPage'))
const CoverLetterBuilderPage = lazy(() => import('./pages/CoverLetterBuilderPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function LoadingScreen() {
  return (
    <div className="auth-wrap" role="status" aria-label="Loading">
      <div className="auth-blob b1" />
      <div className="auth-blob b2" />
      <div className="auth-blob b3" />
      <div className="auth-card animate-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader-logo-wrap">
          <img src="/logo-icon.png" alt="ResumeAI Loading" className="loader-logo-img bulb-icon" />
          <div className="loader-scan-line" />
        </div>
        <h1 className="grad-text">Initializing Systems</h1>
        <p style={{ color: 'var(--muted)', marginTop: 8 }}>Please wait while the AI starts up...</p>
      </div>
    </div>
  )
}

function GlobalLoader({ isVisible }) {
  if (!isVisible) return null
  return (
    <div className="global-loader-overlay animate-in">
      <div className="global-loader-content animate-scale">
        <div className="loader-logo-wrap active-scan">
          <img src="/logo-icon.png" alt="ResumeAI Analyzing" className="loader-logo-img bulb-icon" />
          <div className="loader-scan-line" />
        </div>
        <h3>Analyzing & Generating</h3>
        <p>Please wait while AI crafts your professional resume content...</p>
      </div>
    </div>
  )
}

function MainStudio({
  user,
  profile,
  patchProfile,
  outputs,
  setOutputs,
  allBusy,
  generateAll,
  generateType,
  busyType,
  refine,
  loadProfile,
  handleDemoLoad,
  setIsTourOpen,
  initialTab = 'content',
}) {
  const [mainTab, setMainTab] = useState(initialTab)
  const [activeOutputTab, setActiveOutputTab] = useState('professionalHrSummary')
  const navigate = useNavigate()
  const location = useLocation()

  // Sync tab with URL
  useEffect(() => {
    if (location.pathname === '/career-assistant') {
      setMainTab('assistant')
    } else if (location.pathname === '/saved-profiles') {
      setMainTab('saved')
    } else {
      setMainTab('content')
    }
  }, [location.pathname])

  const handleTabChange = (tabKey) => {
    setMainTab(tabKey)
    if (tabKey === 'content') navigate('/resume-builder')
    else if (tabKey === 'assistant') navigate('/career-assistant')
    else if (tabKey === 'saved') navigate('/saved-profiles')
  }

  const getPageSEO = () => {
    if (mainTab === 'assistant') {
      return {
        title: 'AI Career Assistant & Interview Coach — ResumeAI',
        description: 'Prepare for interviews, refine your resume summary, and get actionable career guidance with your 24/7 AI career mentor.',
        canonicalPath: '/career-assistant',
      }
    }
    if (mainTab === 'saved') {
      return {
        title: 'Saved Resumes & Drafts — ResumeAI Career Studio',
        description: 'Manage, review, and export your saved resume versions and application drafts.',
        canonicalPath: '/saved-profiles',
        robots: 'noindex, nofollow',
      }
    }
    return {
      title: 'AI Resume Builder — Professional Resume & HR Content Generator',
      description: 'Generate professional HR summaries, cover letters, LinkedIn summaries, career objectives, and ATS resumes in seconds with Google AI.',
      canonicalPath: '/resume-builder',
    }
  }

  const seo = getPageSEO()

  return (
    <div className="layout">
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonicalPath={seo.canonicalPath}
        robots={seo.robots}
      />

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
          <ProfileForm
            profile={profile}
            onChange={patchProfile}
            onOpenTour={() => setIsTourOpen(true)}
            disabled={allBusy}
          />
        </Suspense>

        <div className="single-gen">
          <div className="single-gen-head">
            <h3>⚡ Quick Generate Single Section</h3>
          </div>
          <div className="single-btns" style={{ flexDirection: 'column' }}>
            <select
              className="btn single-gen-select"
              style={{ width: '100%', textAlign: 'left', paddingRight: '24px' }}
              value={busyType || ''}
              onChange={(e) => {
                if (e.target.value) {
                  generateType(e.target.value)
                }
              }}
              disabled={allBusy || !!busyType}
            >
              <option value="" disabled>{busyType ? 'Generating section...' : '✨ Select individual section to generate'}</option>
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
        <nav className="main-tabs-header" aria-label="Main Studio Navigation">
          <button
            className={`main-tab ${mainTab === 'content' ? 'active' : ''}`}
            onClick={() => handleTabChange('content')}
          >
            <Icon name="file" size={16} />
            Resume Content
          </button>
          <button
            className={`main-tab ${mainTab === 'assistant' ? 'active' : ''}`}
            onClick={() => handleTabChange('assistant')}
          >
            <Icon name="chat" size={16} />
            AI Assistant Coach
          </button>
          <button
            className={`main-tab ${mainTab === 'saved' ? 'active' : ''}`}
            onClick={() => handleTabChange('saved')}
          >
            <Icon name="bookmark" size={16} />
            Saved Profiles
          </button>
        </nav>

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
                onOpenTour={() => setIsTourOpen(true)}
                onLoadDemo={handleDemoLoad}
              />
            )}
            {mainTab === 'assistant' && <Chat profile={profile} />}
            {mainTab === 'saved' && <SavedProfiles onLoad={loadProfile} />}
          </Suspense>
        </div>
      </main>
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

  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isTourOpen, setIsTourOpen] = useState(false)

  const location = useLocation()

  useEffect(() => {
    if (!getToken()) {
      setChecked(true)
      return
    }
    api
      .me()
      .then((d) => {
        setUser(d.user)
        if (!localStorage.getItem('has_seen_onboarding_tour')) {
          setIsTourOpen(true)
        }
      })
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
  }

  function handleDemoLoad(demoData) {
    setProfile(demoData)
  }

  if (!checked) {
    return <LoadingScreen />
  }

  const initial = user ? (user.fullName || user.email || '?').charAt(0).toUpperCase() : null

  // Public SEO Pages list (always accessible without forcing auth redirect)
  const isPublicStaticPage = [
    '/resume-templates',
    '/cover-letter-builder',
    '/faq',
    '/about',
    '/privacy',
    '/terms',
  ].includes(location.pathname)

  return (
    <div className="app">
      <GlobalLoader isVisible={allBusy} />

      {/* Main Topbar Header */}
      <header className="topbar">
        <div className="brand">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
            <img src="/logo.png" alt="ResumeAI" className="brand-logo-img" width="36" height="36" />
            <span className="brand-title">ResumeAI</span>
          </Link>
        </div>

        {/* Global Navigation Links for SEO & UX */}
        <nav className="topbar-nav" aria-label="Main Navigation">
          <Link to="/resume-builder" className="nav-link">Studio</Link>
          <Link to="/resume-templates" className="nav-link">Templates</Link>
          <Link to="/cover-letter-builder" className="nav-link">Cover Letter</Link>
          <Link to="/faq" className="nav-link">FAQ</Link>
        </nav>

        <div className="userbox">
          <button
            className="btn btn-tour-trigger"
            onClick={() => setIsTourOpen(true)}
            title="Open Interactive Guide & Tour"
          >
            <Icon name="sparkles" size={16} />
            <span>Guide & Tour</span>
          </button>

          {user ? (
            <>
              <span className="user-avatar" aria-hidden="true" title={user.fullName || user.email}>
                {initial}
              </span>
              <span className="username">{user.fullName || user.email}</span>
              <ThemeToggle dark={dark} onToggle={toggle} />
              <button className="btn btn-ghost" onClick={() => setIsLogoutOpen(true)} title="Logout">
                <Icon name="logout" size={16} />
                <span className="logout-btn-text">Logout</span>
              </button>
            </>
          ) : (
            <>
              <ThemeToggle dark={dark} onToggle={toggle} />
              {!isPublicStaticPage && (
                <Link to="/" className="btn btn-primary" style={{ padding: '7px 14px', fontSize: 13 }}>
                  Sign In
                </Link>
              )}
            </>
          )}
        </div>
      </header>

      {error && (
        <div className="banner error" role="alert">
          <Icon name="alert" size={17} />
          <span>{error}</span>
        </div>
      )}

      {/* Main App Routes */}
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Main Studio / Builder Routes */}
          <Route
            path="/"
            element={
              user ? (
                <MainStudio
                  user={user}
                  profile={profile}
                  patchProfile={patchProfile}
                  outputs={outputs}
                  setOutputs={setOutputs}
                  allBusy={allBusy}
                  generateAll={generateAll}
                  generateType={generateType}
                  busyType={busyType}
                  refine={refine}
                  loadProfile={loadProfile}
                  handleDemoLoad={handleDemoLoad}
                  setIsTourOpen={setIsTourOpen}
                  initialTab="content"
                />
              ) : (
                <Auth
                  onLogin={(u) => {
                    setUser(u)
                    if (!localStorage.getItem('has_seen_onboarding_tour')) {
                      setIsTourOpen(true)
                    }
                  }}
                />
              )
            }
          />
          <Route
            path="/resume-builder"
            element={
              user ? (
                <MainStudio
                  user={user}
                  profile={profile}
                  patchProfile={patchProfile}
                  outputs={outputs}
                  setOutputs={setOutputs}
                  allBusy={allBusy}
                  generateAll={generateAll}
                  generateType={generateType}
                  busyType={busyType}
                  refine={refine}
                  loadProfile={loadProfile}
                  handleDemoLoad={handleDemoLoad}
                  setIsTourOpen={setIsTourOpen}
                  initialTab="content"
                />
              ) : (
                <Auth
                  onLogin={(u) => {
                    setUser(u)
                    if (!localStorage.getItem('has_seen_onboarding_tour')) {
                      setIsTourOpen(true)
                    }
                  }}
                />
              )
            }
          />
          <Route
            path="/ai-career-studio"
            element={
              user ? (
                <MainStudio
                  user={user}
                  profile={profile}
                  patchProfile={patchProfile}
                  outputs={outputs}
                  setOutputs={setOutputs}
                  allBusy={allBusy}
                  generateAll={generateAll}
                  generateType={generateType}
                  busyType={busyType}
                  refine={refine}
                  loadProfile={loadProfile}
                  handleDemoLoad={handleDemoLoad}
                  setIsTourOpen={setIsTourOpen}
                  initialTab="content"
                />
              ) : (
                <Auth
                  onLogin={(u) => {
                    setUser(u)
                    if (!localStorage.getItem('has_seen_onboarding_tour')) {
                      setIsTourOpen(true)
                    }
                  }}
                />
              )
            }
          />
          <Route
            path="/career-assistant"
            element={
              user ? (
                <MainStudio
                  user={user}
                  profile={profile}
                  patchProfile={patchProfile}
                  outputs={outputs}
                  setOutputs={setOutputs}
                  allBusy={allBusy}
                  generateAll={generateAll}
                  generateType={generateType}
                  busyType={busyType}
                  refine={refine}
                  loadProfile={loadProfile}
                  handleDemoLoad={handleDemoLoad}
                  setIsTourOpen={setIsTourOpen}
                  initialTab="assistant"
                />
              ) : (
                <Auth
                  onLogin={(u) => {
                    setUser(u)
                    if (!localStorage.getItem('has_seen_onboarding_tour')) {
                      setIsTourOpen(true)
                    }
                  }}
                />
              )
            }
          />
          <Route
            path="/saved-profiles"
            element={
              user ? (
                <MainStudio
                  user={user}
                  profile={profile}
                  patchProfile={patchProfile}
                  outputs={outputs}
                  setOutputs={setOutputs}
                  allBusy={allBusy}
                  generateAll={generateAll}
                  generateType={generateType}
                  busyType={busyType}
                  refine={refine}
                  loadProfile={loadProfile}
                  handleDemoLoad={handleDemoLoad}
                  setIsTourOpen={setIsTourOpen}
                  initialTab="saved"
                />
              ) : (
                <Auth
                  onLogin={(u) => {
                    setUser(u)
                    if (!localStorage.getItem('has_seen_onboarding_tour')) {
                      setIsTourOpen(true)
                    }
                  }}
                />
              )
            }
          />

          {/* Public Indexable SEO Pages */}
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/resume-templates" element={<ResumeTemplatesPage />} />
          <Route path="/cover-letter-builder" element={<CoverLetterBuilderPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Custom 404 Not Found Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {/* Global Footer with Semantic Internal Linking */}
      <footer className="footerbar">
        <div className="footer-content">
          <div className="footer-brand-info">
            <span className="footer-text">© 2026 ResumeAI · AI Resume Builder & Career Studio</span>
          </div>

          <div className="footer-links" aria-label="Footer Navigation">
            <Link to="/resume-builder">Builder</Link>
            <Link to="/resume-templates">Templates</Link>
            <Link to="/cover-letter-builder">Cover Letters</Link>
            <Link to="/career-assistant">AI Coach</Link>
            <Link to="/faq">FAQs</Link>
            <Link to="/about">About</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <button className="footer-link-btn" onClick={() => setIsTourOpen(true)}>
              🚀 Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Onboarding Interactive Tour Modal */}
      <OnboardingModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onLoadDemo={handleDemoLoad}
        onGenerateAll={generateAll}
      />

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} title="Confirm Logout" className="logout-modal">
        <div className="logout-modal-content">
          <Icon name="alert" size={48} className="logout-icon" />
          <p>Are you sure you want to log out? Any unsaved profile changes will be lost.</p>
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
    <BrowserRouter>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </BrowserRouter>
  )
}
