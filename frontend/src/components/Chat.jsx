import { useEffect, useRef, useState } from 'react'
import { api } from '../api'
import Icon from './Icon'
import ReactMarkdown from 'react-markdown'

const SUGGESTIONS = [
  'How do I describe my gap year?',
  'Write an interview introduction for me',
  'What should I put in a cover letter?',
  'Improve my LinkedIn headline',
]

export default function Chat({ profile }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  async function send(e) {
    e.preventDefault()
    const content = input.trim()
    if (!content || busy) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', content }])
    setBusy(true)
    try {
      const { reply } = await api.chat({ messages: [...messages, { role: 'user', content }], profile })
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: `Error: ${err.message}` }])
    } finally {
      setBusy(false)
    }
  }

  function applySuggestion(s) {
    setInput(s)
  }

  return (
    <div className="chat-wrap">
      <div className="chat-log" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 && (
          <p className="empty">
            <Icon name="chat" size={26} />
            Ask me anything about resumes, interviews, LinkedIn, or your career.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.role === 'assistant' ? (
              <ReactMarkdown>{m.content}</ReactMarkdown>
            ) : (
              m.content
            )}
          </div>
        ))}
        {busy && (
          <div className="msg assistant typing">
            <span className="typing-dots" aria-label="Assistant is typing">
              <span />
              <span />
              <span />
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length === 0 && (
        <div className="chat-suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => applySuggestion(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={send} className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          aria-label="Message"
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary" disabled={busy || !input.trim()}>
          {busy ? <span className="spinner" aria-hidden="true" /> : <Icon name="send" size={15} />}
          Send
        </button>
      </form>
    </div>
  )
}
