import { useState, useEffect } from 'react'
import Modal from './Modal'
import Icon from './Icon'
import { DEMO_PROFILES } from '../profile.meta'

const TOUR_STEPS = [
  {
    id: 'welcome',
    badge: 'Welcome to AI Resume Builder',
    title: 'Transform Your Career Story with AI',
    subtitle: 'Generate professional resumes, HR summaries, ATS paragraphs, and interview bios in seconds with cutting-edge AI.',
    icon: 'sparkles',
    color: 'var(--primary)',
    content: (
      <div className="tour-welcome-card">
        <div className="tour-welcome-logo-wrap">
          <img src="/logo-icon.png" alt="ResumeAI Bulb" className="tour-welcome-logo-img bulb-icon" />
        </div>
        <div className="tour-feature-grid">
          <div className="tour-mini-card">
            <div className="tour-mini-icon">📝</div>
            <h4>Smart Profile Input</h4>
            <p>Enter your basic background, skills & experience once.</p>
          </div>
          <div className="tour-mini-card">
            <div className="tour-mini-icon">⚡</div>
            <h4>12+ AI Output Types</h4>
            <p>From HR summaries to ATS resume lines & cover letters.</p>
          </div>
          <div className="tour-mini-card">
            <div className="tour-mini-icon">🪄</div>
            <h4>Refine & Polish</h4>
            <p>One-click rewrite, tone optimization & word polish.</p>
          </div>
          <div className="tour-mini-card">
            <div className="tour-mini-icon">📥</div>
            <h4>Instant Export</h4>
            <p>Download ready-to-share PDF and Word DOCX formats.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'profile',
    badge: 'Step 1: Fill Your Profile',
    title: 'Add Your Details in the Left Sidebar',
    subtitle: 'Organize your career information across three simple, collapsible sections.',
    icon: 'user',
    color: '#8b5cf6',
    content: (
      <div className="tour-step-layout">
        <div className="tour-step-visual">
          <div className="tour-visual-group">
            <span className="tour-tag">👤 Details</span>
            <p>Full Name, Professional Title, Email, Phone & Company</p>
          </div>
          <div className="tour-visual-group">
            <span className="tour-tag">💼 Professional</span>
            <p>Skills (comma separated), Work Experience, Projects & GitHub/LinkedIn</p>
          </div>
          <div className="tour-visual-group">
            <span className="tour-tag">🎯 Objective</span>
            <p>Career Goals, Target Roles & Additional Highlights</p>
          </div>
        </div>
        <div className="tour-tip-box">
          <Icon name="lightbulb" size={18} />
          <div>
            <strong>Pro Tip:</strong> Select your seniority level (<em>Beginner, Mid, Senior</em>) at the top of the sidebar. The AI automatically adjusts its tone and industry vocabulary!
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'generate',
    badge: 'Step 2: Generate Content',
    title: 'Generate Everything with 1 Click',
    subtitle: 'Create all 12 professional documents at once, or generate specific sections.',
    icon: 'zap',
    color: '#ec4899',
    content: (
      <div className="tour-step-layout">
        <div className="tour-generation-showcase">
          <div className="tour-gen-banner">
            <div className="tour-gen-btn-demo">
              <Icon name="sparkles" size={16} />
              <span>Generate All (12 Assets)</span>
            </div>
            <p>Generates HR Summary, Resume Bio, Cover Letter, ATS Paragraphs & more simultaneously.</p>
          </div>
          
          <div className="tour-pills-cloud">
            <span className="tour-pill">Professional HR Summary</span>
            <span className="tour-pill">Resume Summary</span>
            <span className="tour-pill">About Me</span>
            <span className="tour-pill">LinkedIn Summary</span>
            <span className="tour-pill">ATS Resume Paragraph</span>
            <span className="tour-pill">Cover Letter</span>
            <span className="tour-pill">Interview Pitch</span>
            <span className="tour-pill">Career Objective</span>
          </div>
        </div>
        <div className="tour-tip-box">
          <Icon name="compass" size={18} />
          <div>
            <strong>Need a single section fast?</strong> Use the <em>"Generate One"</em> dropdown in the sidebar to craft just what you need!
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'refine_export',
    badge: 'Step 3: Refine & Export',
    title: 'Polish Your Words & Export Instantly',
    subtitle: 'Fine-tune generated text with AI or download directly for job applications.',
    icon: 'wand',
    color: '#06b6d4',
    content: (
      <div className="tour-step-layout">
        <div className="tour-action-cards">
          <div className="tour-action-card">
            <div className="tour-action-head">
              <Icon name="sparkles" size={18} />
              <strong>Improve</strong>
            </div>
            <p>Enhance vocabulary, flow, and punchy impact with one click.</p>
          </div>
          <div className="tour-action-card">
            <div className="tour-action-head">
              <Icon name="refresh" size={18} />
              <strong>Rewrite</strong>
            </div>
            <p>Generate a fresh alternative phrasing for any section.</p>
          </div>
          <div className="tour-action-card">
            <div className="tour-action-head">
              <Icon name="download" size={18} />
              <strong>PDF / DOCX</strong>
            </div>
            <p>Export your full resume kit in clean, recruiter-ready formats.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'assistant',
    badge: 'Step 4: AI Coach & Saved Profiles',
    title: 'Chat with AI & Manage Saved Drafts',
    subtitle: 'Switch between tabs for interactive interview coaching and saved versions.',
    icon: 'chat',
    color: '#10b981',
    content: (
      <div className="tour-step-layout">
        <div className="tour-tabs-demo">
          <div className="tour-tab-preview">
            <span className="preview-tab active">Content</span>
            <span className="preview-tab">Assistant (AI Chat)</span>
            <span className="preview-tab">Saved Profiles</span>
          </div>
          <div className="tour-features-list">
            <div className="tour-list-item">
              <Icon name="chat" size={16} />
              <span><strong>AI Assistant Tab:</strong> Ask questions like "How do I explain my career gap?" or "Draft interview talking points".</span>
            </div>
            <div className="tour-list-item">
              <Icon name="bookmark" size={16} />
              <span><strong>Saved Tab:</strong> Save snapshots of tailored resumes for different job postings and reload anytime.</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'quickstart',
    badge: '🎉 Ready to Explore!',
    title: 'Start Building or Try a Demo Profile',
    subtitle: 'Want to see it in action right away? Click any sample profile below to test instantly!',
    icon: 'checkCircle',
    color: '#6366f1',
    content: null, // Rendered dynamically with demo buttons
  },
]

export default function OnboardingModal({ isOpen, onClose, onLoadDemo, onGenerateAll }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const currentStep = TOUR_STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === TOUR_STEPS.length - 1

  const handleNext = () => {
    if (!isLast) {
      setStepIndex((s) => s + 1)
    } else {
      handleClose()
    }
  }

  const handlePrev = () => {
    if (!isFirst) {
      setStepIndex((s) => s - 1)
    }
  }

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('has_seen_onboarding_tour', 'true')
    }
    onClose()
  }

  const handleSelectDemo = (demo) => {
    if (onLoadDemo) {
      onLoadDemo(demo.data)
    }
    if (dontShowAgain) {
      localStorage.setItem('has_seen_onboarding_tour', 'true')
    }
    onClose()
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, stepIndex])

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="tour-modal">
      <div className="tour-container">
        {/* Top Header */}
        <div className="tour-top">
          <div className="tour-badge-row">
            <span className="tour-badge" style={{ borderColor: currentStep.color, color: currentStep.color }}>
              <Icon name={currentStep.icon} size={14} />
              {currentStep.badge}
            </span>
            <span className="tour-counter">
              {stepIndex + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <h2 className="tour-title">{currentStep.title}</h2>
          <p className="tour-subtitle">{currentStep.subtitle}</p>

          {/* Progress Bar */}
          <div className="tour-progress-bar">
            <div
              className="tour-progress-fill"
              style={{ width: `${((stepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Body Content */}
        <div className="tour-body">
          {isLast ? (
            <div className="tour-quickstart-grid">
              <div className="tour-qs-header">
                <p>Choose a sample profile to populate real data and test the AI immediately:</p>
              </div>
              <div className="tour-demos-list">
                {DEMO_PROFILES.map((demo) => (
                  <button
                    key={demo.id}
                    className="tour-demo-card"
                    onClick={() => handleSelectDemo(demo)}
                  >
                    <span className="tour-demo-icon">{demo.icon}</span>
                    <div className="tour-demo-info">
                      <strong>{demo.name}</strong>
                      <span>{demo.data.skills.split(',').slice(0, 3).join(', ')}...</span>
                    </div>
                    <Icon name="chevronRight" size={18} className="tour-demo-arrow" />
                  </button>
                ))}
              </div>
              <div className="tour-blank-start">
                <button
                  className="btn btn-ghost"
                  style={{ width: '100%', marginTop: 8 }}
                  onClick={handleClose}
                >
                  Or start with a blank profile
                </button>
              </div>
            </div>
          ) : (
            currentStep.content
          )}
        </div>

        {/* Footer Navigation */}
        <div className="tour-footer">
          <label className="tour-checkbox">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <span>Don't show this guide on startup</span>
          </label>

          <div className="tour-nav-buttons">
            {!isFirst && (
              <button className="btn" onClick={handlePrev}>
                <Icon name="arrowLeft" size={15} />
                Back
              </button>
            )}
            
            {isFirst && (
              <button className="btn btn-ghost" onClick={handleClose}>
                Skip Tour
              </button>
            )}

            {!isLast ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Next
                <Icon name="arrowRight" size={15} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleClose}>
                <Icon name="sparkles" size={15} />
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
