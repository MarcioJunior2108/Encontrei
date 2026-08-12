'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, QrCode, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function WhatsAppSetupPage() {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [error, setError] = useState<string | null>(null);

  const createInstance = async () => {
    setLoading(true);
    setError(null);
    setQrCode(null);

    try {
      const response = await fetch('/api/admin/whatsapp-setup', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao conectar com a Evolution API');
      }

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <QrCode className="w-6 h-6" />
            Conectar WhatsApp
          </CardTitle>
          <CardDescription>
            Use esta página para ler o QR Code e conectar o WhatsApp do robô à Evolution API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {status === 'idle' && (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-6">
                Clique no botão abaixo para gerar o QR Code. Certifique-se de que configurou o arquivo .env com a URL e a KEY da API.
              </p>
              <Button onClick={createInstance} disabled={loading} size="lg" className="w-full sm:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gerar QR Code
              </Button>
            </div>
          )}

          {status === 'connecting' && qrCode && (
            <div className="flex flex-col items-center justify-center py-6 space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Leia o QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Abra o WhatsApp no celular que fará os disparos automáticos, vá em "Aparelhos Conectados" e aponte a câmera para o código abaixo.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border-4 border-dashed border-gray-200">
                <Image 
                  src={qrCode} 
                  alt="WhatsApp QR Code" 
                  width={256} 
                  height={256} 
                  className="rounded-lg"
                />
              </div>
              
              <Button onClick={() => window.location.reload()} variant="outline">
                Já li o código (Atualizar página)
              </Button>
            </div>
          )}

          {status === 'connected' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 text-green-600">
              <CheckCircle2 className="w-16 h-16" />
              <h3 className="text-xl font-bold text-black">WhatsApp Conectado!</h3>
              <p className="text-muted-foreground text-center">
                A Evolution API já está com a sessão aberta. O sistema de disparos automáticos já está 100% operacional.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
