import { useState } from 'react'
import { OUTPUT_TYPES, OUTPUT_LABELS } from '../profile.meta'
import { api } from '../api'
import { useToast } from '../hooks/useToast'
import Icon from './Icon'

export default function Outputs({
  outputs,
  activeTab,
  onTabChange,
  profile,
  onRefine,
  onAll,
  allBusy,
  onOpenTour,
  onLoadDemo,
}) {
  const [refining, setRefining] = useState(false)
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  const active = activeTab || OUTPUT_TYPES[0]
  const text = outputs[active] || ''
  const busy = allBusy || refining
  const wordCount = text ? text.trim().split(/\s+/).length : 0

  async function doRefine(variant) {
    setRefining(true)
    try {
      const { text: next } = await api.refine({ type: active, currentText: text, variant, profile })
      onRefine(active, next)
      toast(variant === 'improve' ? 'Content improved ✨' : 'Content rewritten 🔄', 'success')
    } catch (err) {
      toast(err.message || 'Refinement failed', 'error')
    } finally {
      setRefining(false)
    }
  }

  async function saveCurrent() {
    try {
      await api.saveProfile({ profile, variants: outputs })
      toast('Profile snapshot saved to Saved tab! 💾', 'success')
    } catch {
      toast('Could not save profile', 'error')
    }
  }

  async function exportDoc(kind) {
    try {
      await api.exportFile(`/api/export/${kind}`, { profile, outputs })
      toast(`Exported resume as ${kind.toUpperCase()}! 🚀`, 'success')
    } catch (err) {
      toast(err.message || 'Export failed', 'error')
    }
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast('Copied to clipboard! 📋', 'success')
      setTimeout(() => setCopied(false), 1600)
    } catch {
      toast('Clipboard unavailable', 'error')
    }
  }

  const generatedCount = OUTPUT_TYPES.filter((t) => (outputs[t] || '').trim()).length

  return (
    <div className="outputs-wrap">
      <div className="outputs-head">
        <div>
          <div className="outputs-title-row">
            <h2>AI Generated Content</h2>
            <span className={`output-badge ${generatedCount > 0 ? 'active' : ''}`}>
              {generatedCount}/{OUTPUT_TYPES.length} Generated
            </span>
          </div>
          <p className="output-meta">
            {OUTPUT_LABELS[active]} {wordCount ? `· ${wordCount.toLocaleString()} words` : ''}
          </p>
        </div>
        <div className="head-actions">
          <button className="btn btn-primary btn-sparkle" onClick={onAll} disabled={allBusy}>
            {allBusy ? <span className="spinner" aria-hidden="true" /> : <Icon name="sparkles" size={16} />}
            {allBusy ? 'Crafting All...' : '⚡ Generate All (12 Assets)'}
          </button>
          <button className="btn" onClick={saveCurrent} disabled={generatedCount === 0} title="Save to profile library">
            <Icon name="bookmark" size={15} />
            Save Draft
          </button>
          <button className="btn btn-export" onClick={() => exportDoc('pdf')} disabled={generatedCount === 0} title="Download PDF format">
            <Icon name="download" size={15} />
            PDF
          </button>
          <button className="btn btn-export" onClick={() => exportDoc('docx')} disabled={generatedCount === 0} title="Download Word DOCX format">
            <Icon name="file" size={15} />
            DOCX
          </button>
        </div>
      </div>

      <div className="tab-row" role="tablist" aria-label="Content types">
        {OUTPUT_TYPES.map((t) => {
          const isDone = Boolean((outputs[t] || '').trim())
          return (
            <button
              key={t}
              className={`tab ${active === t ? 'active' : ''} ${isDone ? 'has-content' : ''}`}
              onClick={() => onTabChange && onTabChange(t)}
              role="tab"
              aria-selected={active === t}
            >
              {isDone && <span className="tab-dot" />}
              {OUTPUT_LABELS[t]}
            </button>
          )
        })}
      </div>

      <div className="output-pane">
        {allBusy && generatedCount === 0 ? (
          <div className="skeleton-lines" aria-hidden="true">
            <div className="skeleton" style={{ width: '95%' }} />
            <div className="skeleton" style={{ width: '88%' }} />
            <div className="skeleton" style={{ width: '100%' }} />
            <div className="skeleton" style={{ width: '72%' }} />
            <div className="skeleton" style={{ width: '92%' }} />
            <div className="skeleton" style={{ width: '60%' }} />
          </div>
        ) : generatedCount === 0 ? (
          <div className="empty-guide-card">
            <div className="empty-guide-header">
              <div className="empty-logo-box">
                <img src="/logo-icon.png" alt="ResumeAI Bulb" className="empty-guide-logo-img bulb-icon" />
              </div>
              <h3>Ready to craft your resume & HR summary?</h3>
              <p>
                Fill your details in the left sidebar and click <strong>Generate All</strong>, or explore how everything works below!
              </p>
            </div>

            <div className="empty-guide-steps">
              <div className="empty-step-item">
                <div className="empty-step-num">1</div>
                <div>
                  <strong>Input Details</strong>
                  <p>Add skills, experience & target role on the left sidebar.</p>
                </div>
              </div>
              <div className="empty-step-item">
                <div className="empty-step-num">2</div>
                <div>
                  <strong>Click Generate</strong>
                  <p>AI writes 12 tailored versions (HR, ATS, Cover Letter, Bio, etc.).</p>
                </div>
              </div>
              <div className="empty-step-item">
                <div className="empty-step-num">3</div>
                <div>
                  <strong>Polish & Export</strong>
                  <p>Refine with AI, copy with 1 click, or export to PDF/DOCX.</p>
                </div>
              </div>
            </div>

            <div className="empty-guide-actions">
              <button className="btn btn-primary" onClick={onAll} disabled={allBusy}>
                <Icon name="sparkles" size={16} />
                Generate All Now
              </button>
              {onOpenTour && (
                <button className="btn btn-ghost" onClick={onOpenTour}>
                  <Icon name="compass" size={16} />
                  View Interactive Tour
                </button>
              )}
            </div>
          </div>
        ) : text ? (
          <div className="output-content-area">
            <pre className="output-text">{text}</pre>
          </div>
        ) : (
          <div className="empty-single-section">
            <Icon name="file" size={32} />
            <h4>{OUTPUT_LABELS[active]} not generated yet</h4>
            <p>Use the "Generate One" selector on the sidebar or click "Generate All" to craft this piece.</p>
          </div>
        )}
      </div>

      <div className="output-actions">
        <button className="btn btn-refine" onClick={() => doRefine('improve')} disabled={busy || !text}>
          {refining ? <span className="spinner" aria-hidden="true" /> : <Icon name="sparkles" size={15} />}
          {refining ? 'Refining…' : '✨ Improve Tone'}
        </button>
        <button className="btn btn-refine" onClick={() => doRefine('rewrite')} disabled={busy || !text}>
          <Icon name="refresh" size={15} />
          🔄 Rewrite Alternative
        </button>
        <button className="btn btn-copy" onClick={copyText} disabled={!text}>
          <Icon name={copied ? 'check' : 'copy'} size={15} />
          {copied ? 'Copied to Clipboard!' : 'Copy Text'}
        </button>
      </div>
    </div>
  )
}

