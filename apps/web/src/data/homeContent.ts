import type { Challenge, JourneyYear, WebinarDetail } from '../types/content'

export const challenges: readonly Challenge[] = [
  { number: '01', title: 'The first semester shock', copy: 'College moves faster than the advice you were given.' },
  { number: '02', title: 'The CGPA fog', copy: 'One number feels permanent when no one explains the system.' },
  { number: '03', title: 'The roadmap noise', copy: 'Too many paths. Too little signal about what to build first.' },
]
export const journeyYears: readonly JourneyYear[] = [
  { label: 'YEAR 01', title: 'Find your footing', copy: 'Academic systems, habits, programming foundations.' },
  { label: 'YEAR 02', title: 'Choose a direction', copy: 'Explore fields. Build skill depth without losing balance.' },
  { label: 'YEAR 03', title: 'Make work visible', copy: 'Projects, internships, proof that compounds.' },
  { label: 'YEAR 04', title: 'Move with intent', copy: 'Placement strategy, interviews, your first real choices.' },
]
export const webinarDetails: readonly WebinarDetail[] = [
  { label: 'FORMAT', value: 'Live online' },
  { label: 'FOCUS', value: 'First-year engineering' },
  { label: 'NEXT SESSION', value: 'Announcing soon' },
]
