import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/app/actions/user';

/**
 * POST /api/admin/broadcast/validate
 * Valida uma lista de números contra a Evolution API para verificar
 * quais possuem WhatsApp ativo. Retorna listas de válidos e inválidos.
 */
export async function POST(req: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { phones } = await req.json();

    if (!phones || !Array.isArray(phones) || phones.length === 0) {
      return NextResponse.json({ error: 'Lista de números é obrigatória' }, { status: 400 });
    }

    const apiUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instanceName = process.env.EVOLUTION_INSTANCE_NAME;

    if (!apiUrl || !apiKey || !instanceName) {
      return NextResponse.json({ error: 'Evolution API não configurada' }, { status: 400 });
    }

    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    // Formata todos os números para o padrão da Evolution API (55XXXXXXXXXXX)
    const formattedPhones = phones.map((p: string) => {
      const clean = String(p).replace(/\D/g, '');
      return clean.startsWith('55') ? clean : `55${clean}`;
    });

    // Remove duplicatas
    const uniqueFormattedPhones = Array.from(new Set(formattedPhones));

    // Chama o endpoint de verificação em lote da Evolution API
    const response = await fetch(`${baseUrl}/chat/whatsappNumbers/${instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({ numbers: uniqueFormattedPhones })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('[Validate] Erro na Evolution API:', err);
      return NextResponse.json(
        { error: 'Erro ao validar números na Evolution API: ' + (err.message || err.error || response.status) },
        { status: 500 }
      );
    }

    const data = await response.json();

    // A Evolution API retorna um array com { number, exists, jid } para cada número
    const valid: string[] = [];
    const invalid: string[] = [];

    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        const number = item.number || item.jid?.split('@')[0] || '';
        if (item.exists === true || item.numberExists === true) {
          valid.push(number);
        } else {
          invalid.push(number);
        }
      });
    }

    return NextResponse.json({ valid, invalid, total: phones.length });

  } catch (error: any) {
    console.error('[Validate] Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno ao validar números' }, { status: 500 });
  }
}
