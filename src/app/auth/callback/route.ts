import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const role = (searchParams.get('role') || 'CLIENT') as 'CLIENT' | 'PROFESSIONAL';
  const next = searchParams.get('next') ?? (role === 'PROFESSIONAL' ? '/profissional' : '/dashboard');

  if (code) {
    const supabase = await createClient();
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && sessionData.user) {
      const userId = sessionData.user.id;
      const userEmail = sessionData.user.email ?? '';
      const userName = sessionData.user.user_metadata?.full_name 
        ?? sessionData.user.user_metadata?.name 
        ?? '';

      // Upsert profile with the chosen role
      try {
        await prisma.profile.upsert({
          where: { id: userId },
          update: { 
            name: userName || undefined,
            role: role,
          },
          create: {
            id: userId,
            email: userEmail,
            name: userName,
            role: role,
          },
        });

        // If professional, ensure professional record exists
        if (role === 'PROFESSIONAL') {
          await prisma.professional.upsert({
            where: { userId },
            update: {},
            create: { userId },
          });
        }
      } catch (dbError) {
        console.error('Callback: erro ao atualizar perfil:', dbError);
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      const redirectTo = isLocalEnv 
        ? `${origin}${next}` 
        : forwardedHost 
          ? `https://${forwardedHost}${next}` 
          : `${origin}${next}`;
          
      return NextResponse.redirect(redirectTo);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
