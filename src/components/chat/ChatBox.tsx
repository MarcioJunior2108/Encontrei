'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import { getChatMessages, sendChatMessage } from '@/app/actions/chat';

export function ChatBox({ 
  requestId, 
  currentUserId,
  participantName,
  onBack,
  fullHeight = false
}: { 
  requestId: string, 
  currentUserId: string,
  participantName: string,
  onBack?: () => void,
  fullHeight?: boolean
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
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
    // Polling a cada 3 segundos
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [requestId]);

  useEffect(() => {
    // Scroll para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const content = inputText;
    setInputText('');

    // Otimista: adiciona na tela instantaneamente
    const tempMsg = {
      id: 'temp-' + Date.now(),
      content: content,
      senderId: currentUserId,
      createdAt: new Date(),
      isPending: true,
    };
    setMessages(prev => [...prev, tempMsg]);

    // Envia em background sem travar a interface
    sendChatMessage(requestId, content).then(() => {
      fetchMessages();
    }).catch(err => {
      console.error('Erro ao enviar mensagem:', err);
      // Aqui poderíamos remover a mensagem otimista ou marcar como erro
    });
  };

  return (
    <div className={`flex flex-col ${fullHeight ? 'h-full border-0 rounded-none' : 'h-[280px] border border-[hsl(var(--border))] rounded-md shadow-sm mt-2'} overflow-hidden bg-[hsl(var(--background))]`}>
      {/* Header do Chat */}
      <div className="bg-[hsl(var(--muted)/0.5)] px-3 py-2 border-b border-[hsl(var(--border))] flex items-center justify-between shrink-0">
        <div className="flex items-center">
          {onBack && (
            <button 
              onClick={onBack}
              className="md:hidden mr-3 p-1.5 -ml-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] rounded-full transition-colors"
              aria-label="Voltar para a lista"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center font-bold text-sm mr-3 shadow-sm">
            {participantName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm text-[hsl(var(--foreground))]">{participantName}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] leading-none mt-0.5">Chat Interno</p>
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
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${msg.isPending ? 'opacity-70' : ''}`}>
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
          autoFocus
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!inputText.trim()}
          className="rounded-md h-8 w-8 shrink-0 shadow-sm"
        >
          <Send className="h-3 w-3" />
        </Button>
      </form>
    </div>
  );
}
