import { useEffect, useState } from 'react'
import { api } from '../api'
import { useToast } from '../hooks/useToast'
import Icon from './Icon'

function CardSkeleton() {
  return <div className="skeleton skeleton-card" />
}

export default function SavedProfiles({ onLoad }) {
  const [profiles, setProfiles] = useState([])
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')
  const [confirming, setConfirming] = useState(null)
  const toast = useToast()

  async function load() {
    setBusy(true)
    setError('')
    try {
      const data = await api.listProfiles()
      setProfiles(data.profiles || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function remove(id) {
    try {
      await api.deleteProfile(id)
      setProfiles((p) => p.filter((x) => x.id !== id))
      toast('Profile deleted', 'success')
    } catch (err) {
      toast(err.message || 'Could not delete profile', 'error')
    } finally {
      setConfirming(null)
    }
  }

  return (
    <div className="saved-wrap">
      <div className="saved-head">
        <h2>Saved Profiles</h2>
        <button className="btn" onClick={load}>
          <Icon name="refresh" size={15} />
          Refresh
        </button>
      </div>

      {busy && (
        <div className="saved-list" aria-label="Loading profiles">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {!busy && error && (
        <div className="empty" role="alert">
          <Icon name="alert" size={26} />
          {error}
          <button className="btn" onClick={load}>
            Try again
          </button>
        </div>
      )}

      {!busy && !error && profiles.length === 0 && (
        <p className="empty">
          <Icon name="folder" size={26} />
          No saved profiles yet. Generate content, then click <strong>Save</strong> to keep it.
        </p>
      )}

      {!busy && !error && profiles.length > 0 && (
        <div className="saved-list">
          {profiles.map((p) => (
            <div key={p.id} className="saved-card">
              <div className="saved-main">
                <strong>{p.fullName || p.username || 'Untitled'}</strong>
                <span>
                  {p.jobRole || 'No role'}
                  {p.company ? ` at ${p.company}` : ''}
                </span>
                <small>
                  {new Date(p.createdAt).toLocaleString()} ·{' '}
                  {Object.keys(p.variants || {}).length} variants
                </small>
              </div>
              <div className="saved-actions">
                <button className="btn" onClick={() => onLoad(p)}>
                  <Icon name="download" size={14} />
                  Load
                </button>
                {confirming === p.id ? (
                  <button className="btn btn-danger" onClick={() => remove(p.id)}>
                    Confirm?
                  </button>
                ) : (
                  <button
                    className="btn btn-danger"
                    onClick={() => setConfirming(p.id)}
                    aria-label={`Delete ${p.fullName || p.username || 'profile'}`}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
