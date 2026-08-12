import Link from 'next/link';
import { IntentInput } from '@/components/intent/IntentInput';

export function HomeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* CTA Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[hsl(var(--foreground)/0.03)] border-t border-[hsl(var(--border))]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))] tracking-tight mb-4">
            Pronto para começar?
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] mb-10 max-w-xl mx-auto">
            Diga o que você precisa e encontramos a solução em segundos.
          </p>
          <IntentInput />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="h-7 w-7 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">E</span>
                </div>
                <span className="font-semibold text-[hsl(var(--foreground))]">Encontrei</span>
              </Link>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed max-w-[200px]">
                Transformando intenção humana em ação.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-widest mb-4">Plataforma</h3>
              <ul className="space-y-3">
                {['Como funciona', 'Explorar serviços', 'Para profissionais', 'Preços'].map(item => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-widest mb-4">Empresa</h3>
              <ul className="space-y-3">
                {['Sobre nós', 'Blog', 'Carreiras', 'Contato'].map(item => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-widest mb-4">Legal</h3>
              <ul className="space-y-3">
                {['Termos de uso', 'Privacidade', 'Cookies', 'Segurança'].map(item => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[hsl(var(--border))]">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              © {currentYear} Encontrei. Todos os direitos reservados.
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground)/0.6)]">
              Ambiente de demonstração — dados mockados
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
