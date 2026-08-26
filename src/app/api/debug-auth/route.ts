import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll().map(c => c.name);

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    let profile = null;
    let dbError = null;

    if (user) {
      try {
        profile = await prisma.profile.findUnique({
          where: { id: user.id }
        });
      } catch (err: any) {
        dbError = err.message || 'Erro no Prisma';
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      envVars: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'NOT_SET',
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT_SET',
        VERCEL_URL: process.env.VERCEL_URL || 'NOT_SET',
      },
      cookies_present: allCookies,
      supabase_auth: {
        hasUser: !!user,
        userId: user?.id,
        userEmail: user?.email,
        error: authError?.message || null,
      },
      database_profile: {
        hasProfile: !!profile,
        role: profile?.role,
        error: dbError,
      }
    });
  } catch (globalError: any) {
    return NextResponse.json({
      error: 'CRITICAL_ERROR',
      message: globalError.message
    });
  }
}
