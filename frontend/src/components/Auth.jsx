import { useState } from 'react'
import { api, setToken } from '../api'
import { useDarkMode } from '../hooks/useDarkMode'
import { useToast } from '../hooks/useToast'
import Icon from './Icon'
import ThemeToggle from './ThemeToggle'

const FEATURES = [
  { icon: 'sparkles', label: '12+ AI Formats', desc: 'HR, Resume & Cover Letter', color: '#6366f1' },
  { icon: 'wand', label: 'Instant Polish', desc: '1-Click Tone & Rewrite', color: '#ec4899' },
  { icon: 'download', label: 'PDF & DOCX', desc: 'Recruiter-Ready Export', color: '#06b6d4' },
  { icon: 'chat', label: 'AI Coach Chat', desc: 'Interview & Career Prep', color: '#10b981' },
]

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

const EMPTY_FORM = { fullName: '', email: '', password: '', confirmPassword: '', otp: '' }

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [debugOtp, setDebugOtp] = useState('')
  const toast = useToast()
  const { dark, toggle } = useDarkMode()

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function switchMode(next) {
    setMode(next)
    setError('')
    setNotice('')
    setDebugOtp('')
  }

  function validate() {
    const email = form.email.trim()
    if (!email) return 'Email is required.'
    if (!EMAIL_RE.test(email)) return 'Please enter a valid email address.'
    
    if (mode === 'forgot') return ''

    if (mode === 'reset') {
      if (!form.otp.trim()) return 'Verification code is required.'
    }

    if (mode === 'login') {
      if (!form.password) return 'Password is required.'
      return ''
    }
    
    if (mode === 'register' && form.fullName.trim().length < 2) return 'Full name must be at least 2 characters.'
    
    if (mode === 'register' || mode === 'reset') {
      if (form.password.length < 8) return 'Password must be at least 8 characters.'
      if (!/[a-zA-Z]/.test(form.password)) return 'Password must contain at least one letter.'
      if (!/[0-9]/.test(form.password)) return 'Password must contain at least one number.'
      if (form.confirmPassword !== form.password) return 'Passwords do not match.'
    }
    return ''
  }

  async function submit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setNotice('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const data = await api.login({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        })
        setToken(data.token)
        onLogin(data.user)
      } else if (mode === 'register') {
        await api.register({
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        })
        toast('Account created successfully! Please log in.', 'success')
        setForm((f) => ({ ...f, password: '', confirmPassword: '' }))
        setNotice('Account created successfully. Please log in with your credentials.')
        setMode('login')
      } else if (mode === 'forgot') {
        const data = await api.forgotPassword({ email: form.email.trim().toLowerCase() })
        if (data.debugOtp) setDebugOtp(data.debugOtp)
        setNotice('A password reset verification code has been sent to your email.')
        setMode('reset')
      } else if (mode === 'reset') {
        await api.resetPassword({
          email: form.email.trim().toLowerCase(),
          otp: form.otp.trim(),
          password: form.password,
        })
        toast('Password reset successfully. Please log in.', 'success')
        setForm((f) => ({ ...f, password: '', confirmPassword: '', otp: '' }))
        setNotice('Password reset successfully. Please log in with your new password.')
        setMode('login')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      {/* Dynamic Animated Background Mesh */}
      <div className="auth-blob b1" aria-hidden="true" />
      <div className="auth-blob b2" aria-hidden="true" />
      <div className="auth-blob b3" aria-hidden="true" />
      <div className="auth-blob b4" aria-hidden="true" />
      <div className="auth-grid-overlay" aria-hidden="true" />

      {/* Floating Theme Toggle */}
      <div className="auth-theme-toggle">
        <ThemeToggle dark={dark} onToggle={toggle} />
      </div>

      {/* Glassmorphic Auth Card */}
      <div className="auth-card-glass">
        {/* Brand Header */}
        <div className="auth-hero-header">
          <div className="auth-logo-halo">
            <img src="/logo-icon.png" alt="ResumeAI" className="auth-bulb-img" />
          </div>
          <h1 className="auth-main-title">ResumeAI</h1>
          <div className="auth-tagline-badge">
            <span className="auth-badge-dot" />
            <span>AI Career & Resume Studio</span>
          </div>
        </div>

        {/* Tab Mode Toggle */}
        <div className="auth-mode-pill-wrap" role="tablist" aria-label="Authentication mode">
          <button
            className={`auth-mode-pill ${mode === 'login' || mode === 'forgot' || mode === 'reset' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
            role="tab"
            aria-selected={mode === 'login' || mode === 'forgot' || mode === 'reset'}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`auth-mode-pill ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
            role="tab"
            aria-selected={mode === 'register'}
            type="button"
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={submit} className="auth-glass-form" noValidate>
          {mode === 'register' && (
            <div className="form-group-field">
              <label htmlFor="rb-fullname">Full Name</label>
              <div className="input-icon-wrap">
                <Icon name="user" size={17} className="field-prefix-icon" />
                <input
                  id="rb-fullname"
                  value={form.fullName}
                  onChange={set('fullName')}
                  placeholder="e.g. Mithun Talukdar"
                  autoComplete="name"
                  required
                />
              </div>
            </div>
          )}
          
          <div className="form-group-field">
            <label htmlFor="rb-email">Email Address</label>
            <div className="input-icon-wrap">
              <Icon name="mail" size={17} className="field-prefix-icon" />
              <input
                id="rb-email"
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="name@example.com"
                autoComplete="email"
                required
                disabled={mode === 'reset'}
              />
            </div>
          </div>

          {mode === 'reset' && (
            <div className="form-group-field">
              <label htmlFor="rb-otp">Verification Code</label>
              <div className="input-icon-wrap">
                <Icon name="zap" size={17} className="field-prefix-icon" />
                <input
                  id="rb-otp"
                  type="text"
                  value={form.otp}
                  onChange={set('otp')}
                  placeholder="Enter 6-digit OTP"
                  autoComplete="one-time-code"
                  required
                />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div className="form-group-field">
              <div className="password-header-row">
                <label htmlFor="rb-password" style={{ margin: 0 }}>
                  {mode === 'reset' ? 'New Password' : 'Password'}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="forgot-link-btn"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="input-icon-wrap">
                <Icon name="lock" size={17} className="field-prefix-icon" />
                <input
                  id="rb-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder={mode === 'register' || mode === 'reset' ? '8+ chars with letters & numbers' : 'Enter your password'}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                {form.password.length > 0 && (
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
                  </button>
                )}
              </div>
            </div>
          )}

          {(mode === 'register' || mode === 'reset') && (
            <div className="form-group-field">
              <label htmlFor="rb-confirm">Confirm Password</label>
              <div className="input-icon-wrap">
                <Icon name="lock" size={17} className="field-prefix-icon" />
                <input
                  id="rb-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          )}

          {notice && (
            <div className="auth-alert success-alert" role="status">
              <Icon name="checkCircle" size={16} />
              <span>{notice}</span>
            </div>
          )}
          
          {error && (
            <div className="auth-alert error-alert" role="alert">
              <Icon name="alert" size={16} />
              <span>{error}</span>
            </div>
          )}
          
          {debugOtp && mode === 'reset' && (
            <div className="debug-otp-banner">
              <strong>Verification OTP:</strong> <code>{debugOtp}</code>
            </div>
          )}

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                <span>Authenticating…</span>
              </>
            ) : mode === 'login' ? (
              <>
                <span>Sign In to Studio</span>
                <Icon name="arrowRight" size={16} />
              </>
            ) : mode === 'forgot' ? (
              <>
                <span>Send Reset Link</span>
                <Icon name="send" size={16} />
              </>
            ) : mode === 'reset' ? (
              <>
                <span>Reset Password</span>
                <Icon name="check" size={16} />
              </>
            ) : (
              <>
                <span>Create Free Account</span>
                <Icon name="sparkles" size={16} />
              </>
            )}
          </button>
          
          {(mode === 'forgot' || mode === 'reset') && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => switchMode('login')}
              style={{ width: '100%', marginTop: 8 }}
            >
              ← Back to Sign In
            </button>
          )}
        </form>

        {/* Feature Highlights Grid */}
        <div className="auth-feature-cards">
          {FEATURES.map((f) => (
            <div key={f.label} className="auth-feature-pill">
              <div className="feature-pill-icon" style={{ color: f.color }}>
                <Icon name={f.icon} size={15} />
              </div>
              <div className="feature-pill-text">
                <strong>{f.label}</strong>
                <span>{f.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

