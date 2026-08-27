'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, Briefcase } from 'lucide-react';
import Link from 'next/link';

import { Suspense } from 'react';

function ClaimContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleClaim = async () => {
    if (!user) {
      // Redirecionar para cadastro passando o token
      router.push(`/cadastro?next=/claim?token=${token}`);
      return;
    }

    try {
      setClaiming(true);
      setError(null);
      
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimToken: token })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao reivindicar perfil');
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/profissional');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setClaiming(false);
    }
  };

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Link Inválido</CardTitle>
            <CardDescription>O link de acesso está faltando o token de segurança.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center border-green-200">
          <CardHeader>
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Perfil Reivindicado!</CardTitle>
            <CardDescription>
              Tudo pronto. Você será redirecionado para o seu painel de profissional.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Você tem solicitações de clientes!</CardTitle>
          <CardDescription className="text-base mt-2">
            Um cliente encontrou sua empresa no <strong>AcheiYou</strong> e solicitou um serviço. 
            Reivindique seu perfil agora para ver os detalhes e entrar em contato.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4 border border-red-100">
              {error}
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
            {user ? (
              <p>Você está logado como <strong>{user.email}</strong>. Clique no botão abaixo para vincular as solicitações a esta conta.</p>
            ) : (
              <p>Você precisa criar uma conta gratuita para acessar o pedido do cliente. É rápido e seguro.</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex-col gap-3">
          <Button 
            className="w-full h-12 text-lg" 
            onClick={handleClaim} 
            disabled={claiming}
          >
            {claiming ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...</>
            ) : user ? (
              'Reivindicar Perfil Agora'
            ) : (
              'Criar Conta para Reivindicar'
            )}
          </Button>
          
          {user && (
            <Button variant="ghost" className="w-full" onClick={() => {
              const supabase = createClient();
              supabase.auth.signOut();
              setUser(null);
            }}>
              Sair e usar outra conta
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gray-50"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <ClaimContent />
    </Suspense>
  );
}
