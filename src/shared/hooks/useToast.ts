import { useCallback, useState } from 'react'
import type { ToastKind, ToastMessage } from '../types/domain'

export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([])
  const notify = useCallback((kind: ToastKind, message: string) => {
    setMessages((current) => [...current, { id: crypto.randomUUID(), kind, message }])
  }, [])
  const dismiss = useCallback((id: string) => {
    setMessages((current) => current.filter((message) => message.id !== id))
  }, [])
  return { messages, notify, dismiss }
}
