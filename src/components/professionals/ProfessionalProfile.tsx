'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star, MapPin, Clock, CheckCircle2, Shield, Zap,
  Calendar, TrendingUp, MessageSquare, Share2, Heart,
  Award, BarChart2, ThumbsUp
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RequestServiceModal } from './RequestServiceModal';
import { MOCK_REVIEWS } from '@/mock/data';
import { formatCurrency, formatNumber, formatResponseTime, formatRelativeTime, getRatingLabel } from '@/lib/utils';
import type { Professional } from '@/types';

function ReputationScore({ rep }: { rep: Professional['reputation'] }) {
  const stats = [
    { label: 'Taxa de conclusão', value: `${rep.completionRate}%`, icon: CheckCircle2, color: 'var(--success)' },
    { label: 'Satisfação', value: `${rep.satisfactionRate}%`, icon: ThumbsUp, color: 'var(--primary)' },
    { label: 'Tempo de resposta', value: formatResponseTime(rep.responseTimeMinutes), icon: Clock, color: 'var(--warning)' },
    { label: 'Serviços feitos', value: formatNumber(rep.completedServices), icon: BarChart2, color: 'var(--info)' },
  ];

  return (
    <div className="space-y-4">
      {/* Main score */}
      <div className="flex items-center gap-4">
        <div className="text-5xl font-black text-[hsl(var(--foreground))]">
          {rep.rating.toFixed(1)}
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.round(rep.rating) ? 'text-amber-400 fill-amber-400' : 'text-[hsl(var(--border))]'}`}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
            {getRatingLabel(rep.rating)}
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            {formatNumber(rep.reviewCount)} avaliações
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 p-3 rounded-[var(--radius-lg)] bg-[hsl(var(--muted)/0.5)]"
          >
            <div
              className="h-8 w-8 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `hsl(${color}/0.12)` }}
            >
              <Icon className="h-4 w-4" style={{ color: `hsl(${color})` }} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-[hsl(var(--foreground))]">{value}</p>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfessionalProfile({ professional: pro }: { professional: any }) {
  const [saved, setSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const reviews = MOCK_REVIEWS.filter(r => r.professionalId === pro.id).slice(0, 6);
  // Fallback to some reviews if none for this pro
  const displayReviews = reviews.length > 0 ? reviews : MOCK_REVIEWS.slice(0, 4);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column — main info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <Avatar
                      src={pro.user.avatar}
                      name={pro.user.name}
                      size="2xl"
                      verified={pro.verificationStatus === 'VERIFIED'}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">
                            {pro.user.name}
                          </h1>
                          <p className="text-[hsl(var(--muted-foreground))] mt-0.5">
                            {pro.headline}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => setSaved(s => !s)}
                            className="h-9 w-9 rounded-full flex items-center justify-center border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-all"
                            aria-label={saved ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                          >
                            <Heart
                              className={`h-4 w-4 transition-colors ${saved ? 'text-red-500 fill-red-500' : 'text-[hsl(var(--muted-foreground))]'}`}
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            className="h-9 w-9 rounded-full flex items-center justify-center border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-all"
                            aria-label="Compartilhar perfil"
                          >
                            <Share2 className="h-4 w-4 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {pro.verificationStatus === 'VERIFIED' && (
                          <Badge variant="success">
                            <Shield className="h-3 w-3" aria-hidden="true" /> Verificado
                          </Badge>
                        )}
                        {pro.availableToday && (
                          <Badge variant="primary">
                            <Zap className="h-3 w-3" aria-hidden="true" /> Disponível hoje
                          </Badge>
                        )}
                        {pro.reputation.rating >= 4.8 && (
                          <Badge variant="warning">
                            <Award className="h-3 w-3" aria-hidden="true" /> Top profissional
                          </Badge>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-sm text-[hsl(var(--muted-foreground))]">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {pro.location.city}, {pro.location.state}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          Responde em {formatResponseTime(pro.reputation.responseTimeMinutes)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                          {pro.reputation.completionRate}% conclusão
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="border-t border-[hsl(var(--border))] pt-5">
                    <h2 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-2">Sobre</h2>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                      {pro.bio}
                    </p>
                  </div>

                  {/* Categories */}
                  <div className="border-t border-[hsl(var(--border))] pt-5 mt-5">
                    <h2 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">Especialidades</h2>
                    <div className="flex flex-wrap gap-2">
                      {pro.categories.map((cat: any) => (
                        <span
                          key={cat.id}
                          className="text-xs px-3 py-1.5 rounded-full border border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Serviços</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pro.services.map((svc: any) => (
                      <div
                        key={svc.id}
                        className="flex items-center justify-between p-4 rounded-[var(--radius-lg)] border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.3)] transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{svc.name}</p>
                          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{svc.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="text-sm font-bold text-[hsl(var(--foreground))]">
                            {svc.priceRange
                              ? `${formatCurrency(svc.priceRange.min)} – ${formatCurrency(svc.priceRange.max)}`
                              : svc.price
                              ? formatCurrency(svc.price)
                              : 'A combinar'}
                          </p>
                          {svc.duration && (
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                              ~{svc.duration >= 60 ? `${svc.duration / 60}h` : `${svc.duration}min`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Avaliações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {displayReviews.map(review => (
                      <div key={review.id} className="border-b border-[hsl(var(--border))] last:border-0 pb-5 last:pb-0">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar src={review.author.avatar} name={review.author.name} size="sm" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                              {review.author.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, s) => (
                                  <Star
                                    key={s}
                                    className={`h-3 w-3 ${s < review.rating ? 'text-amber-400 fill-amber-400' : 'text-[hsl(var(--border))]'}`}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-[hsl(var(--muted-foreground))]" suppressHydrationWarning>
                                {formatRelativeTime(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right column — sticky CTA */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="sticky top-24"
            >
              {/* Booking card */}
              <Card className="mb-4">
                <CardContent className="p-5">
                  <div className="mb-4">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Faixa de preço</p>
                    <p className="text-2xl font-bold text-[hsl(var(--foreground))] mt-0.5">
                      {formatCurrency(pro.priceRange.min)}
                      <span className="text-base font-normal text-[hsl(var(--muted-foreground))]">
                        {' '}– {formatCurrency(pro.priceRange.max)}
                      </span>
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">por serviço</p>
                  </div>

                  <div className="space-y-2 mb-5">
                    <Button 
                      className="w-full" 
                      size="lg" 
                      id="contact-professional-btn"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <MessageSquare className="h-4 w-4" aria-hidden="true" />
                      Contratar agora
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      Agendar visita
                    </Button>
                  </div>

                  <div className="space-y-2.5 text-xs text-[hsl(var(--muted-foreground))]">
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-[hsl(var(--success))]" aria-hidden="true" />
                      Pagamento seguro pela plataforma
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))]" aria-hidden="true" />
                      Profissional verificado
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[hsl(var(--primary))]" aria-hidden="true" />
                      Resposta em até {formatResponseTime(pro.reputation.responseTimeMinutes)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reputation card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Reputação</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReputationScore rep={pro.reputation} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <RequestServiceModal 
        professionalId={pro.id} 
        professionalName={pro.user.name} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
