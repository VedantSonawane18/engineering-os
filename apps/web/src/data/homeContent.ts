import type { Challenge, WebinarDetail } from '../types/content'

export const challenges: readonly Challenge[] = [
  { number: '01', title: 'The first semester shock', copy: 'College moves faster than the advice you were given.' },
  { number: '02', title: 'The CGPA fog', copy: 'One number feels permanent when no one explains the system.' },
  { number: '03', title: 'The roadmap noise', copy: 'Too many paths. Too little signal about what to build first.' },
]
export const webinarDetails: readonly WebinarDetail[] = [
  { label: 'FORMAT', value: 'Live online' },
  { label: 'FOCUS', value: 'First-year engineering' },
  { label: 'NEXT SESSION', value: 'Announcing soon' },
]
