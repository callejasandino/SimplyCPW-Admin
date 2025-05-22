export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  category: 'Residential' | 'Commercial' | 'Driveways' | 'Decks & Patios' | 'Roofs' | 'Other';
  description?: string;
  beforeImage?: string;
  afterImage?: string;
}

export interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface ChartData {
  month: string;
  revenue: number;
  jobs: number;
}

export interface NavItem {
  title: string;
  path: string;
  icon: string;
}