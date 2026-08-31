/**
 * Serviço de Integração com a Evolution API
 * Para enviar mensagens de WhatsApp automatizadas.
 */

export async function sendAutomatedWhatsAppMessage(phone: string, message: string) {
  // Limpa o telefone para deixar apenas números
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  
  if (!cleanPhone) {
    console.log('[WhatsApp] Cancelado: Profissional sem telefone.');
    return { success: false, error: 'Sem telefone' };
  }

  // Verifica se o número tem 11 ou 10 dígitos (DDD + Número), adicionando o DDI do Brasil (55)
  // Evolution API espera o formato 5511999999999
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  // Pegar as variáveis de ambiente
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instanceName = process.env.EVOLUTION_INSTANCE_NAME;

  // Se não estiver configurado, avisa no log mas não quebra o sistema
  if (!apiUrl || !apiKey || !instanceName) {
    console.warn('[WhatsApp] Evolution API não configurada. A mensagem não foi enviada. Verifique o arquivo .env');
    return { success: false, error: 'Configuração ausente' };
  }

  // Tira a barra final se tiver no apiUrl
  const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  const endpoint = `${baseUrl}/message/sendText/${instanceName}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        number: formattedPhone,
        options: {
          delay: 1200,
          presence: 'composing',
          linkPreview: false
        },
        text: message
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('[WhatsApp] Erro na Evolution API:', errData);
      const exactError = errData.message || errData.error || errData.response?.message?.[0] || 'Erro desconhecido na Evolution API';
      return { success: false, error: exactError };
    }

    console.log(`[WhatsApp] Mensagem enviada com sucesso para ${formattedPhone}!`);
    return { success: true };
  } catch (error) {
    console.error('[WhatsApp] Erro de rede ao chamar Evolution API:', error);
    return { success: false, error: 'Erro de rede' };
  }
}
