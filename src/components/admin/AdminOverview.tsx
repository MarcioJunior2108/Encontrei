'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserCheck, FileText, TrendingUp, TrendingDown,
  DollarSign, Activity, AlertCircle, Zap, ArrowUpRight,
  Eye, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
  MOCK_METRICS, MOCK_USERS, MOCK_PROFESSIONALS,
  MOCK_REQUESTS, generateRealtimeEvent, MOCK_AUDIT_LOGS
} from '@/mock/data';
import { formatCurrency, formatNumber, formatRelativeTime, getStatusLabel } from '@/lib/utils';
import type { RealtimeEvent, ServiceRequest } from '@/types';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

// --- Metric Card ---
interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ElementType;
  color: string;
  suffix?: string;
}

function MetricCard({ title, value, change, icon: Icon, color, suffix }: MetricCardProps) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
            {title}
          </p>
          <div
            className="h-8 w-8 rounded-[var(--radius-lg)] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}14` }}
          >
            <Icon className="h-4 w-4" style={{ color }} aria-hidden="true" />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-black text-[hsl(var(--foreground))] tracking-tight">
            {value}
          </p>
          {suffix && <span className="text-sm text-[hsl(var(--muted-foreground))] mb-0.5">{suffix}</span>}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${isPositive ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--error))]'}`}>
            {isPositive ? <TrendingUp className="h-3 w-3" aria-hidden="true" /> : <TrendingDown className="h-3 w-3" aria-hidden="true" />}
            {Math.abs(change).toFixed(1)}% vs. mês anterior
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Chart data generator ---
function generateChartData(days = 14) {
  const data = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      users: Math.floor(200 + Math.random() * 300),
      requests: Math.floor(150 + Math.random() * 250),
      revenue: Math.floor(3000 + Math.random() * 5000),
    });
  }
  return data;
}

// --- Live Activity Feed ---
function LiveActivityFeed() {
  const [events, setEvents] = useState<RealtimeEvent[]>(() =>
    Array.from({ length: 8 }, () => {
      const evt = generateRealtimeEvent();
      // Spread timestamps over last 5 minutes
      const offset = Math.floor(Math.random() * 300000);
      evt.timestamp = new Date(Date.now() - offset).toISOString();
      return evt;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  );

  // Simulate realtime events
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => {
        const newEvt = generateRealtimeEvent();
        return [newEvt, ...prev].slice(0, 20);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const eventTypeColors: Record<string, string> = {
    USER_REGISTERED: 'bg-[hsl(var(--success))]',
    USER_ONLINE: 'bg-[hsl(var(--info))]',
    REQUEST_CREATED: 'bg-[hsl(var(--primary))]',
    REQUEST_COMPLETED: 'bg-[hsl(var(--success))]',
    TRANSACTION_CREATED: 'bg-[hsl(var(--warning))]',
    PAYMENT_COMPLETED: 'bg-[hsl(var(--success))]',
    REVIEW_CREATED: 'bg-amber-400',
    PROFESSIONAL_REGISTERED: 'bg-purple-500',
    REPORT_CREATED: 'bg-[hsl(var(--error))]',
    SYSTEM_ERROR: 'bg-[hsl(var(--error))]',
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--success))] live-dot" aria-hidden="true" />
            Atividade em Tempo Real
            <Badge variant="success" className="text-[10px]">AO VIVO</Badge>
          </CardTitle>
          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">demo · mock</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0 max-h-80 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="popLayout">
            {events.map(evt => (
              <motion.div
                key={evt.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 px-4 py-3 border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.5)] transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <span
                    className={`h-2 w-2 rounded-full block ${eventTypeColors[evt.type] ?? 'bg-[hsl(var(--muted-foreground))]'}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[hsl(var(--foreground))] truncate">
                    {evt.description}
                  </p>
                  <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">
                    {formatRelativeTime(evt.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Recent requests table ---
function RecentRequests() {
  const recent: ServiceRequest[] = MOCK_REQUESTS.slice(0, 8);

  const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary'> = {
    COMPLETED: 'success',
    IN_PROGRESS: 'warning',
    CANCELLED: 'error',
    OPEN: 'info',
    MATCHED: 'primary',
    ACCEPTED: 'primary',
    DRAFT: 'secondary',
    DISPUTED: 'error',
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Solicitações Recentes</CardTitle>
          <a
            href="/admin/solicitacoes"
            className="h-8 w-8 flex items-center justify-center rounded-[var(--radius-lg)] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-all"
            aria-label="Ver todas as solicitações"
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Solicitações recentes">
            <thead>
              <tr className="border-b border-[hsl(var(--border))]">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  Usuário
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider hidden sm:table-cell">
                  Serviço
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider hidden lg:table-cell">
                  Data
                </th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {recent.map(req => (
                <tr
                  key={req.id}
                  className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.4)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={req.user.avatar} name={req.user.name} size="sm" />
                      <span className="font-medium text-[hsl(var(--foreground))] truncate max-w-[100px]">
                        {req.user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))] hidden sm:table-cell truncate max-w-[140px]">
                    {req.category.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusColors[req.status] ?? 'secondary'} className="text-[10px]">
                      {getStatusLabel(req.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))] hidden lg:table-cell">
                    {formatRelativeTime(req.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="h-7 w-7 rounded flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                      aria-label={`Ver detalhes de ${req.user.name}`}
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Overview ---
export function AdminOverview() {
  const [chartData] = useState(() => generateChartData(14));
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setRefreshing(false);
  }, []);

  const metrics = [
    {
      title: 'Usuários Ativos',
      value: formatNumber(MOCK_METRICS.activeUsers),
      change: MOCK_METRICS.activeUsersChange,
      icon: Users,
      color: '#6366F1',
    },
    {
      title: 'Profissionais',
      value: formatNumber(MOCK_METRICS.professionals),
      icon: UserCheck,
      color: '#10B981',
    },
    {
      title: 'Solicitações',
      value: formatNumber(MOCK_METRICS.requests),
      icon: FileText,
      color: '#F59E0B',
    },
    {
      title: 'GMV',
      value: formatCurrency(MOCK_METRICS.gmv),
      change: MOCK_METRICS.gmvChange,
      icon: DollarSign,
      color: '#8B5CF6',
    },
    {
      title: 'Receita',
      value: formatCurrency(MOCK_METRICS.revenue),
      change: MOCK_METRICS.revenueChange,
      icon: Activity,
      color: '#EC4899',
    },
    {
      title: 'Conversão',
      value: `${MOCK_METRICS.conversionRate.toFixed(1)}`,
      suffix: '%',
      icon: TrendingUp,
      color: '#06B6D4',
    },
    {
      title: 'Novos hoje',
      value: formatNumber(MOCK_METRICS.newUsersToday),
      icon: Zap,
      color: '#F97316',
    },
    {
      title: 'Taxa de erro',
      value: `${MOCK_METRICS.errorRate.toFixed(2)}`,
      suffix: '%',
      icon: AlertCircle,
      color: MOCK_METRICS.errorRate < 1 ? '#10B981' : '#EF4444',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">
            Visão Geral
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
            Métricas em tempo real da plataforma
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          loading={refreshing}
          id="refresh-metrics-btn"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Atualizar
        </Button>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <MetricCard {...m} />
          </motion.div>
        ))}
      </div>

      {/* Charts + Live feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Crescimento — Últimos 14 dias</CardTitle>
                <span className="text-[10px] text-[hsl(var(--muted-foreground))]">demo · mock</span>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="requestsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: 'hsl(var(--foreground))',
                    }}
                    cursor={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Area type="monotone" dataKey="users" name="Usuários" stroke="#6366F1" strokeWidth={2} fill="url(#usersGrad)" dot={false} />
                  <Area type="monotone" dataKey="requests" name="Solicitações" stroke="#10B981" strokeWidth={2} fill="url(#requestsGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Live feed */}
        <div>
          <LiveActivityFeed />
        </div>
      </div>

      {/* Recent requests */}
      <RecentRequests />
    </div>
  );
}
