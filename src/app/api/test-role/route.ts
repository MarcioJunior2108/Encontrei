import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/app/actions/user';

export async function GET() {
  const profile = await getCurrentProfile();
  return NextResponse.json({ profile });
}
