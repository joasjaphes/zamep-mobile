import { I18n } from 'i18n-js';

import en from './en';
import sw from './sw';

// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n({ en, 'en-US': en, sw });

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;
i18n.fallbacks = true;
// Set the locale once at the beginning of your app.
// i18n.locale = Localization.locale; // gets locale from phone
i18n.locale = 'sw';
i18n.defaultLocale = 'sw';

export default i18n;
