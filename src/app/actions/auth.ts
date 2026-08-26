'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { getBaseUrl } from '@/lib/utils';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Retorna o erro real do Supabase (ex: "Email not confirmed" ou "Invalid login credentials")
    return { error: error.message };
  }

  // Descobrir a role do usuário para redirecionar certo
  const profile = await prisma.profile.findUnique({
    where: { id: (await supabase.auth.getUser()).data.user?.id }
  });

  revalidatePath('/', 'layout');
  
  if (profile?.role === 'PROFESSIONAL') {
    redirect('/profissional');
  } else {
    redirect('/dashboard');
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        name: formData.get('name') as string,
        role: formData.get('accountType') as string || 'CLIENT',
      },
    },
  };

  const { data: authData, error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  // Se o usuário foi criado no Supabase Auth, sincronizamos com o nosso banco Prisma
  if (authData.user) {
    const role = data.options.data.role === 'PROFESSIONAL' ? 'PROFESSIONAL' : 'CLIENT';
    
    try {
      await prisma.profile.create({
        data: {
          id: authData.user.id,
          email: authData.user.email || data.email,
          name: data.options.data.name,
          role: role,
          professional: role === 'PROFESSIONAL' ? {
            create: {} // Cria registro profissional vazio
          } : undefined
        }
      });
    } catch (dbError) {
      // Idealmente aqui lidaríamos com a falha do BD.
      // Em produção, talvez uma fila ou log. 
      console.error('Falha ao criar o perfil no Prisma:', dbError);
    }
  }

  // Lê o parâmetro next (se houver, ex: veio do /claim)
  const nextUrl = formData.get('next') as string;

  // Depois de criar, redireciona para o fluxo correto
  revalidatePath('/', 'layout');
  
  if (nextUrl) {
    redirect(nextUrl);
  } else {
    redirect('/onboarding');
  }
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function loginWithGoogle(formData?: FormData): Promise<void> {
  const supabase = await createClient();
  
  const nextUrl = formData?.get('next') as string;
  const role = (formData?.get('role') as string) || 'CLIENT';
  const baseUrl = getBaseUrl();
  
  // Encode role in the callback URL so we can apply it after OAuth
  const callbackUrl = `${baseUrl}/auth/callback?role=${encodeURIComponent(role)}${nextUrl ? `&next=${encodeURIComponent(nextUrl)}` : ''}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
    },
  });

  if (error || !data?.url) {
    redirect(`/login?error=${encodeURIComponent(error?.message ?? 'google-auth-failed')}`);
  }

  redirect(data.url);
}
