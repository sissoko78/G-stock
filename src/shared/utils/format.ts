export const formatMoney = (amount: number, currency = 'FCFA'): string =>
  `${new Intl.NumberFormat('fr-FR').format(Math.round(amount))} ${currency === 'FCFA' ? 'F' : currency}`

export const formatDate = (value: string): string =>
  new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))

export const formatTime = (value: string): string =>
  new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))

export const createId = (): string => crypto.randomUUID()
