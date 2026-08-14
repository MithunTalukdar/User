import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'

export default function Modal({ isOpen, onClose, title, children, className = '' }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // prevent background scrolling
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  return createPortal(
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className={`modal-content ${className}`} role="dialog" aria-modal="true">
        <header className="modal-header">
          {title && <h2>{title}</h2>}
          <button className="icon-btn modal-close" onClick={onClose} aria-label="Close modal">
            <Icon name="close" size={20} />
          </button>
        </header>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
