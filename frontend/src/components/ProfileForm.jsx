import { useMemo, useState } from 'react'
import { FIELDS, LEVELS } from '../profile.meta'
import Icon from './Icon'

const GROUPS = [
  { key: 'Details', icon: 'user' },
  { key: 'Professional', icon: 'folder' },
  { key: 'Objective', icon: 'spark' },
]

export default function ProfileForm({ profile, onChange, disabled }) {
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

  const pct = Math.round((completion.filled / completion.total) * 100)

  return (
    <div className="form-wrap">
      <div className="form-head">
        <h2>Profile</h2>
        <select
          value={profile.level}
          onChange={(e) => onChange({ level: e.target.value })}
          disabled={disabled}
          aria-label="Experience level"
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l[0].toUpperCase() + l.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-progress">
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${pct}%` }} />
        </div>
        <span>
          {completion.filled}/{completion.total} fields filled
        </span>
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
              <span style={{ marginLeft: 6, fontWeight: 600 }}>
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
                      rows={f.key === 'skills' || f.key === 'experience' || f.key === 'education' ? 3 : 2}
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
