import { useEffect } from 'react'
import type { ToastMessage } from '../../types/domain'
import { TOAST_DURATION_MS } from '../../utils/constants'

interface ToastRegionProps { messages: ToastMessage[]; onDismiss: (id: string) => void }
export function ToastRegion({ messages, onDismiss }: ToastRegionProps) {
  useEffect(() => {
    const timers = messages.map((message) => window.setTimeout(() => onDismiss(message.id), TOAST_DURATION_MS))
    return () => timers.forEach(window.clearTimeout)
  }, [messages, onDismiss])

  return <div className="toast-region" aria-live="polite" aria-atomic="false">
    {messages.map((message) => <div className={`toast toast-${message.kind}`} key={message.id} role={message.kind === 'error' ? 'alert' : 'status'}>
      <span aria-hidden="true">{message.kind === 'success' ? '✓' : message.kind === 'error' ? '!' : message.kind === 'warning' ? '⚠' : 'i'}</span>
      {message.message}<button aria-label="Fermer le message" onClick={() => onDismiss(message.id)}>×</button>
    </div>)}
  </div>
}
