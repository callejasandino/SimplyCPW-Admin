// Previous mock data...

// Mock Quotes Data
export const mockQuotes = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, USA 12345',
    servicesNeeded: ['Residential House Washing', 'Driveway & Walkway Cleaning'],
    additionalInfo: 'Two-story house with attached garage',
    status: 'Pending',
    createdAt: '2024-07-15T09:00:00',
    agreedToTerms: true
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, Somewhere, USA 67890',
    servicesNeeded: ['Deck & Patio Restoration'],
    additionalInfo: 'Large wooden deck needs restoration',
    status: 'Approved',
    createdAt: '2024-07-14T10:30:00',
    agreedToTerms: true
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'm.brown@example.com',
    phone: '(555) 456-7890',
    address: '789 Pine Rd, Elsewhere, USA 13579',
    servicesNeeded: ['Commercial Building Cleaning'],
    additionalInfo: 'Three-story office building',
    status: 'Completed',
    createdAt: '2024-07-13T14:15:00',
    agreedToTerms: true
  }
];

// Mock Jobs Data
export const mockJobs = [
  {
    id: '1',
    title: 'Residential House Washing',
    client: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, USA 12345'
    },
    date: '2024-07-15T09:00:00',
    duration: 3, // hours
    status: 'Scheduled',
    price: 250,
    notes: 'Two-story house, focus on north side with mildew',
    services: ['Residential House Washing'],
    team: ['Mike', 'Steve'],
    equipment: ['Power Washer', 'Extension Ladder', 'Surface Cleaner']
  },
  {
    id: '2',
    title: 'Commercial Building Cleaning',
    client: {
      name: 'Acme Corp',
      email: 'facilities@acme.com',
      phone: '(555) 987-6543',
      address: '456 Business Ave, Commerce City, USA 67890'
    },
    date: '2024-07-16T08:00:00',
    duration: 6,
    status: 'Confirmed',
    price: 800,
    notes: 'Annual cleaning contract, need security clearance',
    services: ['Commercial Building Cleaning'],
    team: ['Mike', 'Steve', 'Tom'],
    equipment: ['Commercial Pressure Washer', 'Lift', 'Chemical Sprayer']
  },
  {
    id: '3',
    title: 'Deck and Driveway Package',
    client: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 456-7890',
      address: '789 Oak Rd, Suburb, USA 13579'
    },
    date: '2024-07-17T10:00:00',
    duration: 4,
    status: 'In Progress',
    price: 450,
    notes: 'Wooden deck needs special care, oil stains on driveway',
    services: ['Deck & Patio Restoration', 'Driveway & Walkway Cleaning'],
    team: ['Steve', 'Tom'],
    equipment: ['Power Washer', 'Surface Cleaner', 'Deck Brush']
  }
];

// Calendar Events Data
export const mockCalendarEvents = mockJobs.map(job => ({
  id: job.id,
  title: `${job.title} - ${job.client.name}`,
  start: job.date,
  end: new Date(new Date(job.date).getTime() + job.duration * 60 * 60 * 1000).toISOString(),
  backgroundColor: getStatusColor(job.status),
  extendedProps: {
    jobId: job.id,
    status: job.status,
    client: job.client,
    price: job.price
  }
}));

function getStatusColor(status) {
  switch (status) {
    case 'Scheduled':
      return '#48b0f7' // secondary
    case 'Confirmed':
      return '#4caf50' // green
    case 'In Progress':
      return '#f77f00' // orange
    case 'Completed':
      return '#003f8a' // primary
    case 'Cancelled':
      return '#dc2626' // red
    default:
      return '#6b7280' // gray
  }
}

// Dashboard Data
export const dashboardData = {
  stats: [
    { title: 'Revenue', value: '15,000', subtitle: 'Last 30 days', change: 15, prefix: '$' },
    { title: 'Jobs Completed', value: '120', subtitle: 'Last 30 days', change: 8 },
    { title: 'New Clients', value: '32', subtitle: 'Last 30 days', change: 22 },
    { title: 'Avg. Rating', value: '4.8', subtitle: 'Last 30 days', change: 2, prefix: '' }
  ],
  monthlyData: [
    { month: 'Jan', revenue: 1200, jobs: 10 },
    { month: 'Feb', revenue: 1500, jobs: 12 },
    { month: 'Mar', revenue: 1800, jobs: 15 },
    { month: 'Apr', revenue: 2000, jobs: 18 },
    { month: 'May', revenue: 2200, jobs: 20 },
    { month: 'Jun', revenue: 2500, jobs: 22 },
    { month: 'Jul', revenue: 2800, jobs: 25 }
  ],
  serviceDistribution: [
    { name: 'Residential', value: 40 },
    { name: 'Commercial', value: 30 },
    { name: 'Driveways', value: 15 },
    { name: 'Decks & Patios', value: 10 },
    { name: 'Roofs', value: 5 }
  ],
  leadSources: [
    { name: 'Website', value: 35 },
    { name: 'Referral', value: 30 },
    { name: 'Social Media', value: 20 },
    { name: 'Advertising', value: 15 }
  ]
};

// Mock Services Data
export const mockServices = [
  {
    id: '1',
    name: 'Residential House Washing',
    description: 'Complete exterior cleaning for homes',
    price: 'From $200',
    duration: '2-4 hours'
  },
  {
    id: '2',
    name: 'Commercial Building Cleaning',
    description: 'Professional cleaning for commercial properties',
    price: 'Custom quote',
    duration: '4-8 hours'
  },
  {
    id: '3',
    name: 'Driveway & Walkway Cleaning',
    description: 'Remove stains and buildup from concrete surfaces',
    price: 'From $150',
    duration: '1-2 hours'
  },
  {
    id: '4',
    name: 'Deck & Patio Restoration',
    description: 'Restore and protect outdoor living spaces',
    price: 'From $250',
    duration: '2-3 hours'
  },
  {
    id: '5',
    name: 'Roof Cleaning',
    description: 'Remove algae, moss, and debris',
    price: 'From $300',
    duration: '2-4 hours'
  }
];

// Mock Gallery Data
export const mockGallery = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/5726837/pexels-photo-5726837.jpeg',
    category: 'Residential',
    description: 'Complete house wash with dramatic before/after results',
    beforeImage: 'https://images.pexels.com/photos/5726836/pexels-photo-5726836.jpeg',
    afterImage: 'https://images.pexels.com/photos/5726837/pexels-photo-5726837.jpeg'
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/6474343/pexels-photo-6474343.jpeg',
    category: 'Commercial',
    description: 'Multi-story office building cleaning project'
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/5726843/pexels-photo-5726843.jpeg',
    category: 'Driveways',
    description: 'Concrete driveway restoration',
    beforeImage: 'https://images.pexels.com/photos/5726842/pexels-photo-5726842.jpeg',
    afterImage: 'https://images.pexels.com/photos/5726843/pexels-photo-5726843.jpeg'
  },
  {
    id: '4',
    image: 'https://images.pexels.com/photos/5726839/pexels-photo-5726839.jpeg',
    category: 'Decks & Patios',
    description: 'Wooden deck cleaning and sealing'
  },
  {
    id: '5',
    image: 'https://images.pexels.com/photos/5726835/pexels-photo-5726835.jpeg',
    category: 'Roofs',
    description: 'Roof cleaning and moss removal'
  }
];

// Mock Testimonials Data
export const mockTestimonials = [
  {
    id: '1',
    name: 'Jennifer Wilson',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    rating: 5,
    title: 'Incredible Transformation!',
    description: 'The team did an amazing job on our house. It looks brand new! Very professional and thorough service.',
    date: '2024-07-10'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 5,
    title: 'Professional and Efficient',
    description: 'They cleaned our commercial building facade and did an exceptional job. Highly recommend their services.',
    date: '2024-07-08'
  },
  {
    id: '3',
    name: 'Emily Thompson',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    rating: 4,
    title: 'Great Service',
    description: 'Our driveway looks amazing now. The team was punctual and professional throughout the process.',
    date: '2024-07-05'
  },
  {
    id: '4',
    name: 'David Chen',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    rating: 5,
    title: 'Outstanding Results',
    description: 'The deck restoration exceeded our expectations. Will definitely use their services again!',
    date: '2024-07-03'
  }
];