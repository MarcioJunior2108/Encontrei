'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, QrCode, CheckCircle2, LogOut } from 'lucide-react';
import Image from 'next/image';

export default function WhatsAppSetupPage() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/admin/whatsapp-setup');
        const data = await res.json();
        if (data.state === 'open') {
          setStatus('connected');
        } else {
          setStatus('idle');
        }
      } catch (err) {
        setStatus('idle');
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  // Auto-refresh QR Code para não expirar
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === 'connecting') {
      interval = setInterval(async () => {
        try {
          // Faz o POST silencioso apenas para atualizar a imagem do QR Code
          const response = await fetch('/api/admin/whatsapp-setup', { method: 'POST' });
          const data = await response.json();

          if (data.qrcode && data.qrcode.base64) {
            setQrCode(data.qrcode.base64);
          } else if (data.instance?.state === 'open') {
            setStatus('connected');
          }
        } catch (err) {
          console.error('Falha ao atualizar QR Code:', err);
        }
      }, 15000); // A cada 15 segundos pega um QR Code novo
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  const createInstance = async () => {
    setActionLoading(true);
    setError(null);
    setQrCode(null);

    try {
      const response = await fetch('/api/admin/whatsapp-setup', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erro ao conectar com a Evolution API');

      if (data.qrcode && data.qrcode.base64) {
        setQrCode(data.qrcode.base64);
        setStatus('connecting');
      } else if (data.instance?.state === 'open') {
        setStatus('connected');
      } else {
        throw new Error('QR Code não retornado pela API. Verifique as configurações.');
      }
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    } finally {
      setActionLoading(false);
    }
  };

  const disconnectInstance = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/whatsapp-setup', { method: 'DELETE' });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data.error || 'Falha ao desconectar na API');
      setStatus('idle');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <QrCode className="w-6 h-6" />
            Robô do WhatsApp
          </CardTitle>
          <CardDescription>
            Use esta página para gerenciar a conexão do robô disparador automático de orçamentos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {(status === 'idle' || status === 'error') && (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-6">
                Status: <span className="font-bold text-red-500">Desconectado</span>. O robô não está enviando mensagens.
              </p>
              <Button onClick={createInstance} disabled={actionLoading} size="lg" className="w-full sm:w-auto">
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Conectar Aparelho (Gerar QR Code)
              </Button>
            </div>
          )}

          {status === 'connecting' && qrCode && (
            <div className="flex flex-col items-center justify-center py-6 space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Leia o QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Abra o WhatsApp no celular do robô, vá em "Aparelhos Conectados" e escaneie.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border-4 border-dashed border-gray-200">
                <Image src={qrCode} alt="WhatsApp QR Code" width={256} height={256} className="rounded-lg" />
              </div>
              
              <Button onClick={() => window.location.reload()} variant="outline">
                Já li o código (Atualizar status)
              </Button>
            </div>
          )}

          {status === 'connected' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-6">
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
                <h3 className="text-xl font-bold text-black">WhatsApp Conectado e Operante!</h3>
                <p className="text-muted-foreground text-center">
                  A Evolution API já está com a sessão aberta. O sistema de disparos automáticos está online e enviando notificações.
                </p>
              </div>

              <Button 
                onClick={disconnectInstance} 
                disabled={actionLoading} 
                variant="destructive"
                className="mt-4"
              >
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <LogOut className="mr-2 h-4 w-4" />
                Desconectar Sessão
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
