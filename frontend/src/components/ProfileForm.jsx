import { useMemo, useState } from 'react'
import { FIELDS, LEVELS, DEMO_PROFILES, EMPTY_PROFILE } from '../profile.meta'
import Icon from './Icon'

const GROUPS = [
  { key: 'Details', icon: 'user' },
  { key: 'Professional', icon: 'folder' },
  { key: 'Objective', icon: 'spark' },
]

const PLACEHOLDERS = {
  fullName: 'e.g. Alex Morgan',
  username: 'e.g. alexmorgan.dev',
  email: 'e.g. alex@example.com',
  phone: 'e.g. +1 (555) 234-5678',
  jobRole: 'e.g. Senior Full-Stack Engineer',
  company: 'e.g. TechCorp Solutions',
  skills: 'e.g. React, TypeScript, Node.js, PostgreSQL, Docker, AWS',
  experience: 'e.g. 5+ years leading full-stack applications. Reduced server latency by 40%...',
  education: 'e.g. B.S. in Computer Science — University of California (2019)',
  projects: 'e.g. 1. DevFlow: Real-time collaborative tool with 15k users.\n2. CloudSync: Automated DB backups.',
  github: 'e.g. https://github.com/alexmorgan',
  linkedin: 'e.g. https://linkedin.com/in/alexmorgan',
  portfolio: 'e.g. https://alexmorgan.io',
  careerObjective: 'e.g. To lead engineering teams building resilient, scalable AI products.',
  additionalInfo: 'e.g. AWS Certified Architect, Hackathon winner, Open Source contributor.',
}

export default function ProfileForm({ profile, onChange, onOpenTour, disabled }) {
  const [open, setOpen] = useState(() => new Set(GROUPS.map((g) => g.key)))

  const completion = useMemo(() => {
    const filled = FIELDS.filter((f) => (profile[f.key] || '').trim()).length
    return { filled, total: FIELDS.length }
  }, [profile])

  function toggleGroup(key) {
    setOpen((s) => {
      const next = new Set(s)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function handleDemoSelect(e) {
    const demoId = e.target.value
    if (!demoId) return
    const found = DEMO_PROFILES.find((d) => d.id === demoId)
    if (found) {
      onChange(found.data)
    }
  }

  function handleClear() {
    if (window.confirm('Clear all profile fields?')) {
      onChange(EMPTY_PROFILE)
    }
  }

  const pct = Math.round((completion.filled / completion.total) * 100)

  return (
    <div className="form-wrap">
      <div className="form-head">
        <div className="form-title-wrap">
          <h2>Profile Info</h2>
          <span className="form-badge-pill">{pct}% Complete</span>
        </div>
        <div className="form-head-actions">
          <select
            value={profile.level}
            onChange={(e) => onChange({ level: e.target.value })}
            disabled={disabled}
            aria-label="Experience level"
            className="level-select"
            title="Seniority Level"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                🎯 {l[0].toUpperCase() + l.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Template Preset Bar */}
      <div className="template-preset-bar">
        <div className="preset-label">
          <Icon name="wand" size={14} />
          <span>Quick Demo Presets:</span>
        </div>
        <div className="preset-actions">
          <select
            className="preset-select"
            onChange={handleDemoSelect}
            defaultValue=""
            disabled={disabled}
            aria-label="Load demo preset"
          >
            <option value="" disabled>
              ⚡ Load a Sample Role...
            </option>
            {DEMO_PROFILES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.icon} {d.name}
              </option>
            ))}
          </select>
          {completion.filled > 0 && (
            <button
              type="button"
              className="btn btn-ghost clear-btn"
              onClick={handleClear}
              title="Clear form"
            >
              <Icon name="trash" size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="form-progress">
        <div className="progress-track">
          <div
            className="progress-bar"
            style={{
              width: `${pct}%`,
              background: pct === 100 ? 'var(--success)' : 'var(--grad)',
            }}
          />
        </div>
        <div className="progress-sub">
          <span>
            {completion.filled}/{completion.total} fields filled
          </span>
          {pct < 30 && (
            <span className="progress-hint">💡 Fill 3+ fields to start generating</span>
          )}
        </div>
      </div>

      {GROUPS.map((g) => {
        const fields = FIELDS.filter((f) => f.group === g.key)
        const groupFilled = fields.filter((f) => (profile[f.key] || '').trim()).length
        const isOpen = open.has(g.key)
        return (
          <section key={g.key} className="field-group">
            <button
              type="button"
              className={`group-header ${isOpen ? 'open' : ''}`}
              onClick={() => toggleGroup(g.key)}
              aria-expanded={isOpen}
              aria-controls={`group-${g.key}`}
            >
              <Icon name={g.icon} size={15} />
              {g.key}
              <span className="group-count-badge">
                {groupFilled}/{fields.length}
              </span>
              <Icon name="chevronDown" size={15} className="chev" />
            </button>
            {isOpen && (
              <div className="group-body" id={`group-${g.key}`}>
                {fields.map((f) => (
                  <label key={f.key} className="field">
                    <span>
                      {f.icon} {f.label}
                    </span>
                    <textarea
                      rows={f.key === 'skills' || f.key === 'experience' || f.key === 'education' || f.key === 'projects' ? 3 : 2}
                      placeholder={PLACEHOLDERS[f.key] || `Enter your ${f.label.toLowerCase()}...`}
                      value={profile[f.key] || ''}
                      onChange={(e) => onChange({ [f.key]: e.target.value })}
                      disabled={disabled}
                    />
                  </label>
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

