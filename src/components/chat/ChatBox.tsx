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
    <div className="flex flex-col h-[280px] border border-[hsl(var(--border))] rounded-md overflow-hidden bg-[hsl(var(--background))] shadow-sm mt-2">
      {/* Header do Chat */}
      <div className="bg-[hsl(var(--muted)/0.5)] px-3 py-2 border-b border-[hsl(var(--border))] flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-6 w-6 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center font-bold text-xs mr-2 shadow-sm">
            {participantName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-xs text-[hsl(var(--foreground))]">{participantName}</p>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))] leading-none mt-0.5">Chat Interno</p>
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30">
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
      <form onSubmit={handleSend} className="p-2 bg-white border-t border-[hsl(var(--border))] flex gap-2 items-center">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Mensagem..."
          className="flex-1 rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]/50 transition-shadow"
          disabled={sending}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={sending || !inputText.trim()}
          className="rounded-md h-8 w-8 shrink-0 shadow-sm"
        >
          {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
        </Button>
      </form>
    </div>
  );
}
