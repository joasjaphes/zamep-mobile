import {
  createContext, useContext, useMemo, useState,
} from 'react';
import i18n from './i18n';

const LocalizationContext = createContext({
  t: () => '',
});

/**
 * Localization context
 * @returns {{ t: (scope: any, options: any) => any,
 *  locale: string, setLocale: () }}
 */
export const useLocalization = () => useContext(LocalizationContext);

export default function LocalizationProvider({ children }) {
  const [locale, setLocale] = useState(i18n.locale);

  const Localizations = useMemo(() => ({
    t: (scope, options) => i18n.t(scope, { locale, ...options }),
    locale,
    setLocale,
  }), [locale]);

  return (
    <LocalizationContext.Provider value={Localizations}>
      {children}
    </LocalizationContext.Provider>
  );
}
