import 'react-i18next';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    // custom namespace type
    defaultNS: 'translation';
    // custom resources type
    resources: {
      translation: typeof import('../translations/en.json');
    };
  }

  // เพิ่ม type definition สำหรับ useTranslation hook
  export function useTranslation(ns?: string | string[], options?: any): {
    t: (key: string, options?: any) => string;
    i18n: any;
    ready: boolean;
  };
} 