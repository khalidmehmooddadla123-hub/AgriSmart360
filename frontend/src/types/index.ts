export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  city?: string;
  province?: string;
  country?: string;
  farmSize?: string;
  cropsGrown?: string[];
  languagePreference?: string;
  notificationPreferences?: NotificationPreferences;
  avatar_url?: string;
  created_at?: string;
}

export type UserRole = 'farmer' | 'urban_farmer' | 'buyer' | 'agriculture_expert' | 'admin';

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  dashboard: boolean;
  priceAlerts: boolean;
  weatherWarnings: boolean;
  diseaseAlerts: boolean;
  govtAnnouncements: boolean;
}

export interface CropPrice {
  id: string;
  name: string;
  nameUrdu: string;
  price: number;
  unit: string;
  change: number;
  changePercent: number;
  market: string;
  location: string;
  updatedAt: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  description: string;
  icon: string;
  sprayRecommendation?: string;
}

export interface MarketplaceListing {
  id: string;
  userId: string;
  title: string;
  titleUrdu?: string;
  category: 'crop' | 'fruit' | 'vegetable' | 'seed' | 'equipment' | 'land';
  description: string;
  price: number;
  quantity: number;
  unit: string;
  qualityGrade?: 'A' | 'B' | 'C';
  location: string;
  images: string[];
  contactPhone?: string;
  contactEmail?: string;
  createdAt: string;
  status: 'active' | 'sold' | 'inactive';
}

export interface DiseaseDetectionResult {
  diseaseName: string;
  diseaseNameUrdu: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  treatment: string;
  treatmentUrdu: string;
  imageUrl?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  titleUrdu?: string;
  summary: string;
  summaryUrdu?: string;
  source: string;
  category: 'policy' | 'subsidy' | 'scheme' | 'water' | 'general';
  publishedAt: string;
  url?: string;
  imageUrl?: string;
}

export interface LandAd {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'land' | 'equipment' | 'greenhouse';
  area?: number;
  areaUnit?: 'acre' | 'kanal' | 'marla';
  price: number;
  location: string;
  province: string;
  images: string[];
  contactPhone: string;
  contactEmail?: string;
  createdAt: string;
  status: 'active' | 'sold';
}

export interface Complaint {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: 'pending' | 'in_review' | 'resolved' | 'closed';
  category: 'price' | 'weather' | 'app' | 'marketplace' | 'other';
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
}

export interface HistoryItem {
  id: string;
  userId: string;
  type: 'price_search' | 'disease_detection' | 'chat_query' | 'order' | 'weather_check';
  data: Record<string, unknown>;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'price' | 'weather' | 'disease' | 'govt' | 'order' | 'general';
  read: boolean;
  createdAt: string;
}
