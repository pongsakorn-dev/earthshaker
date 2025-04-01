import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { Notification } from './ui/notification';
import { Container, PageHeader, PageTitle } from './ui/layout';
import { Building2 } from 'lucide-react';

export interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  notification?: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
  };
  projectName?: string;
}

export default function AppLayout({
  children,
  title,
  notification,
  projectName,
}: AppLayoutProps) {
  const { t: originalT } = useTranslation();
  const t = originalT as unknown as (key: string, options?: any) => string;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <LanguageSelector projectName={projectName} />
      
      <Container className="pt-10 pb-10">

        <div className="flex flex-col gap-4 mb-6">
          {projectName && (
            <div className="text-primary flex items-center gap-3 rounded-full font-medium text-2xl lg:text-3xl">
              <Building2 className="w-6 h-6 lg:w-8 lg:h-8" />
              {projectName.toUpperCase()}
            </div>
          )}

          <div className="flex flex-col gap-2">
              <PageTitle className='text-xl lg:text-2xl font-bold text-foreground'>{title || t('app.title')}</PageTitle>
              <p className='text-sm lg:text-md font-light text-muted-foreground'>{t('app.description')}</p>
              
          </div>
        </div>

        <main className="space-y-12">
          {children}
        </main>
      </Container>
      
      {notification && (
        <Notification
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={notification.onClose}
        />
      )}
    </div>
  );
} 