// ============================================================
// ENCONTREI — Mock Data
// Realistic Brazilian dataset for development/demo
// Status: MOCK — Not production data
// ============================================================

import type {
  User,
  Professional,
  ServiceCategory,
  ServiceRequest,
  Review,
  Transaction,
  AuditLog,
  Report,
  PlatformMetrics,
  RealtimeEvent,
  RealtimeEventType,
} from '@/types';

function pseudoRandom(seed?: number) {
  const s = seed !== undefined ? seed : Date.now();
  const x = Math.sin(s + 1) * 10000;
  return x - Math.floor(x);
}

// --- Categories ---
export const MOCK_CATEGORIES: ServiceCategory[] = [
  { id: 'cat-1', name: 'Elétrica', slug: 'eletrica', icon: 'Zap', color: '#F59E0B', professionalCount: 248 },
  { id: 'cat-2', name: 'Encanamento', slug: 'encanamento', icon: 'Droplets', color: '#3B82F6', professionalCount: 189 },
  { id: 'cat-3', name: 'Limpeza', slug: 'limpeza', icon: 'Sparkles', color: '#10B981', professionalCount: 412 },
  { id: 'cat-4', name: 'Pintura', slug: 'pintura', icon: 'Paintbrush', color: '#8B5CF6', professionalCount: 156 },
  { id: 'cat-5', name: 'Mudança', slug: 'mudanca', icon: 'Truck', color: '#F97316', professionalCount: 94 },
  { id: 'cat-6', name: 'Informática', slug: 'informatica', icon: 'Monitor', color: '#6366F1', professionalCount: 321 },
  { id: 'cat-7', name: 'Jardinagem', slug: 'jardinagem', icon: 'Leaf', color: '#22C55E', professionalCount: 87 },
  { id: 'cat-8', name: 'Reforma', slug: 'reforma', icon: 'Hammer', color: '#EF4444', professionalCount: 203 },
  { id: 'cat-9', name: 'Ar Condicionado', slug: 'ar-condicionado', icon: 'Wind', color: '#06B6D4', professionalCount: 142 },
  { id: 'cat-10', name: 'Segurança', slug: 'seguranca', icon: 'Shield', color: '#475569', professionalCount: 78 },
  { id: 'cat-11', name: 'Design', slug: 'design', icon: 'Palette', color: '#EC4899', professionalCount: 267 },
  { id: 'cat-12', name: 'Fotografia', slug: 'fotografia', icon: 'Camera', color: '#7C3AED', professionalCount: 198 },
  { id: 'cat-13', name: 'Aulas', slug: 'aulas', icon: 'GraduationCap', color: '#0EA5E9', professionalCount: 445 },
  { id: 'cat-14', name: 'Saúde', slug: 'saude', icon: 'HeartPulse', color: '#F43F5E', professionalCount: 312 },
  { id: 'cat-15', name: 'Advocacia', slug: 'advocacia', icon: 'Scale', color: '#1D4ED8', professionalCount: 134 },
  { id: 'cat-16', name: 'Contabilidade', slug: 'contabilidade', icon: 'Calculator', color: '#065F46', professionalCount: 167 },
  { id: 'cat-17', name: 'Pet', slug: 'pet', icon: 'PawPrint', color: '#D97706', professionalCount: 223 },
  { id: 'cat-18', name: 'Entregas', slug: 'entregas', icon: 'Package', color: '#7C2D12', professionalCount: 356 },
  { id: 'cat-19', name: 'Música', slug: 'musica', icon: 'Music', color: '#BE185D', professionalCount: 143 },
  { id: 'cat-20', name: 'Eventos', slug: 'eventos', icon: 'PartyPopper', color: '#7C3AED', professionalCount: 189 },
];

// --- Mock Users ---
const brazilianNames = [
  'João Silva', 'Maria Santos', 'Carlos Oliveira', 'Ana Rodrigues', 'Pedro Costa',
  'Juliana Ferreira', 'Lucas Almeida', 'Fernanda Pereira', 'Rafael Souza', 'Camila Lima',
  'Marcos Ribeiro', 'Letícia Carvalho', 'Gabriel Martins', 'Beatriz Gomes', 'Rodrigo Barbosa',
  'Isabela Nascimento', 'Eduardo Araújo', 'Thais Cardoso', 'Felipe Mendes', 'Amanda Teixeira',
  'Bruno Correia', 'Natalia Moura', 'Diego Monteiro', 'Larissa Castro', 'Vinicius Ramos',
  'Priscila Dias', 'Matheus Lopes', 'Carolina Vieira', 'Gustavo Pinto', 'Aline Melo',
  'Ricardo Nunes', 'Renata Cavalcanti', 'Henrique Freitas', 'Daniela Siqueira', 'André Borges',
  'Patrícia Neto', 'Fabio Azevedo', 'Cristiane Rocha', 'Alexandre Cunha', 'Vanessa Bastos',
  'Marcelo Simões', 'Luciana Monteiro', 'Roberto Andrade', 'Sabrina Tavares', 'Leandro Macedo',
  'Tatiane Leal', 'Thiago Drummond', 'Sônia Braga', 'Flávio Cardoso', 'Helena Cruz',
];

const cities = [
  { city: 'São Paulo', state: 'SP', country: 'Brasil' },
  { city: 'Rio de Janeiro', state: 'RJ', country: 'Brasil' },
  { city: 'Belo Horizonte', state: 'MG', country: 'Brasil' },
  { city: 'Curitiba', state: 'PR', country: 'Brasil' },
  { city: 'Recife', state: 'PE', country: 'Brasil' },
  { city: 'Fortaleza', state: 'CE', country: 'Brasil' },
  { city: 'Salvador', state: 'BA', country: 'Brasil' },
  { city: 'Manaus', state: 'AM', country: 'Brasil' },
  { city: 'Porto Alegre', state: 'RS', country: 'Brasil' },
  { city: 'Campinas', state: 'SP', country: 'Brasil' },
];

function generateAvatar(seed: string): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

export const MOCK_USERS: User[] = Array.from({ length: 150 }).map((_, i) => {
  const name = brazilianNames[i % brazilianNames.length] + (i >= brazilianNames.length ? ` ${Math.floor(i / brazilianNames.length)}` : '');
  return {
    id: `user-${i + 1}`,
    email: `${name.toLowerCase().replace(/\s+/g, '.').replace(/[áàâã]/g, 'a').replace(/[éê]/g, 'e').replace(/[í]/g, 'i').replace(/[óô]/g, 'o').replace(/[ú]/g, 'u').replace(/[ç]/g, 'c')}@email.com`,
    name,
    avatar: generateAvatar(name),
    role: i < 50 ? 'CLIENT' : i < 110 ? 'PROFESSIONAL' : 'CLIENT',
    status: i % 15 === 0 ? 'INACTIVE' : i % 30 === 0 ? 'SUSPENDED' : 'ACTIVE',
    phone: `+55 (${['11', '21', '31', '41', '51', '61', '71', '81', '85', '91'][i % 10]}) 9${String(Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 900000000 + 100000000))}`,
    location: cities[i % cities.length],
    createdAt: new Date(Date.now() - pseudoRandom(typeof i !== "undefined" ? i : undefined) * 365 * 24 * 60 * 60 * 1000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - pseudoRandom(typeof i !== "undefined" ? i : undefined) * 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastActiveAt: new Date(Date.now() - pseudoRandom(typeof i !== "undefined" ? i : undefined) * 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
});

// --- Mock Professionals (subset of users) ---
const professionalHeadlines = [
  'Eletricista certificado com 10 anos de experiência',
  'Especialista em instalações residenciais e comerciais',
  'Encanador profissional — atendimento rápido',
  'Faxineira experiente, produtos de qualidade inclusos',
  'Pintor profissional, acabamento impecável',
  'Técnico em informática certificado',
  'Jardineiro paisagista com formação profissional',
  'Mestre em obras e reformas completas',
  'Especialista em ar condicionado e refrigeração',
  'Designer gráfico e visual com portfólio premiado',
];

export const MOCK_PROFESSIONALS: Professional[] = MOCK_USERS.filter(u => u.role === 'PROFESSIONAL').map((user, i) => ({
  id: `pro-${i + 1}`,
  userId: user.id,
  user,
  headline: professionalHeadlines[i % professionalHeadlines.length],
  bio: `Profissional dedicado com mais de ${5 + (i % 15)} anos de experiência. Comprometido com qualidade e pontualidade. Atendo toda a região metropolitana.`,
  categories: [MOCK_CATEGORIES[i % MOCK_CATEGORIES.length], MOCK_CATEGORIES[(i + 3) % MOCK_CATEGORIES.length]],
  services: [
    {
      id: `svc-${i}-1`,
      name: MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].name,
      description: `Serviço profissional de ${MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].name.toLowerCase()}`,
      category: MOCK_CATEGORIES[i % MOCK_CATEGORIES.length],
      priceRange: { min: 80 + i * 10, max: 200 + i * 20, currency: 'BRL', unit: 'service' },
      duration: 120,
      active: true,
    },
  ],
  location: { ...cities[i % cities.length], country: 'Brasil', neighborhood: 'Centro' },
  priceRange: { min: 80 + i * 5, max: 200 + i * 15, currency: 'BRL', unit: 'service' },
  availability: i % 5 === 0 ? 'BUSY' : i % 12 === 0 ? 'UNAVAILABLE' : 'AVAILABLE',
  availableToday: i % 4 !== 0,
  availableTomorrow: i % 6 !== 0,
  verificationStatus: i % 8 === 0 ? 'PENDING' : i % 15 === 0 ? 'UNVERIFIED' : 'VERIFIED',
  reputation: {
    rating: Math.round((3.5 + pseudoRandom(typeof i !== "undefined" ? i : undefined) * 1.5) * 10) / 10,
    reviewCount: 10 + Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 370),
    completedServices: 15 + Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 500),
    satisfactionRate: 85 + Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 15),
    completionRate: 88 + Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 12),
    cancellationRate: Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 8),
    responseTimeMinutes: 5 + Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 55),
    trend: ['up', 'down', 'stable'][i % 3] as 'up' | 'down' | 'stable',
  },
  responseTimeMinutes: 5 + Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 55),
  completionRate: 88 + Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 12),
  cancellationRate: Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 8),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  distance: Math.round(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 25 * 10) / 10,
}));

// --- Mock Service Requests ---
const requestTitles = [
  'Preciso de eletricista para instalar tomadas',
  'Quero pintar sala e quartos',
  'Encanador urgente — cano estourado',
  'Faxina completa no apartamento',
  'Configurar rede Wi-Fi em casa',
  'Jardim precisa de poda geral',
  'Instalar ar condicionado novo',
  'Reforma no banheiro',
  'Aula de violão para iniciante',
  'Fotografia para evento de empresa',
];

export const MOCK_REQUESTS: ServiceRequest[] = Array.from({ length: 200 }, (_, i) => ({
  id: `req-${i + 1}`,
  userId: MOCK_USERS[i % 50].id,
  user: MOCK_USERS[i % 50],
  intent: {
    id: `intent-${i + 1}`,
    rawText: requestTitles[i % requestTitles.length],
    type: 'HIRE_SERVICE',
    confidence: 0.85 + pseudoRandom(typeof i !== "undefined" ? i : undefined) * 0.14,
    entities: [{ type: 'SERVICE', value: MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].name, confidence: 0.92 }],
    suggestedCategories: [MOCK_CATEGORIES[i % MOCK_CATEGORIES.length]],
    processedAt: new Date(Date.now() - pseudoRandom(typeof i !== "undefined" ? i : undefined) * 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  title: requestTitles[i % requestTitles.length],
  description: `Preciso de profissional para ${requestTitles[i % requestTitles.length].toLowerCase()}. Urgente, disponível para atendimento nos próximos dias.`,
  category: MOCK_CATEGORIES[i % MOCK_CATEGORIES.length],
  location: cities[i % cities.length],
  status: ['OPEN', 'MATCHED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'][i % 6] as ServiceRequest['status'],
  urgency: ['IMMEDIATE', 'TODAY', 'TOMORROW', 'THIS_WEEK', 'FLEXIBLE'][i % 5] as ServiceRequest['urgency'],
  createdAt: new Date(Date.now() - pseudoRandom(typeof i !== "undefined" ? i : undefined) * 60 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - pseudoRandom(typeof i !== "undefined" ? i : undefined) * 10 * 24 * 60 * 60 * 1000).toISOString(),
}));

// --- Mock Transactions ---
export const MOCK_TRANSACTIONS: Transaction[] = MOCK_REQUESTS
  .filter(r => r.status === 'COMPLETED')
  .map((req, i) => ({
    id: `txn-${i + 1}`,
    requestId: req.id,
    userId: req.userId,
    professionalId: MOCK_PROFESSIONALS[i % MOCK_PROFESSIONALS.length].id,
    amount: 150 + Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 500),
    platformFee: 15 + Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 50),
    professionalAmount: 120 + Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 450),
    currency: 'BRL',
    status: 'COMPLETED' as Transaction['status'],
    paymentMethod: ['PIX', 'CREDIT_CARD', 'DEBIT_CARD'][i % 3] as Transaction['paymentMethod'],
    createdAt: req.createdAt,
    completedAt: req.updatedAt,
  }));

// --- Mock Reviews ---
const reviewComments = [
  'Excelente profissional! Trabalho feito com qualidade e no prazo.',
  'Muito atencioso e caprichoso. Recomendo a todos.',
  'Ótimo serviço, preço justo. Voltaria a contratar.',
  'Profissional pontual e educado. Trabalho impecável.',
  'Super recomendo! Resolveu o problema rapidinho.',
  'Trabalho de qualidade, profissional muito competente.',
  'Atendimento rápido e eficiente. Estou satisfeito.',
  'Boa experiência. Profissional responsável e organizado.',
];

export const MOCK_REVIEWS: Review[] = Array.from({ length: 150 }, (_, i) => ({
  id: `rev-${i + 1}`,
  authorId: MOCK_USERS[i % 50].id,
  author: MOCK_USERS[i % 50],
  professionalId: MOCK_PROFESSIONALS[i % MOCK_PROFESSIONALS.length].id,
  requestId: MOCK_REQUESTS[i % MOCK_REQUESTS.length].id,
  rating: Math.round((3.5 + pseudoRandom(typeof i !== "undefined" ? i : undefined) * 1.5) * 2) / 2,
  comment: reviewComments[i % reviewComments.length],
  helpful: Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 30),
  createdAt: new Date(Date.now() - pseudoRandom(typeof i !== "undefined" ? i : undefined) * 90 * 24 * 60 * 60 * 1000).toISOString(),
}));

// --- Platform Metrics (mock real-time data) ---
export const MOCK_METRICS: PlatformMetrics = {
  activeUsers: 12482,
  activeUsersChange: 12.4,
  registeredUsers: 48920,
  newUsersToday: 284,
  professionals: 3847,
  requests: 89342,
  requestsCompleted: 71623,
  gmv: 4823000,
  gmvChange: 15.1,
  revenue: 96460,
  revenueChange: 12.8,
  conversionRate: 68.4,
  retentionRate: 71.2,
  avgResponseTime: 18,
  errorRate: 0.12,
};

// --- Realtime Events Generator ---
const eventTemplates: Array<{ type: RealtimeEventType; title: string; description: (name: string) => string }> = [
  { type: 'USER_REGISTERED', title: 'Novo usuário registrado', description: (n) => `${n} criou uma conta na plataforma` },
  { type: 'USER_ONLINE', title: 'Usuário online', description: (n) => `${n} entrou na plataforma` },
  { type: 'REQUEST_CREATED', title: 'Nova solicitação', description: (n) => `${n} criou uma nova solicitação` },
  { type: 'REQUEST_COMPLETED', title: 'Serviço concluído', description: (n) => `${n} concluiu um serviço` },
  { type: 'TRANSACTION_CREATED', title: 'Nova transação', description: (n) => `${n} iniciou um pagamento` },
  { type: 'PAYMENT_COMPLETED', title: 'Pagamento confirmado', description: (n) => `Pagamento de ${n} confirmado` },
  { type: 'REVIEW_CREATED', title: 'Nova avaliação', description: (n) => `${n} avaliou um profissional` },
  { type: 'PROFESSIONAL_REGISTERED', title: 'Novo profissional', description: (n) => `${n} se cadastrou como profissional` },
  { type: 'REPORT_CREATED', title: 'Nova denúncia', description: (n) => `${n} reportou um problema` },
];

export function generateRealtimeEvent(): RealtimeEvent {
  const template = eventTemplates[Math.floor(pseudoRandom() * eventTemplates.length)];
  const user = MOCK_USERS[Math.floor(pseudoRandom() * 30)];
  return {
    id: `evt-${Date.now()}-${pseudoRandom().toString(36).slice(2)}`,
    type: template.type,
    title: template.title,
    description: template.description(user.name.split(' ')[0]),
    timestamp: new Date().toISOString(),
    data: { userId: user.id },
  };
}

// --- Mock Audit Logs ---
export const MOCK_AUDIT_LOGS: AuditLog[] = Array.from({ length: 50 }, (_, i) => ({
  id: `log-${i + 1}`,
  adminId: 'admin-1',
  admin: { id: 'admin-1', email: 'admin@encontrei.app', name: 'Admin Principal', role: 'SUPER_ADMIN', createdAt: '2024-01-01T00:00:00Z' },
  action: ['ADMIN_LOGIN', 'USER_SUSPENDED', 'PROFESSIONAL_VERIFIED', 'CONTENT_REMOVED', 'SETTING_CHANGED'][i % 5] as AuditLog['action'],
  resource: ['user', 'professional', 'content', 'setting', 'report'][i % 5],
  resourceId: `${['user', 'pro', 'req', 'rep', 'set'][i % 5]}-${Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 100)}`,
  ip: `189.${Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 255)}.${Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 255)}.${Math.floor(pseudoRandom(typeof i !== "undefined" ? i : undefined) * 255)}`,
  createdAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString(),
}));

// --- Mock Reports ---
export const MOCK_REPORTS: Report[] = Array.from({ length: 30 }, (_, i) => ({
  id: `rpt-${i + 1}`,
  reporterId: MOCK_USERS[i % 30].id,
  reporter: MOCK_USERS[i % 30],
  targetType: ['USER', 'PROFESSIONAL', 'REVIEW', 'REQUEST'][i % 4] as Report['targetType'],
  targetId: `target-${i}`,
  reason: ['Comportamento inapropriado', 'Serviço não realizado', 'Golpe/Fraude', 'Conteúdo ofensivo'][i % 4],
  status: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'][i % 4] as Report['status'],
  createdAt: new Date(Date.now() - pseudoRandom(typeof i !== "undefined" ? i : undefined) * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - pseudoRandom(typeof i !== "undefined" ? i : undefined) * 7 * 24 * 60 * 60 * 1000).toISOString(),
}));

// --- Intent examples for the home page ---
export const INTENT_EXAMPLES = [
  'Preciso de um eletricista hoje...',
  'Quero comprar um notebook para programação...',
  'Alguém para instalar minha TV...',
  'Preciso de uma faxineira semanal...',
  'Quero vender meu celular usado...',
  'Busco professor de inglês online...',
  'Encanador urgente, cano quebrado...',
  'Pintor para sala e dois quartos...',
  'Designer para criar meu logotipo...',
  'Fotógrafo para casamento em dezembro...',
];
