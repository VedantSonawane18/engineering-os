export interface CareerStage {
    number: string
    title: string
    description: string
    outcome: string
  }
  
  export const careerStages: readonly CareerStage[] = [
    {
      number: '01',
      title: 'Foundation',
      description: 'Understand programming, engineering fundamentals and how systems work.',
      outcome: 'Build the base.',
    },
    {
      number: '02',
      title: 'Skills',
      description: 'Develop technical depth through deliberate practice and structured learning.',
      outcome: 'Become capable.',
    },
    {
      number: '03',
      title: 'Projects',
      description: 'Turn what you learn into things that solve real problems.',
      outcome: 'Make evidence.',
    },
    {
      number: '04',
      title: 'Proof of work',
      description: 'Document your projects, decisions and technical thinking.',
      outcome: 'Show your ability.',
    },
    {
      number: '05',
      title: 'Internship',
      description: 'Apply your skills in environments where real constraints exist.',
      outcome: 'Gain exposure.',
    },
    {
      number: '06',
      title: 'Placement',
      description: 'Convert your accumulated skill and evidence into career opportunities.',
      outcome: 'Create options.',
    },
  ]