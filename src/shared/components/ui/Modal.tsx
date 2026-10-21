import type { ReactNode } from 'react'
import { Icon } from './Icon'

interface ModalProps { title: string; onClose: () => void; children: ReactNode; wide?: boolean }

export function Modal({ title, onClose, children, wide = false }: ModalProps) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-head"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Fermer"><Icon name="close" /></button></div>
      {children}
    </section>
  </div>
}
