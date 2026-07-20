import type {
  Product, Category, Industry, Testimonial, User,
} from '@/types';

import productsJson from '@/data/products.json';
import categoriesJson from '@/data/categories.json';
import industriesJson from '@/data/industries.json';

export const FALLBACK_PRODUCTS: Product[] = productsJson as Product[];

export const FALLBACK_CATEGORIES: Category[] = (categoriesJson as { fsgCategories?: Category[] }).fsgCategories as Category[];

export const FALLBACK_INDUSTRIES: Industry[] = industriesJson as Industry[];

export const FALLBACK_USERS: User[] = [
  { id: 'dev-mdmajdi', email: 'mdmajdi05@gmail.com', password: 'password', fullName: 'Majdi Dev', company: 'AeroTurbineSpare', phone: '+31611879800', role: 'Dev', country: 'United States', isActive: true, createdAt: '2025-01-01T00:00:00Z' },
  { id: 'dev-001', email: 'dev@aeroturbinespare.com', password: 'Dev@2025!', fullName: 'Dev Engineer', company: 'AeroTurbineSpare', phone: '+31611879800', role: 'Dev', country: 'United States', isActive: true, createdAt: '2025-01-01T00:00:00Z' },
  { id: 'sa-001', email: 'superadmin@aeroturbinespare.com', password: 'SuperAdmin@2025!', fullName: 'Super Administrator', company: 'AeroTurbineSpare', phone: '+31611879800', role: 'SuperAdmin', country: 'United States', isActive: true, createdAt: '2025-01-01T00:00:00Z' },
  { id: 'admin-001', email: 'admin@aeroturbinespare.com', password: 'Admin@2025!', fullName: 'Admin User', company: 'AeroTurbineSpare', phone: '+31611879800', role: 'Admin', country: 'United States', isActive: true, createdAt: '2025-01-02T00:00:00Z' },
  { id: 'trader-001', email: 'trader@aeroturbinespare.com', password: 'Trader@2025', fullName: 'Sarah Mitchell', company: 'AeroTurbineSpare', phone: '+31611879800', role: 'Trader', country: 'United States', isActive: true, createdAt: '2025-03-01T00:00:00Z' },
  { id: 'user-001', email: 'demo@aeroturbinespare.com', password: 'Demo@2025', fullName: 'Demo User', company: 'AeroTurbineSpare (Demo)', phone: '+31611879800', role: 'User', country: 'United States', isActive: true, createdAt: '2025-04-01T00:00:00Z' },
  { id: 'user-002', email: 'john.doe@boeingmro.com', password: 'John@2025', fullName: 'John Doe', company: 'Boeing MRO Services', phone: '+31611879800', role: 'User', country: 'United States', isActive: true, createdAt: '2025-02-15T00:00:00Z' },
  { id: 'user-003', email: 'procurement@airbus-mro.com', password: 'Airbus@2025', fullName: 'Marie Leclerc', company: 'Airbus MRO Division', phone: '+31611879800', role: 'User', country: 'France', isActive: true, createdAt: '2025-03-15T00:00:00Z' },
  { id: 'user-004', email: 'parts@defenselogistics.mil', password: 'Defense@2025', fullName: 'Col. Robert Hayes', company: 'Defense Logistics Agency', phone: '+31611879800', role: 'User', country: 'United States', isActive: false, createdAt: '2025-02-20T00:00:00Z' },
  { id: 'user-005', email: 'seo@aeroturbinespare.com', password: 'seo123', fullName: 'Elena SEO', company: 'AeroTurbineSpare', phone: '+31611879800', role: 'SEOManager', country: 'United States', isActive: true, createdAt: '2025-04-10T00:00:00Z' },
];

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: 'test-001', name: 'James Rodriguez', title: 'Procurement Manager', company: 'Global Aerospace Parts', quote: 'AeroTurbineSpare helped us source hard-to-find NSN parts for our legacy fleet. Their database is comprehensive and the team is incredibly responsive.', rating: 5, country: 'United States', date: '2026-05-15' },
  { id: 'test-002', name: 'Sarah Chen', title: 'Supply Chain Director', company: 'Asia Pacific Aviation', quote: 'We have been using AeroTurbineSpare for over two years now. The platform is intuitive and the part cross-referencing feature saves us hours of research.', rating: 5, country: 'Singapore', date: '2026-04-20' },
  { id: 'test-003', name: 'Michael Schmidt', title: 'Technical Director', company: 'Lufthansa Technik', quote: 'Excellent source for turbine engine components. The quality documentation and traceability they provide is outstanding.', rating: 5, country: 'Germany', date: '2026-03-10' },
  { id: 'test-004', name: 'David Okonkwo', title: 'Operations Manager', company: 'African Airways', quote: 'Fast response times and competitive pricing. They helped us reduce our AOG downtime significantly.', rating: 4, country: 'Nigeria', date: '2026-02-28' },
  { id: 'test-005', name: 'Emily Foster', title: 'VP Supply Chain', company: 'SkyWest Airlines', quote: 'The RFQ system is streamlined and efficient. We get competitive quotes within hours, not days.', rating: 5, country: 'United States', date: '2026-01-15' },
];
