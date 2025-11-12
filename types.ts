export interface Lead {
  id: string;
  generatedDate: string;
  searchCity: string;
  searchCountry: string;
  searchDistrict: string;
  leadNumber: number;
  companyName: string;
  category: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  linkedin: string | null;
  facebook: string | null;
  instagram: string | null;
  rating: number;
  reviewCount: number;
  businessHours: string;
  qualityScore: number;
  qualityReasoning: string;
  status?: 'New' | 'Contacted' | 'Interested' | 'Not Interested';
  notes?: string;
  googleMapsUri: string | null;
}

export type UserPlan = 'free' | 'pro' | 'business';

export interface User {
  id: string;
  email: string;
  plan: UserPlan;
  credits: number;
  lastCreditReset: string; // ISO string date
}


export enum FilterType {
  ALL = 'All',
  HIGH_SCORE = 'High Score',
  EMAIL_EXISTS = 'Email Exists',
  CONTACTED = 'Contacted'
}

export enum QualityScoreFilterType {
    ANY = 'Any',
    HIGH = 'High (60+)',
    MEDIUM = 'Medium (40-59)',
    LOW = 'Low (<40)',
}