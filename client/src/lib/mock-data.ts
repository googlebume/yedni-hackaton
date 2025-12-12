import { nanoid } from 'nanoid';

export type UserType = 'ORGANIZATION' | 'DONOR';

export interface User {
  id: string;
  email: string;
  name: string;
  type: UserType;
  isDiiaVerified: boolean;
  avatar?: string;
  createdAt: string;
}

export type ProjectStatus = 'DRAFT' | 'FUNDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface ProjectTimeline {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  categories: string[];
  goalAmount: number;
  currentAmount: number;
  status: ProjectStatus;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  timeline: ProjectTimeline[];
  budget: Budget[];
  coverImage?: string;
}

export interface Donation {
  id: string;
  amount: number;
  donorId: string;
  projectId: string;
  createdAt: string;
}

export const CATEGORIES = [
  'Medical Aid',
  'Military Support',
  'Humanitarian Aid',
  'Animal Welfare',
  'Education',
  'Reconstruction',
  'Children',
  'Elderly Care'
];

export const MOCK_USERS: User[] = [
  {
    id: 'org-1',
    email: 'contact@comebackalive.ua',
    name: 'Come Back Alive',
    type: 'ORGANIZATION',
    isDiiaVerified: true,
    avatar: 'https://ui-avatars.com/api/?name=Come+Back+Alive&background=0D8ABC&color=fff',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'org-2',
    email: 'info@pritulafoundation.org',
    name: 'Serhiy Prytula Charity Foundation',
    type: 'ORGANIZATION',
    isDiiaVerified: true,
    avatar: 'https://ui-avatars.com/api/?name=Prytula+Foundation&background=0D8ABC&color=fff',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'donor-1',
    email: 'donor@example.com',
    name: 'Alex Donor',
    type: 'DONOR',
    isDiiaVerified: false,
    avatar: 'https://ui-avatars.com/api/?name=Alex+Donor&background=random',
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Mobile Repair Stations for 93rd Brigade',
    description: 'Procurement and equipping of 3 mobile repair stations for the 93rd Mechanized Brigade "Kholodnyi Yar". These stations will allow repairing vehicles directly on the frontline, significantly reducing downtime.',
    categories: ['Military Support', 'Reconstruction'],
    goalAmount: 1500000,
    currentAmount: 1250000,
    status: 'FUNDING',
    creatorId: 'org-1',
    creatorName: 'Come Back Alive',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    timeline: [
      { id: 't1', date: '2025-06-01', title: 'Procurement of Vehicles', description: 'Buying 3 unused van chassis' },
      { id: 't2', date: '2025-07-01', title: 'Equipping', description: 'Installing tools and generators' },
      { id: 't3', date: '2025-07-15', title: 'Delivery', description: 'Handover to the brigade' }
    ],
    budget: [
      { id: 'b1', category: 'Vehicles', amount: 900000 },
      { id: 'b2', category: 'Tools & Equipment', amount: 400000 },
      { id: 'b3', category: 'Logistics', amount: 200000 }
    ]
  },
  {
    id: 'proj-2',
    title: 'Tactical Medicine for Kharkiv Region',
    description: 'Supplying 500 IFAK kits and specialized medical backpacks for paramedics working in the Kharkiv direction.',
    categories: ['Medical Aid', 'Military Support'],
    goalAmount: 500000,
    currentAmount: 120000,
    status: 'FUNDING',
    creatorId: 'org-2',
    creatorName: 'Serhiy Prytula Charity Foundation',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    timeline: [
      { id: 't1', date: '2025-05-20', title: 'Sourcing', description: 'Ordering components from suppliers' },
      { id: 't2', date: '2025-06-10', title: 'Assembly', description: 'Assembling kits by volunteers' }
    ],
    budget: [
      { id: 'b1', category: 'Medical Supplies', amount: 450000 },
      { id: 'b2', category: 'Logistics', amount: 50000 }
    ]
  },
  {
    id: 'proj-3',
    title: 'Shelter Reconstruction in Irpin',
    description: 'Rebuilding a kindergarten bomb shelter to ensure safety for 150 children. Includes ventilation, fresh water supply, and sleeping places.',
    categories: ['Reconstruction', 'Children'],
    goalAmount: 800000,
    currentAmount: 800000,
    status: 'COMPLETED',
    creatorId: 'org-1',
    creatorName: 'Come Back Alive',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    timeline: [],
    budget: []
  },
  {
    id: 'proj-4',
    title: 'Winter Uniforms for Territorial Defense',
    description: 'Providing warm clothing, thermal underwear, and sleeping bags for a TD battalion.',
    categories: ['Military Support'],
    goalAmount: 2000000,
    currentAmount: 500000,
    status: 'IN_PROGRESS',
    creatorId: 'org-2',
    creatorName: 'Serhiy Prytula Charity Foundation',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    timeline: [],
    budget: []
  },
  {
    id: 'proj-5',
    title: 'Veterinary Evacuation Vehicle',
    description: 'Purchase of a specialized vehicle for evacuating injured animals from frontline zones.',
    categories: ['Animal Welfare'],
    goalAmount: 300000,
    currentAmount: 45000,
    status: 'DRAFT',
    creatorId: 'org-1',
    creatorName: 'Come Back Alive',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    timeline: [],
    budget: []
  },
  {
    id: 'proj-6',
    title: 'Educational Tablets for Displaced Kids',
    description: 'Providing 100 tablets for online education to children displaced from occupied territories.',
    categories: ['Education', 'Children'],
    goalAmount: 600000,
    currentAmount: 350000,
    status: 'FUNDING',
    creatorId: 'org-1',
    creatorName: 'Come Back Alive',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    timeline: [],
    budget: []
  },
  {
    id: 'proj-7',
    title: 'Generator Sets for Hospital #4',
    description: 'High-power generators to ensure uninterrupted operation of the intensive care unit during blackouts.',
    categories: ['Medical Aid', 'Humanitarian Aid'],
    goalAmount: 1200000,
    currentAmount: 900000,
    status: 'FUNDING',
    creatorId: 'org-2',
    creatorName: 'Serhiy Prytula Charity Foundation',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    timeline: [],
    budget: []
  },
  {
    id: 'proj-8',
    title: 'Drone School Setup',
    description: 'Establishing a training center for FPV drone operators.',
    categories: ['Military Support', 'Education'],
    goalAmount: 400000,
    currentAmount: 400000,
    status: 'IN_PROGRESS',
    creatorId: 'org-1',
    creatorName: 'Come Back Alive',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    timeline: [],
    budget: []
  }
];
