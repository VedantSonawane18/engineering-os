import type { TechnologyPath } from '../types/technology'

export const technologyPaths: readonly TechnologyPath[] = [
  {
    id: 'development',
    number: '01',
    title: 'DEVELOPMENT',
    thesis: 'Learn to turn ideas into systems people can use.',
    description:
      'Software development is the broadest starting point for students who want to build applications, websites, services and products.',
    suitableFor: [
      'Students who enjoy building things',
      'Students interested in software engineering',
      'Students who want a broad technical foundation',
    ],
    technologies: [
      'JavaScript / TypeScript',
      'Java',
      'Python',
      'Git & GitHub',
    ],
    progression: [
      'Language fundamentals',
      'Data structures & problem solving',
      'Development fundamentals',
      'Projects',
      'Deployment',
      'Interview preparation',
    ],
    roles: [
      'Software Engineer',
      'Full-Stack Developer',
      'Backend Developer',
      'Frontend Developer',
    ],
  },
  {
    id: 'ai-ml',
    number: '02',
    title: 'AI / ML',
    thesis: 'Learn how systems turn data into predictions and decisions.',
    description:
      'AI and machine learning combine mathematics, programming, data and experimentation to build systems that can learn patterns.',
    suitableFor: [
      'Students interested in intelligent systems',
      'Students comfortable with mathematics and experimentation',
      'Students interested in research or applied AI',
    ],
    technologies: [
      'Python',
      'NumPy',
      'Pandas',
      'Machine Learning',
      'Deep Learning',
    ],
    progression: [
      'Python fundamentals',
      'Mathematics & statistics',
      'Data handling',
      'Machine learning',
      'Deep learning',
      'Model deployment',
    ],
    roles: [
      'ML Engineer',
      'AI Engineer',
      'Data Scientist',
      'Applied AI Developer',
    ],
  },
  {
    id: 'data',
    number: '03',
    title: 'DATA',
    thesis: 'Learn to turn information into useful decisions.',
    description:
      'Data-focused paths involve collecting, cleaning, analysing and communicating information so that people and systems can make better decisions.',
    suitableFor: [
      'Students who enjoy analytical problems',
      'Students interested in statistics',
      'Students who like working with information',
    ],
    technologies: [
      'Python',
      'SQL',
      'Pandas',
      'Data Visualization',
      'Statistics',
    ],
    progression: [
      'Programming',
      'SQL',
      'Statistics',
      'Data analysis',
      'Visualization',
      'Advanced data systems',
    ],
    roles: [
      'Data Analyst',
      'Data Engineer',
      'Analytics Engineer',
      'Data Scientist',
    ],
  },
  {
    id: 'systems',
    number: '04',
    title: 'SYSTEMS',
    thesis: 'Understand what software is built on top of.',
    description:
      'Systems knowledge explores computers beneath application code: operating systems, networking, architecture and low-level programming.',
    suitableFor: [
      'Students curious about how computers actually work',
      'Students interested in infrastructure',
      'Students who enjoy deeper technical concepts',
    ],
    technologies: [
      'C / C++',
      'Operating Systems',
      'Computer Networks',
      'Computer Architecture',
    ],
    progression: [
      'C / C++ fundamentals',
      'Data structures',
      'Computer architecture',
      'Operating systems',
      'Networking',
      'Systems projects',
    ],
    roles: [
      'Systems Engineer',
      'Embedded Engineer',
      'Infrastructure Engineer',
      'Network Engineer',
    ],
  },
  {
    id: 'cloud',
    number: '05',
    title: 'CLOUD / DEVOPS',
    thesis: 'Learn how software survives outside your laptop.',
    description:
      'Cloud and DevOps focus on deployment, infrastructure, automation, observability and the systems that keep applications running.',
    suitableFor: [
      'Students interested in infrastructure',
      'Students who enjoy automation',
      'Developers who want to understand production systems',
    ],
    technologies: [
      'Linux',
      'Git',
      'Docker',
      'Cloud Platforms',
      'CI / CD',
    ],
    progression: [
      'Linux fundamentals',
      'Networking',
      'Containers',
      'Cloud fundamentals',
      'CI / CD',
      'Observability',
    ],
    roles: [
      'DevOps Engineer',
      'Cloud Engineer',
      'Site Reliability Engineer',
      'Platform Engineer',
    ],
  },
]