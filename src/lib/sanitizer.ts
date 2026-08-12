/**
 * Oculta números de telefone e e-mails de textos para evitar bypass da plataforma.
 */
export function sanitizeContactInfo(text: string): string {
  if (!text) return text;

  // 1. Remove E-mails
  // Ex: teste@gmail.com
  let sanitized = text.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    '[E-MAIL OCULTO]'
  );

  // 2. Remove Telefones / Celulares (Foco no padrão Brasileiro)
  // Ex: 11999999999, 11 9999-9999, (11) 99999-9999, +55 11 9 9999 9999
  const phoneRegex = /(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?(?:9\s?)?(?:\d{4,5}[-\s]?\d{4})/g;
  sanitized = sanitized.replace(phoneRegex, '[TELEFONE OCULTO]');

  // 3. Remove Números Sequenciais Longos que tentam burlar a Regex
  // Ex: 1 1 9 9 9 9 9 9 9 9 9
  const sneakyRegex = /(?:\d\s*[\.,-]?\s*){8,13}/g;
  sanitized = sanitized.replace(sneakyRegex, '[TELEFONE OCULTO]');

  return sanitized;
}
