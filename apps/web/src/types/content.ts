export interface Challenge { readonly number: string; readonly title: string; readonly copy: string }
export interface JourneyYear {
  readonly id: 'foundation' | 'direction' | 'proof' | 'execution'
  readonly number: '01' | '02' | '03' | '04'
  readonly label: 'YEAR 01' | 'YEAR 02' | 'YEAR 03' | 'YEAR 04'
  readonly title: string
  readonly thesis: string
  readonly priorities: readonly string[]
  readonly buildItems: readonly string[]
  readonly outcome: string
}
export interface WebinarDetail { readonly label: string; readonly value: string }
export interface AcademicFactor {
  readonly id: 'attendance' | 'internals' | 'practicals' | 'end-sem' | 'semester-performance' | 'cgpa' | 'eligibility'
  readonly label: string
  readonly explanation: string
  readonly whyItMatters: string
  readonly commonMistake: string
}
