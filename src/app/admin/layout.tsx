import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentProfile } from '@/app/actions/user';
import { LayoutDashboard, Users, ShieldAlert, FileText, LogOut, ArrowLeft, MapPin, QrCode } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/admin/ThemeToggle';

export const metadata: Metadata = {
  title: 'Painel Admin | Encontrei',
  robots: { index: false, follow: false },
};

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users },
  { href: '/admin/leads', label: 'Pedidos (Leads)', icon: FileText },
  { href: '/admin/importar-maps', label: 'Importar Maps', icon: MapPin },
  { href: '/admin/whatsapp-setup', label: 'Robô do WhatsApp', icon: QrCode },
  { href: '/admin/moderacao', label: 'Moderação', icon: ShieldAlert },
  { href: '/admin/auditoria', label: 'Auditoria', icon: FileText },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== 'ADMIN') {
    redirect('/'); // Proteger rotas! Apenas ADMIN.
  }

  return (
    <div className="min-h-dvh flex bg-[hsl(var(--background))]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-[hsl(var(--border))]">
          <Link href="/" className="flex items-center gap-2 font-bold text-[hsl(var(--foreground))]">
            <div className="h-8 w-8 rounded bg-[hsl(var(--primary))] flex items-center justify-center">
              <span className="text-white text-sm">E</span>
            </div>
            <span>Encontrei Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[hsl(var(--border))]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-[hsl(var(--primary-muted))] flex items-center justify-center">
              <span className="font-bold text-[hsl(var(--primary))]">{profile.name?.charAt(0) || 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile.name}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">Deus (Admin)</p>
            </div>
            <ThemeToggle />
          </div>
          
          <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Sair do Admin
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] flex items-center justify-between px-6 md:hidden">
           <span className="font-bold">Admin Mobile</span>
           <ThemeToggle />
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
