import type { ReactNode } from 'react'

export type IconName = 'grid' | 'box' | 'swap' | 'chart' | 'users' | 'gear' | 'search' | 'plus' | 'alert' | 'arrow' | 'close' | 'download' | 'file' | 'more'
const paths: Record<IconName, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></>,
  box: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9"/></>,
  swap: <><path d="M7 7h14l-3-3M17 17H3l3 3"/><path d="M18 4v6M6 14v6"/></>,
  chart: <><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  gear: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1L15.8 21h-2.8l-.3-1.9a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.5-1.2a7 7 0 0 1 0-2l-1.5-1.2 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1L13 5h2.8l.3 1.9a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.5 1.2a7 7 0 0 1 0 2Z" transform="translate(-1 -1)"/></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  alert: <><path d="m10.3 3.8-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.2l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/></>,
  arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
  close: <><path d="m18 6-12 12M6 6l12 12"/></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8m-8 4h8"/></>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
}

interface IconProps { name: IconName; size?: number }
export function Icon({ name, size = 19 }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
