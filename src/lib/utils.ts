import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toString();
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('pt-BR', options).format(new Date(dateString));
}

export function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const past = new Date(dateString).getTime();
  const diff = now - past;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `há ${seconds}s`;
  if (minutes < 60) return `há ${minutes}min`;
  if (hours < 24) return `há ${hours}h`;
  if (days < 7) return `há ${days}d`;
  return formatDate(dateString, { day: '2-digit', month: 'short' });
}

export function formatResponseTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.8) return 'Excepcional';
  if (rating >= 4.5) return 'Excelente';
  if (rating >= 4.0) return 'Muito bom';
  if (rating >= 3.5) return 'Bom';
  return 'Regular';
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: 'success',
    INACTIVE: 'muted',
    SUSPENDED: 'error',
    PENDING: 'warning',
    VERIFIED: 'success',
    UNVERIFIED: 'muted',
    AVAILABLE: 'success',
    BUSY: 'warning',
    UNAVAILABLE: 'error',
    COMPLETED: 'success',
    CANCELLED: 'error',
    OPEN: 'info',
    MATCHED: 'primary',
    IN_PROGRESS: 'warning',
  };
  return map[status] ?? 'muted';
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    SUSPENDED: 'Suspenso',
    PENDING: 'Pendente',
    VERIFIED: 'Verificado',
    UNVERIFIED: 'Não verificado',
    AVAILABLE: 'Disponível',
    BUSY: 'Ocupado',
    UNAVAILABLE: 'Indisponível',
    VACATION: 'Em férias',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
    OPEN: 'Aberto',
    MATCHED: 'Combinado',
    IN_PROGRESS: 'Em andamento',
    DRAFT: 'Rascunho',
    CLIENT: 'Cliente',
    PROFESSIONAL: 'Profissional',
    ADMIN: 'Admin',
    SUPER_ADMIN: 'Super Admin',
  };
  return map[status] ?? status;
}
