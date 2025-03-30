import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const LanguageSelector: React.FC = () => {
  const { t: originalT, i18n } = useTranslation();
  const t = originalT as unknown as (key: string, options?: any) => string;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex rounded-md shadow-sm">
      <Button
        onClick={() => changeLanguage('en')}
        className={cn(
          "rounded-r-none px-3 py-1 text-sm",
          i18n.language === 'en' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
        )}
      >
        {t('language.english')}
      </Button>
      <Button
        onClick={() => changeLanguage('th')}
        className={cn(
          "rounded-l-none px-3 py-1 text-sm",
          i18n.language === 'th' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
        )}
      >
        {t('language.thai')}
      </Button>
    </div>
  );
};

export default LanguageSelector; 