'use client';

import { useState } from 'react';
import { ChatBox } from './ChatBox';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface ChatViewProps {
  requests: any[];
  currentUserId: string;
  isProfessional: boolean;
  activeChatId?: string | null;
  onClose?: () => void;
}

export function ChatView({ requests, currentUserId, isProfessional, activeChatId, onClose }: ChatViewProps) {
  // Inicializa o chat ativo com a prop, se houver
  const [activeChat, setActiveChat] = useState<string | null>(activeChatId || null);

  // Filtra apenas pedidos aceitos e desbloqueados
  const chatableRequests = requests.filter(req => req.status === 'ACCEPTED' && req.isUnlocked);

  const handleSelectChat = (reqId: string) => {
    setActiveChat(reqId);
  };

  const handleBack = () => {
    setActiveChat(null);
    if (onClose) onClose();
  };

  const activeRequest = chatableRequests.find(req => req.id === activeChat);

  // Se for celular e tiver um chat aberto, mostra só o chat
  const showSidebarOnMobile = !activeChat;
  const showChatOnMobile = !!activeChat;

  return (
    <div className="flex h-[600px] border border-[hsl(var(--border))] rounded-lg overflow-hidden bg-[hsl(var(--background))] shadow-sm">
      
      {/* Sidebar (Lista de Contatos) */}
      <div className={`w-full md:w-80 flex-shrink-0 flex flex-col border-r border-[hsl(var(--border))] bg-slate-50/30 ${!showSidebarOnMobile ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]">
          <h2 className="font-bold text-lg text-[hsl(var(--foreground))]">Mensagens</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chatableRequests.length === 0 ? (
            <div className="p-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
              Você não tem conversas ativas.
            </div>
          ) : (
            <div className="divide-y divide-[hsl(var(--border))]">
              {chatableRequests.map(req => {
                const participantName = isProfessional 
                  ? (req.client?.name || 'Cliente') 
                  : (req.professional?.profile?.name || 'Profissional');
                
                const isActive = activeChat === req.id;

                return (
                  <div 
                    key={req.id} 
                    onClick={() => handleSelectChat(req.id)}
                    className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${isActive ? 'bg-[hsl(var(--primary)/0.1)] border-l-4 border-l-[hsl(var(--primary))]' : 'hover:bg-[hsl(var(--muted)/0.5)] border-l-4 border-l-transparent'}`}
                  >
                    <div className="h-10 w-10 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center font-bold flex-shrink-0">
                      {participantName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <p className="font-semibold text-sm truncate text-[hsl(var(--foreground))]">{participantName}</p>
                        <span className="text-[10px] text-[hsl(var(--muted-foreground))] flex-shrink-0 ml-2">
                          {new Date(req.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                        {req.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Área Principal (Chat) */}
      <div className={`flex-1 flex flex-col bg-[hsl(var(--background))] ${!showChatOnMobile ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat || !activeRequest ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[hsl(var(--muted-foreground))]">
            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
            <p>Selecione uma conversa para começar</p>
          </div>
        ) : (
          <ChatBox 
            requestId={activeRequest.id}
            currentUserId={currentUserId}
            participantName={isProfessional ? (activeRequest.client?.name || 'Cliente') : (activeRequest.professional?.profile?.name || 'Profissional')}
            onBack={handleBack}
            fullHeight={true}
          />
        )}
      </div>

    </div>
  );
}
