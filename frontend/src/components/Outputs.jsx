import { useState } from 'react'
import { OUTPUT_TYPES, OUTPUT_LABELS } from '../profile.meta'
import { api } from '../api'
import { useToast } from '../hooks/useToast'
import Icon from './Icon'

export default function Outputs({ outputs, profile, onRefine, onAll, allBusy }) {
  const [active, setActive] = useState(OUTPUT_TYPES[0])
  const [refining, setRefining] = useState(false)
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  const text = outputs[active] || ''
  const busy = allBusy || refining
  const wordCount = text ? text.trim().split(/\s+/).length : 0

  async function doRefine(variant) {
    setRefining(true)
    try {
      const { text: next } = await api.refine({ type: active, currentText: text, variant, profile })
      onRefine(active, next)
      toast(variant === 'improve' ? 'Content improved' : 'Content rewritten', 'success')
    } catch (err) {
      toast(err.message || 'Refinement failed', 'error')
    } finally {
      setRefining(false)
    }
  }

  async function saveCurrent() {
    try {
      await api.saveProfile({ profile, variants: outputs })
      toast('Profile saved', 'success')
    } catch {
      toast('Could not save profile', 'error')
    }
  }

  async function exportDoc(kind) {
    try {
      await api.exportFile(`/api/export/${kind}`, { profile, outputs })
      toast(`Exported ${kind.toUpperCase()}`, 'success')
    } catch (err) {
      toast(err.message || 'Export failed', 'error')
    }
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast('Copied to clipboard', 'success')
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
          <h2>Generated Content</h2>
          <p className="output-meta">
            {generatedCount}/{OUTPUT_TYPES.length} types generated
            {wordCount ? ` · ${wordCount.toLocaleString()} words in view` : ''}
          </p>
        </div>
        <div className="head-actions">
          <button className="btn btn-primary" onClick={onAll} disabled={allBusy}>
            {allBusy ? <span className="spinner" aria-hidden="true" /> : <Icon name="sparkles" size={15} />}
            {allBusy ? 'Generating…' : 'Generate All'}
          </button>
          <button className="btn" onClick={saveCurrent} disabled={generatedCount === 0}>
            <Icon name="bookmark" size={15} />
            Save
          </button>
          <button className="btn" onClick={() => exportDoc('pdf')} disabled={generatedCount === 0}>
            <Icon name="download" size={15} />
            PDF
          </button>
          <button className="btn" onClick={() => exportDoc('docx')} disabled={generatedCount === 0}>
            <Icon name="file" size={15} />
            DOCX
          </button>
        </div>
      </div>

      <div className="tab-row" role="tablist" aria-label="Content types">
        {OUTPUT_TYPES.map((t) => (
          <button
            key={t}
            className={`tab ${active === t ? 'active' : ''}`}
            onClick={() => setActive(t)}
            role="tab"
            aria-selected={active === t}
          >
            {OUTPUT_LABELS[t]}
          </button>
        ))}
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
          <p className="empty">
            <Icon name="sparkles" size={26} />
            Fill in your profile and press <strong>Generate All</strong> to create content for every
            section, or open a tab and generate a single piece.
          </p>
        ) : text ? (
          <pre className="output-text">{text}</pre>
        ) : (
          <p className="empty">
            <Icon name="file" size={26} />
            Not generated yet. Select a type above or generate it individually.
          </p>
        )}
      </div>

      <div className="output-actions">
        <button className="btn" onClick={() => doRefine('improve')} disabled={busy || !text}>
          {refining ? <span className="spinner" aria-hidden="true" /> : <Icon name="sparkles" size={15} />}
          {refining ? 'Refining…' : 'Improve'}
        </button>
        <button className="btn" onClick={() => doRefine('rewrite')} disabled={busy || !text}>
          <Icon name="refresh" size={15} />
          Rewrite
        </button>
        <button className="btn btn-copy" onClick={copyText} disabled={!text}>
          <Icon name={copied ? 'check' : 'copy'} size={15} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
