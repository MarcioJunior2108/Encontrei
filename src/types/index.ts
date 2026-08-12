// ============================================================
// ENCONTREI — Type Definitions
// Central type registry for the entire platform
// ============================================================

// --- User Types ---
export type UserRole = 'CLIENT' | 'PROFESSIONAL' | 'ADMIN' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  location?: Location;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
}

export interface Profile extends User {
  bio?: string;
  website?: string;
  social?: {
    instagram?: string;
    linkedin?: string;
  };
  preferences?: UserPreferences;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

// --- Location Types ---
export interface Location {
  city: string;
  state: string;
  country: string;
  lat?: number;
  lng?: number;
  zipCode?: string;
  address?: string;
  neighborhood?: string;
}

// --- Professional Types ---
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | 'VACATION';

export interface Professional {
  id: string;
  userId: string;
  user: User;
  headline: string;
  bio: string;
  categories: ServiceCategory[];
  services: ProfessionalService[];
  location: Location;
  priceRange: PriceRange;
  availability: AvailabilityStatus;
  availableToday: boolean;
  availableTomorrow: boolean;
  verificationStatus: VerificationStatus;
  reputation: ReputationScore;
  portfolio?: PortfolioItem[];
  responseTimeMinutes: number;
  completionRate: number;
  cancellationRate: number;
  createdAt: string;
  updatedAt: string;
  distance?: number; // km, calculated at runtime
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
  unit: 'hour' | 'service' | 'day' | 'project';
}

export interface ProfessionalService {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price?: number;
  priceRange?: PriceRange;
  duration?: number; // minutes
  active: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

// --- Category Types ---
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  color?: string;
  parentId?: string;
  children?: ServiceCategory[];
  professionalCount?: number;
}

// --- Reputation Types ---
export interface ReputationScore {
  rating: number;        // 0-5
  reviewCount: number;
  completedServices: number;
  satisfactionRate: number; // percentage
  completionRate: number;   // percentage
  cancellationRate: number; // percentage
  responseTimeMinutes: number;
  badges?: ReputationBadge[];
  trend?: 'up' | 'down' | 'stable';
}

export interface ReputationBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface Review {
  id: string;
  authorId: string;
  author: User;
  professionalId: string;
  requestId: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: string;
}

// --- Intent & Request Types ---
export type IntentType = 
  | 'HIRE_SERVICE'
  | 'BUY_PRODUCT'
  | 'SELL_PRODUCT'
  | 'RENT'
  | 'FIND_INFORMATION'
  | 'UNKNOWN';

export interface Intent {
  id: string;
  rawText: string;
  type: IntentType;
  confidence: number;
  entities: IntentEntity[];
  suggestedCategories: ServiceCategory[];
  processedAt: string;
}

export interface IntentEntity {
  type: 'SERVICE' | 'LOCATION' | 'TIME' | 'PRICE' | 'OBJECT';
  value: string;
  confidence: number;
}

export type RequestStatus = 
  | 'DRAFT'
  | 'OPEN'
  | 'MATCHED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface ServiceRequest {
  id: string;
  userId: string;
  user: User;
  intent: Intent;
  title: string;
  description: string;
  category: ServiceCategory;
  location: Location;
  status: RequestStatus;
  budget?: PriceRange;
  scheduledAt?: string;
  urgency: 'IMMEDIATE' | 'TODAY' | 'TOMORROW' | 'THIS_WEEK' | 'FLEXIBLE';
  matches?: RequestMatch[];
  acceptedMatch?: RequestMatch;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface RequestMatch {
  id: string;
  requestId: string;
  professionalId: string;
  professional: Professional;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  proposedPrice?: number;
  message?: string;
  createdAt: string;
}

// --- Transaction Types ---
export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER';

export interface Transaction {
  id: string;
  requestId: string;
  userId: string;
  professionalId: string;
  amount: number;
  platformFee: number;
  professionalAmount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  completedAt?: string;
}

// --- Notification Types ---
export type NotificationType = 
  | 'REQUEST_CREATED'
  | 'REQUEST_MATCHED'
  | 'REQUEST_ACCEPTED'
  | 'REQUEST_COMPLETED'
  | 'PAYMENT_RECEIVED'
  | 'REVIEW_RECEIVED'
  | 'MESSAGE_RECEIVED'
  | 'SYSTEM'
  | 'MARKETING';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

// --- Admin Types ---
export type AdminRole = 'VIEWER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  lastLoginAt?: string;
  createdAt: string;
}

export type ModerationStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface Report {
  id: string;
  reporterId: string;
  reporter: User;
  targetType: 'USER' | 'PROFESSIONAL' | 'REVIEW' | 'REQUEST';
  targetId: string;
  reason: string;
  description?: string;
  status: ModerationStatus;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type AuditAction = 
  | 'ADMIN_LOGIN'
  | 'USER_SUSPENDED'
  | 'USER_REACTIVATED'
  | 'PROFESSIONAL_VERIFIED'
  | 'PROFESSIONAL_REJECTED'
  | 'CONTENT_REMOVED'
  | 'SETTING_CHANGED'
  | 'REPORT_RESOLVED'
  | 'EXPORT_DATA';

export interface AuditLog {
  id: string;
  adminId: string;
  admin: AdminUser;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  createdAt: string;
}

// --- Analytics Types ---
export interface PlatformMetrics {
  activeUsers: number;
  activeUsersChange: number;
  registeredUsers: number;
  newUsersToday: number;
  professionals: number;
  requests: number;
  requestsCompleted: number;
  gmv: number;
  gmvChange: number;
  revenue: number;
  revenueChange: number;
  conversionRate: number;
  retentionRate: number;
  avgResponseTime: number;
  errorRate: number;
}

export interface RealtimeEvent {
  id: string;
  type: RealtimeEventType;
  title: string;
  description: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export type RealtimeEventType = 
  | 'USER_REGISTERED'
  | 'USER_ONLINE'
  | 'REQUEST_CREATED'
  | 'REQUEST_ACCEPTED'
  | 'REQUEST_COMPLETED'
  | 'TRANSACTION_CREATED'
  | 'PAYMENT_COMPLETED'
  | 'REVIEW_CREATED'
  | 'PROFESSIONAL_REGISTERED'
  | 'REPORT_CREATED'
  | 'SYSTEM_ERROR';

// --- API Types ---
export interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  query?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  availableToday?: boolean;
  verified?: boolean;
}
