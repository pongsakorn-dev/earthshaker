import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from './ui/layout';
import { H1, H2, Paragraph } from './ui/typography';

export interface NotFoundProps {
  projectMapping: Record<string, string>;
}

const NotFound: React.FC<NotFoundProps> = ({ projectMapping }) => {
  const { t: originalT } = useTranslation();
  const t = originalT as unknown as (key: string, options?: any) => string;
  
  return (
    <Container className="min-h-screen flex flex-col items-center justify-center py-16">
      <H1 className="mb-4 text-4xl">404</H1>
      <H2 className="mb-6 text-center">{t('notFound.projectNotFound')}</H2>
      <Paragraph className="text-muted-foreground mb-8 text-center">
        {t('notFound.checkUrl')}
      </Paragraph>
    </Container>
  );
};

export default NotFound; 