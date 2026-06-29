export const MOCK_PROJECTS = [
  {
    id:          'proj_001',
    name:        'Website Redesign',
    description: 'Complete redesign of the company website with modern UI.',
    client: {
      name:     'Ahmad Enterprises',
      email:    'ahmad@enterprises.pk',
      initials: 'AE',
      color:    '#3D5420',
    },
    status:    'active',
    progress:  68,
    budget:    1200,
    paid:      600,
    dueDate:   '2026-08-15',   
    createdAt: '2026-06-01',
    token:     'tkn_xk9m2p',
    milestones: [
      { id: 1, title: 'Discovery call',  done: true  },
      { id: 2, title: 'Wireframes',      done: true  },
      { id: 3, title: 'Design mockups',  done: true  },
      { id: 4, title: 'Development',     done: false },
      { id: 5, title: 'Final delivery',  done: false },
    ],
    files: [
      { id: 1, name: 'wireframes-v1.pdf',     size: '2.4 MB', uploadedAt: '2026-06-10', url: '#' },
      { id: 2, name: 'design-mockups-v2.pdf', size: '5.8 MB', uploadedAt: '2026-06-18', url: '#' },
    ],
    feedback: [],
  },
  {
    id:          'proj_002',
    name:        'Mobile App UI',
    description: 'Full UI design for iOS and Android mobile application.',
    client: {
      name:     'TechStart PK',
      email:    'hello@techstart.pk',
      initials: 'TP',
      color:    '#6A8A3A',
    },
    status:    'review',
    progress:  92,
    budget:    2500,
    paid:      2500,
    dueDate:   '2026-09-20',  
    createdAt: '2026-05-15',
    token:     'tkn_ab3n7q',
    milestones: [
      { id: 1, title: 'Research',   done: true  },
      { id: 2, title: 'Wireframes', done: true  },
      { id: 3, title: 'UI Design',  done: true  },
      { id: 4, title: 'Prototype',  done: true  },
      { id: 5, title: 'Handoff',    done: false },
    ],
    files: [
      { id: 1, name: 'app-prototype.fig',   size: '12.3 MB', uploadedAt: '2026-06-01', url: '#' },
      { id: 2, name: 'design-system.pdf',   size: '3.1 MB',  uploadedAt: '2026-06-05', url: '#' },
      { id: 3, name: 'component-specs.pdf', size: '1.8 MB',  uploadedAt: '2026-06-08', url: '#' },
    ],
    feedback: [
      {
        id:        1,
        name:      'Bilal Sheikh',
        message:   'The prototype looks amazing! Love the color palette. Can we tweak the onboarding flow slightly?',
        createdAt: '2026-06-10T10:30:00Z',
      },
    ],
  },
  {
    id:          'proj_003',
    name:        'Brand Identity',
    description: 'Complete brand identity package including logo and guidelines.',
    client: {
      name:     'Karachi Foods Co.',
      email:    'info@karachifoods.pk',
      initials: 'KF',
      color:    '#A8C070',
    },
    status:    'active',
    progress:  35,
    budget:    800,
    paid:      400,
    dueDate:   '2026-10-01', 
    createdAt: '2026-06-10',
    token:     'tkn_cd8r1s',
    milestones: [
      { id: 1, title: 'Brand brief',   done: true  },
      { id: 2, title: 'Concept ideas', done: true  },
      { id: 3, title: 'Refinement',    done: false },
      { id: 4, title: 'Final files',   done: false },
    ],
    files:    [],
    feedback: [],
  },
  {
    id:          'proj_004',
    name:        'E-commerce Store',
    description: 'Full Shopify store setup with custom theme and checkout.',
    client: {
      name:     'Fashion Hub PK',
      email:    'shop@fashionhub.pk',
      initials: 'FH',
      color:    '#2E3D18',
    },
    status:    'completed',
    progress:  100,
    budget:    1800,
    paid:      1800,
    dueDate:   '2026-06-20',  
    createdAt: '2026-04-01',
    token:     'tkn_ef5t2u',
    milestones: [
      { id: 1, title: 'Planning',    done: true },
      { id: 2, title: 'Design',      done: true },
      { id: 3, title: 'Development', done: true },
      { id: 4, title: 'Testing',     done: true },
      { id: 5, title: 'Launch',      done: true },
    ],
    files: [
      { id: 1, name: 'store-final-designs.pdf', size: '9.2 MB', uploadedAt: '2026-06-18', url: '#' },
      { id: 2, name: 'handoff-guide.pdf',       size: '2.1 MB', uploadedAt: '2026-06-19', url: '#' },
    ],
    feedback: [
      {
        id:        1,
        name:      'Sara Naz',
        message:   'Everything looks perfect! The checkout flow is exactly what we wanted.',
        createdAt: '2026-06-20T14:00:00Z',
      },
    ],
  },
];

export function getDashboardStats(projects) {
  const total   = projects.length;
  const active  = projects.filter(p => p.status === 'active').length;
  const pending = projects
    .filter(p => p.status !== 'completed')
    .reduce((sum, p) => sum + (p.budget - p.paid), 0);
  const earned  = projects.reduce((sum, p) => sum + p.paid, 0);
  return { total, active, pending, earned };
}