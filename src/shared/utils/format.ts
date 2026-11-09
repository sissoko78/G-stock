export const formatMoney = (amount: number, currency = 'FCFA'): string =>
  `${new Intl.NumberFormat('fr-FR').format(Math.round(amount))} ${currency === 'FCFA' ? 'F' : currency}`

export const formatDate = (value: string): string =>
  new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))

export const formatTime = (value: string): string =>
  new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))

export const getInitials = (name: string): string =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toLocaleUpperCase('fr') ?? '').join('')

export const createId = (): string => crypto.randomUUID()
