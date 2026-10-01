import type { SVGProps } from 'react'

const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false } as const
type P = SVGProps<SVGSVGElement>
const I = (d: React.ReactNode) => (p: P) => <svg {...base} {...p}>{d}</svg>

export const BagIcon = I(<><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>)
export const HomeIcon = I(<><path d="M4 11 12 4l8 7" /><path d="M6 10v10h12V10" /></>)
export const LiveIcon = I(<><circle cx="12" cy="12" r="2.5" /><path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 4.6a10.5 10.5 0 0 1 0 14.8" /></>)
export const MoonIcon = I(<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />)
export const SunIcon = I(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>)
export const PlusIcon = I(<path d="M12 5v14M5 12h14" />)
export const CloseIcon = I(<path d="M6 6l12 12M18 6 6 18" />)
export const ArrowUpIcon = I(<path d="M12 19V5M5 12l7-7 7 7" />)
export const CheckIcon = I(<path d="m5 12.5 4.5 4.5L19 7.5" />)
export const ClockIcon = I(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>)
export const EyeIcon = I(<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.8" /></>)
export const FilterIcon = I(<><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>)
export const BoxIcon = I(<><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" /><path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9" /></>)
export const WifiOffIcon = I(<><path d="M3 3l18 18" /><path d="M8.5 8.8A10 10 0 0 0 2.5 12M5.5 12.2a6.5 6.5 0 0 1 3.3-1.9M10.5 15.2a3.2 3.2 0 0 1 3 0M16 10.6a6.5 6.5 0 0 1 2.5 1.6M13 6.2c3.3.3 6.2 2 8 4.8" /><circle cx="12" cy="19" r=".8" fill="currentColor" /></>)
export const CameraIcon = I(<><path d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" /><circle cx="12" cy="13.5" r="3.2" /></>)
export const ShoeIcon = I(<><path d="M3 16.5V10l4 1.5c1.2.5 2.2-.2 3-1.2l1-1.3 3 2c1.4 1 3.2 1.5 5 1.8 1.2.3 2 1.2 2 2.4V16.5H3Z" /><path d="M3 19h18" /></>)
export const ShirtIcon = I(<path d="m8 4-5 3 2 4 2-1v10h10V10l2 1 2-4-5-3c-.5 1.5-1.8 2.5-4 2.5S8.5 5.5 8 4Z" />)
export const BagCatIcon = I(<><path d="M5 9h14l1 11H4L5 9Z" /><path d="M9 9V7a3 3 0 0 1 6 0v2" /></>)
export const GridIcon = I(<><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></>)
