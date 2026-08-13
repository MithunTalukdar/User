import { useCallback, useState } from 'react'
import { ToastContext } from '../context/ToastContext'
import Icon from './Icon'

let seed = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const push = useCallback(
    (message, type = 'success') => {
      const id = ++seed
      setToasts((t) => [...t.slice(-3), { id, message, type }])
      window.setTimeout(() => dismiss(id), 3200)
    },
    [dismiss],
  )

  const toast = useCallback((message, type = 'success') => push(message, type), [push])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts" role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type} animate-up`} role="status">
            <Icon name={t.type === 'error' ? 'alert' : t.type === 'info' ? 'info' : 'checkCircle'} size={17} />
            <span>{t.message}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
