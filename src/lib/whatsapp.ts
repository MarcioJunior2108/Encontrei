// Módulo de integração com API de WhatsApp (Ex: Evolution API, Z-API, ChatPro, etc)

interface WhatsappMessagePayload {
  phone: string;
  message: string;
}

export async function sendWhatsappNotification({ phone, message }: WhatsappMessagePayload) {
  // Limpa o telefone para garantir que só tem números
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (!cleanPhone) {
    console.warn('⚠️ [WhatsApp API] Tentativa de envio falhou: Telefone inválido.', phone);
    return false;
  }

  console.log(`\n📱 [WhatsApp API - SIMULAÇÃO] Preparando envio para: ${cleanPhone}`);
  console.log(`Mensagem:\n${message}\n`);

  // TODO: Configure suas credenciais da API de WhatsApp no arquivo .env
  const API_URL = process.env.WHATSAPP_API_URL; 
  const API_TOKEN = process.env.WHATSAPP_API_TOKEN;

  if (!API_URL || !API_TOKEN) {
    console.log('⚠️ [WhatsApp API] Credenciais não configuradas (WHATSAPP_API_URL / WHATSAPP_API_TOKEN). Simulando sucesso de envio no console para fins de desenvolvimento.');
    return true; // Sucesso simulado
  }

  try {
    // Exemplo de payload padronizado (Evolution API / Z-API)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
        'apikey': API_TOKEN, // Algumas APIs usam apikey no header
      },
      body: JSON.stringify({
        number: cleanPhone, // formato com DDI (ex: 5571999999999)
        text: message
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [WhatsApp API] Falha na resposta da API:', response.status, errorText);
      return false;
    }

    console.log('✅ [WhatsApp API] Mensagem enviada com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ [WhatsApp API] Erro ao conectar com o serviço de mensageria:', error);
    return false;
  }
}
