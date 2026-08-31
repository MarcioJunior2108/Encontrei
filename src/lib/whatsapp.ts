/**
 * Serviço de Integração com a Evolution API
 * Para enviar mensagens de WhatsApp automatizadas.
 * 
 * ROBUSTO: Verifica o estado da sessão ANTES de cada envio.
 * Se desconectado, tenta reconectar automaticamente antes de enviar.
 */

const getEnvVars = () => {
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instanceName = process.env.EVOLUTION_INSTANCE_NAME;
  if (!apiUrl || !apiKey || !instanceName) return null;
  const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  return { baseUrl, apiKey, instanceName };
};

/**
 * Verifica se a sessão do WhatsApp está ativa.
 * Retorna true se connected, false caso contrário.
 */
export async function checkWhatsAppSession(): Promise<boolean> {
  const env = getEnvVars();
  if (!env) return false;

  try {
    const response = await fetch(
      `${env.baseUrl}/instance/connectionState/${env.instanceName}`,
      { headers: { apikey: env.apiKey } }
    );
    if (!response.ok) return false;
    const data = await response.json();
    return data?.instance?.state === 'open';
  } catch {
    return false;
  }
}

/**
 * Tenta reconectar a instância da Evolution API, retornando o QR code se necessário.
 * Isso é apenas uma tentativa de reconexão automática para instâncias previamente conectadas.
 */
async function tryReconnect(): Promise<boolean> {
  const env = getEnvVars();
  if (!env) return false;

  try {
    // Tenta conectar diretamente (para casos onde a instância existe mas desconectou)
    const response = await fetch(
      `${env.baseUrl}/instance/connect/${env.instanceName}`,
      { method: 'GET', headers: { apikey: env.apiKey } }
    );
    const data = await response.json().catch(() => ({}));
    
    // Se voltou com estado 'open', reconectou!
    if (data?.instance?.state === 'open') {
      console.log('[WhatsApp] Reconexão automática bem sucedida!');
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Envia uma mensagem de WhatsApp via Evolution API.
 * - Verifica sessão antes de enviar
 * - Tenta reconectar automaticamente se desconectado
 * - Retorna errorCode 'SESSION_LOST' se sessão não pôde ser recuperada
 */
export async function sendAutomatedWhatsAppMessage(phone: string, message: string) {
  const env = getEnvVars();

  if (!env) {
    console.warn('[WhatsApp] Evolution API não configurada. Verifique o arquivo .env');
    return { success: false, error: 'Configuração ausente', errorCode: 'CONFIG_MISSING' };
  }

  // Limpa e formata o telefone
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  if (!cleanPhone) {
    return { success: false, error: 'Sem telefone', errorCode: 'NO_PHONE' };
  }
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  // ✅ VERIFICAÇÃO DE SAÚDE DA SESSÃO antes de cada envio
  const sessionOk = await checkWhatsAppSession();
  
  if (!sessionOk) {
    console.warn('[WhatsApp] Sessão desconectada. Tentando reconectar automaticamente...');
    
    // Tenta reconectar
    const reconnected = await tryReconnect();
    
    if (!reconnected) {
      console.error('[WhatsApp] Reconexão falhou. Sessão perdida!');
      return { 
        success: false, 
        error: 'WhatsApp desconectado! Vá em "Robô do WhatsApp" e reconecte sua conta.',
        errorCode: 'SESSION_LOST'
      };
    }
    
    // Aguarda 2s para a sessão estabilizar após reconexão
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Envia a mensagem
  const endpoint = `${env.baseUrl}/message/sendText/${env.instanceName}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': env.apiKey
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
      console.error('[WhatsApp] Erro na Evolution API ao enviar:', errData, response.status);
      
      const rawMsg = errData.message || errData.error || errData.response?.message?.[0] || '';
      
      // Detecta erros de sessão vindos da própria API
      const isSessionError = response.status === 401 
        || response.status === 403
        || (typeof rawMsg === 'string' && (
          rawMsg.toLowerCase().includes('not connected') ||
          rawMsg.toLowerCase().includes('session') ||
          rawMsg.toLowerCase().includes('instance not found') ||
          rawMsg.toLowerCase().includes('instance not')
        ));

      if (isSessionError) {
        return { 
          success: false, 
          error: 'WhatsApp desconectado! Vá em "Robô do WhatsApp" e reconecte sua conta.',
          errorCode: 'SESSION_LOST'
        };
      }

      const exactError = rawMsg || `Erro ${response.status} da Evolution API`;
      return { success: false, error: exactError, errorCode: 'API_ERROR' };
    }

    console.log(`[WhatsApp] ✅ Mensagem enviada com sucesso para ${formattedPhone}!`);
    return { success: true };
  } catch (error: any) {
    console.error('[WhatsApp] Erro de rede ao chamar Evolution API:', error);
    return { success: false, error: 'Erro de rede ao contactar a Evolution API', errorCode: 'NETWORK_ERROR' };
  }
}
