import type { Metadata } from 'next';
import { ParaProfissionaisClient } from './ClientPage';

export const metadata: Metadata = {
  title: 'AcheiYou | Seja um Profissional Parceiro',
  description:
    'Cadastre seu serviço no AcheiYou, apareça para pessoas da sua região e receba pedidos de orçamento diretamente no seu celular.',
};

export default function ParaProfissionaisPage() {
  return <ParaProfissionaisClient />;
}
