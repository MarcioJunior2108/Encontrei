'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { getChatMessages, sendChatMessage } from '@/app/actions/chat';

export function ChatBox({ 
  requestId, 
  currentUserId,
  participantName
}: { 
  requestId: string, 
  currentUserId: string,
  participantName: string
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const res = await getChatMessages(requestId);
    if (res.success && res.messages) {
      setMessages(res.messages);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    // Polling a cada 5 segundos
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [requestId]);

  useEffect(() => {
    // Scroll para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setSending(true);
    const content = inputText;
    setInputText('');

    // Otimista
    const tempMsg = {
      id: 'temp-' + Date.now(),
      content: content,
      senderId: currentUserId,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, tempMsg]);

    await sendChatMessage(requestId, content);
    await fetchMessages();
    setSending(false);
  };

  return (
    <div className="flex flex-col h-[400px] border border-[hsl(var(--border))] rounded-lg overflow-hidden bg-[hsl(var(--background))]">
      {/* Header do Chat */}
      <div className="bg-[hsl(var(--muted))] px-4 py-3 border-b border-[hsl(var(--border))] flex items-center">
        <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center font-bold mr-3">
          {participantName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-sm">{participantName}</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Chat Interno Seguro</p>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--muted-foreground))]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[hsl(var(--muted-foreground))] text-sm">
            <p>Nenhuma mensagem ainda.</p>
            <p>Mande um 'Olá' para começar!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    isMe 
                    ? 'bg-[hsl(var(--primary))] text-white rounded-tr-none' 
                    : 'bg-white border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-tl-none'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className={`text-[10px] block mt-1 ${isMe ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Área de Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-[hsl(var(--border))] flex gap-2">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 rounded-full border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50"
          disabled={sending}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={sending || !inputText.trim()}
          className="rounded-full h-10 w-10 shrink-0"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
