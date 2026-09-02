export type TechnologyPathId =
  | 'development'
  | 'ai-ml'
  | 'data'
  | 'systems'
  | 'cloud'

export interface TechnologyPath {
  readonly id: TechnologyPathId
  readonly number: string
  readonly title: string
  readonly thesis: string
  readonly description: string
  readonly suitableFor: readonly string[]
  readonly technologies: readonly string[]
  readonly progression: readonly string[]
  readonly roles: readonly string[]
}

export interface CareerStage {
  readonly id:
    | 'foundation'
    | 'skills'
    | 'projects'
    | 'proof'
    | 'internship'
    | 'interview'
    | 'placement'
  readonly number: string
  readonly title: string
  readonly description: string
  readonly output: string
}