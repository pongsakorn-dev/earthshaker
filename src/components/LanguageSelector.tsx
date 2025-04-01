import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { Building2 } from 'lucide-react';

interface LanguageSelectorProps {
  projectName?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ projectName }) => {
  const { t: originalT, i18n } = useTranslation();
  const t = originalT as unknown as (key: string, options?: any) => string;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className=" ml-4 mt-4 mr-4 z-50 flex justify-end items-center gap-4">
      
      <div className="flex rounded-md shadow-sm">
        <Button
          onClick={() => changeLanguage('en')}
          size="sm"
          variant={i18n.language === 'en' ? 'default' : 'outline'}
          className={cn(
            "rounded-r-none text-md font-normal",
            i18n.language === 'en' ? '' : 'hover:bg-muted/80'
          )}
        >
          {t('language.english')}
        </Button>
        <Button
          onClick={() => changeLanguage('th')}
          size="sm"
          variant={i18n.language === 'th' ? 'default' : 'outline'}
          className={cn(
            "rounded-l-none text-md font-normal",
            i18n.language === 'th' ? '' : 'hover:bg-muted/80'
          )}
        >
          {t('language.thai')}
        </Button>
      </div>
    </div>
  );
};

export default LanguageSelector; 