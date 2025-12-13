import { nanoid } from 'nanoid';

export type UserType = 'ORGANIZATION' | 'DONOR' | 'INVESTOR';

export interface User {
  id: string;
  email: string;
  name: string;
  type: UserType;
  isDiiaVerified: boolean;
  avatar?: string;
  createdAt: string;
  description?: string; // For landing page showcase
  logo?: string; // For organizations/investors
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

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
  likes: number;
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
  images?: string[]; // Array of project images
  location: string; // Hromada/Community
  likes: number;
  comments: Comment[];
  isRecommended?: boolean;
}

export interface Donation {
  id: string;
  amount: number;
  donorId: string;
  projectId: string;
  createdAt: string;
}

export interface Grant {
  id: string;
  title: string;
  description: string;
  amount: number;
  providerId: string;
  providerName: string;
  deadline: string;
  categories: string[];
  requirements: string[];
}

export const CATEGORIES = [
  'Medical Aid',
  'Military Support',
  'Humanitarian Aid',
  'Animal Welfare',
  'Education',
  'Reconstruction',
  'Children',
  'Elderly Care',
  'Infrastructure',
  'Culture'
];

export const LOCATIONS = [
  'Kyiv',
  'Lviv',
  'Kharkiv',
  'Dnipro',
  'Odesa',
  'Bucha',
  'Irpin',
  'Mariupol (Support)',
  'Kherson',
  'Zaporizhzhia'
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
    description: 'One of the largest foundations providing competent assistance to the military.'
  },
  {
    id: 'org-2',
    email: 'info@pritulafoundation.org',
    name: 'Serhiy Prytula Charity Foundation',
    type: 'ORGANIZATION',
    isDiiaVerified: true,
    avatar: 'https://ui-avatars.com/api/?name=Prytula+Foundation&background=0D8ABC&color=fff',
    createdAt: new Date().toISOString(),
    description: 'Focuses on strengthening the Defense Forces of Ukraine and civilian aid.'
  },
  {
    id: 'investor-1',
    email: 'grants@us-aid.org',
    name: 'US Aid Direct',
    type: 'INVESTOR',
    isDiiaVerified: true,
    avatar: 'https://ui-avatars.com/api/?name=US+Aid&background=ef4444&color=fff',
    createdAt: new Date().toISOString(),
    description: 'Supporting democratic resilience and economic recovery.'
  }
];

export const MOCK_GRANTS: Grant[] = [
  {
    id: 'grant-1',
    title: 'Community Resilience Fund',
    description: 'Grants for projects aiming to rebuild local infrastructure and community centers in de-occupied territories.',
    amount: 5000000,
    providerId: 'investor-1',
    providerName: 'US Aid Direct',
    deadline: '2025-12-31',
    categories: ['Reconstruction', 'Infrastructure'],
    requirements: ['Registered NGO', '2+ years experience', 'Clear impact metrics']
  },
  {
    id: 'grant-2',
    title: 'Educational Tech Initiative',
    description: 'Funding for supplying schools with modern equipment and internet access.',
    amount: 2000000,
    providerId: 'investor-1',
    providerName: 'US Aid Direct',
    deadline: '2025-10-15',
    categories: ['Education', 'Children'],
    requirements: ['Partnership with local schools', 'Sustainability plan']
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    location: 'Dnipro',
    likes: 124,
    comments: [
      { id: 'c1', userId: 'u1', userName: 'Oleg M.', text: 'Great initiative! Donated.', createdAt: new Date().toISOString(), likes: 5 },
      { id: 'c2', userId: 'u2', userName: 'Anna K.', text: 'Is there a list of specific tools needed?', createdAt: new Date().toISOString(), likes: 2 }
    ],
    timeline: [
      { id: 't1', date: '2025-06-01', title: 'Procurement of Vehicles', description: 'Buying 3 unused van chassis' },
      { id: 't2', date: '2025-07-01', title: 'Equipping', description: 'Installing tools and generators' },
      { id: 't3', date: '2025-07-15', title: 'Delivery', description: 'Handover to the brigade' }
    ],
    budget: [
      { id: 'b1', category: 'Vehicles', amount: 900000 },
      { id: 'b2', category: 'Tools & Equipment', amount: 400000 },
      { id: 'b3', category: 'Logistics', amount: 200000 }
    ],
    images: [
      'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=800&q=80',
      'https://images.pexels.com/photos/3938021/pexels-photo-3938021.jpeg?w=800&q=80'
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
    location: 'Kharkiv',
    likes: 89,
    comments: [],
    timeline: [
      { id: 't1', date: '2025-05-20', title: 'Sourcing', description: 'Ordering components from suppliers' },
      { id: 't2', date: '2025-06-10', title: 'Assembly', description: 'Assembling kits by volunteers' }
    ],
    budget: [
      { id: 'b1', category: 'Medical Supplies', amount: 450000 },
      { id: 'b2', category: 'Logistics', amount: 50000 }
    ],
    images: [
      'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=800&q=80',
      'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=800&q=80'
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
    location: 'Irpin',
    likes: 450,
    isRecommended: true,
    comments: [],
    timeline: [],
    budget: [],
    images: [
      'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?w=800&q=80',
      'https://images.pexels.com/photos/3776931/pexels-photo-3776931.jpeg?w=800&q=80'
    ]
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
    location: 'Kyiv',
    likes: 210,
    comments: [],
    timeline: [],
    budget: [],
    images: [
      'https://images.pexels.com/photos/3807511/pexels-photo-3807511.jpeg?w=800&q=80',
      'https://images.pexels.com/photos/3962282/pexels-photo-3962282.jpeg?w=800&q=80'
    ]
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
    location: 'Donetsk',
    likes: 15,
    comments: [],
    timeline: [],
    budget: [],
    images: [
      'https://images.pexels.com/photos/3932589/pexels-photo-3932589.jpeg?w=800&q=80',
      'https://images.pexels.com/photos/4553207/pexels-photo-4553207.jpeg?w=800&q=80'
    ]
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
    location: 'Lviv',
    likes: 340,
    isRecommended: true,
    comments: [],
    timeline: [],
    budget: [],
    images: [
      'https://images.pexels.com/photos/3808517/pexels-photo-3808517.jpeg?w=800&q=80',
      'https://images.pexels.com/photos/3992949/pexels-photo-3992949.jpeg?w=800&q=80'
    ]
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
    location: 'Odesa',
    likes: 56,
    comments: [],
    timeline: [],
    budget: [],
    images: [
      'https://images.pexels.com/photos/3862635/pexels-photo-3862635.jpeg?w=800&q=80',
      'https://images.pexels.com/photos/3995315/pexels-photo-3995315.jpeg?w=800&q=80'
    ]
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
    location: 'Kyiv',
    likes: 890,
    isRecommended: true,
    comments: [],
    timeline: [],
    budget: [],
    images: [
      'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?w=800&q=80',
      'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?w=800&q=80'
    ]
  }
];
