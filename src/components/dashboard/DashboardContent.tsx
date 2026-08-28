'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardRequests } from './DashboardRequests';
import { ChatView } from '@/components/chat/ChatView';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

interface DashboardContentProps {
  requests: any[];
  profileId: string;
}

export function DashboardContent({ requests, profileId }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const handleOpenChat = (requestId: string) => {
    setActiveChat(requestId);
    setActiveTab('mensagens');
  };

  return (
    <div className="mt-8">
      <div className="border-b border-[hsl(var(--border))] mb-6">
        <div className="flex items-center gap-6 text-sm font-medium">
          {['overview', 'mensagens'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
                  : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
            >
              {tab === 'overview' ? 'Solicitações' : 'Mensagens'}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'mensagens' && (
          <div className="-mx-4 sm:mx-0">
            <ChatView 
              requests={requests}
              currentUserId={profileId}
              isProfessional={false}
              activeChatId={activeChat}
              onClose={() => setActiveTab('overview')}
            />
          </div>
        )}

        {activeTab === 'overview' && (
          <Card>
            <div className="px-6 py-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
              <h2 className="font-semibold text-[hsl(var(--foreground))]">Solicitações recentes</h2>
            </div>
            <CardContent className="p-0">
              {requests.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="h-8 w-8 text-[hsl(var(--muted-foreground)/0.4)] mx-auto mb-3" />
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">Ainda não há solicitações</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Navegue pelos profissionais e peça um orçamento!</p>
                </div>
              ) : (
                <DashboardRequests 
                  requests={requests} 
                  profileId={profileId} 
                  onOpenChat={handleOpenChat}
                />
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
