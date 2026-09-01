'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateProfessionalProfile } from '@/app/actions/professional';
import { Save, UserCircle, Briefcase } from 'lucide-react';

interface ProfileSettingsProps {
  profile: any;
  professional?: any;
}

export function ProfileSettings({ profile, professional: explicitProfessional }: ProfileSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.avatarUrl || null);
  
  const professional = explicitProfessional || profile?.professional;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const formData = new FormData(e.currentTarget);
    const result = await updateProfessionalProfile(formData);
    
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage('Perfil atualizado com sucesso!');
    }
    
    setLoading(false);
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Configurações do Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 flex flex-col items-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[hsl(var(--muted))] border-2 border-[hsl(var(--border))]">
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-full h-full text-[hsl(var(--muted-foreground))]" />
                )}
              </div>
              <label htmlFor="avatar" className="cursor-pointer text-sm text-[hsl(var(--primary))] hover:underline">
                Alterar foto
              </label>
              <input 
                id="avatar" 
                name="avatar" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="headline" className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Sua Especialidade (Headline)
              </label>
              <input
                id="headline"
                name="headline"
                type="text"
                defaultValue={professional?.headline || ''}
                placeholder="Ex: Eletricista Residencial e Predial"
                className="w-full rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm outline-none focus:border-[hsl(var(--primary))]"
                maxLength={60}
              />
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Aparece logo abaixo do seu nome nas buscas. (Máx 60 caracteres)
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Resumo (Bio)
              </label>
              <textarea
                id="bio"
                name="bio"
                defaultValue={professional?.bio || ''}
                placeholder="Conte um pouco sobre sua experiência e como você pode ajudar os clientes..."
                className="w-full min-h-[120px] rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm outline-none focus:border-[hsl(var(--primary))] resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">Cidade</label>
                <input
                  id="city" name="city" type="text"
                  defaultValue={profile?.city || ''}
                  placeholder="Ex: São Paulo"
                  className="w-full rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">Estado (UF)</label>
                <input
                  id="state" name="state" type="text"
                  defaultValue={profile?.state || ''}
                  placeholder="Ex: SP" maxLength={2}
                  className="w-full rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm outline-none focus:border-[hsl(var(--primary))] uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="basePrice" className="text-sm font-medium">Valor Médio por Serviço (R$)</label>
              <input
                id="basePrice" name="basePrice" type="number" step="0.01" min="0"
                defaultValue={professional?.basePrice ? Number(professional.basePrice) : ''}
                placeholder="Ex: 150.00"
                className="w-full rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm outline-none focus:border-[hsl(var(--primary))]"
              />
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Ajuda clientes a terem uma noção de custo.</p>
            </div>

            {message && (
              <div className={`p-3 text-sm rounded-[var(--radius-md)] ${message.includes('sucesso') ? 'bg-[hsl(var(--success-muted))] text-[hsl(var(--success))]' : 'bg-red-500/10 text-red-500'}`}>
                {message}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2">
              <Save className="h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
