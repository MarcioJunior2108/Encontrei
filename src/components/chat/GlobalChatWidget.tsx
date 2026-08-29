'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, X, ChevronLeft, Loader2 } from 'lucide-react';
import { getActiveChats } from '@/app/actions/chat';
import { ChatBox } from './ChatBox';
import { usePathname } from 'next/navigation';

export function GlobalChatWidget({ currentUserId }: { currentUserId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const pathname = usePathname();
  const hideOnPaths = ['/login', '/register', '/'];
  const loadChats = async () => {
    setLoading(true);
    const res = await getActiveChats();
    if (res.success && res.chats) {
      setChats(res.chats);
      // Aqui poderíamos calcular as mensagens não lidas
      setUnreadCount(res.chats.length > 0 ? 1 : 0); // Fake badge just for demo
    }
    setLoading(false);
  };

  useEffect(() => {
    loadChats();
    // Polling da lista a cada 3 segundos
    const interval = setInterval(loadChats, 3000);

    // Escutar eventos customizados de outras partes do app
    const handleOpenChatEvent = (e: any) => {
      if (e.detail?.requestId) {
        setActiveChatId(e.detail.requestId);
        setIsOpen(true);
      }
    };
    window.addEventListener('open-chat', handleOpenChatEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('open-chat', handleOpenChatEvent);
    };
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      loadChats();
    }
    setIsOpen(!isOpen);
    if (isOpen) setActiveChatId(null);
  };

  const activeChatData = chats.find(c => c.id === activeChatId);

  if (hideOnPaths.includes(pathname || '')) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end">
      
      {/* Popover */}
      {isOpen && (
        <div className="mb-4 bg-white border border-[hsl(var(--border))] rounded-xl shadow-2xl overflow-hidden w-[90vw] md:w-[350px] h-[500px] max-h-[75vh] flex flex-col origin-bottom-right animate-in zoom-in-95 duration-200">
          
          {/* View: Lista de Chats */}
          {!activeChatId && (
            <>
              <div className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-4 py-3 flex items-center justify-between shadow-sm">
                <h3 className="font-semibold text-sm">Mensagens</h3>
                <button onClick={handleToggle} className="p-1 hover:bg-white/20 rounded-full transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-[hsl(var(--background))]">
                {loading && chats.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--muted-foreground))]" />
                  </div>
                ) : chats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-[hsl(var(--muted-foreground))] p-6 text-center">
                    <MessageSquare className="h-10 w-10 mb-3 opacity-20" />
                    <p className="text-sm">Nenhuma conversa ativa no momento.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[hsl(var(--border))]">
                    {chats.map(chat => {
                      const isClientMe = chat.clientId === currentUserId;
                      const participantName = isClientMe 
                        ? (chat.professional?.profile?.name || 'Profissional') 
                        : (chat.client?.name || 'Cliente');
                      
                      const lastMessage = chat.messages?.[0]?.content || chat.description;

                      return (
                        <div 
                          key={chat.id} 
                          onClick={() => setActiveChatId(chat.id)}
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-[hsl(var(--primary))] to-purple-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm border-2 border-white">
                            {participantName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                              <p className="font-semibold text-sm truncate text-[hsl(var(--foreground))]">{participantName}</p>
                              <span className="text-[10px] text-[hsl(var(--muted-foreground))] flex-shrink-0 ml-2">
                                {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                              {lastMessage}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* View: Chat Ativo */}
          {activeChatId && activeChatData && (
            <div className="flex-1 flex flex-col h-full bg-white">
              {/* O header real fica no ChatBox, mas vamos passá-lo como onBack para ele voltar à lista */}
              <ChatBox 
                requestId={activeChatData.id}
                currentUserId={currentUserId}
                participantName={
                  activeChatData.clientId === currentUserId 
                    ? (activeChatData.professional?.profile?.name || 'Profissional') 
                    : (activeChatData.client?.name || 'Cliente')
                }
                onBack={() => setActiveChatId(null)}
                fullHeight={true}
              />
            </div>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={handleToggle}
        className="h-14 w-14 rounded-full bg-[hsl(var(--foreground))] hover:bg-black text-[hsl(var(--background))] flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 relative"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

    </div>
  );
}
