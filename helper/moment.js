import { humanizer } from 'humanize-duration';

const humanizeDuration = humanizer({
  languages: {
    'short-en': {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms',
    },
    'short-sw': {
      y: () => 'mwa',
      mo: () => 'mwe',
      w: () => 'w',
      d: () => 'siku',
      h: () => 'saa',
      m: () => 'd',
      s: () => 'sk',
      ms: () => 'ms',
    },
  },
});
export { humanizeDuration };

/**
 * Get humanized short duration
 * @param {date} dateTime JS Date
 * @param {string} language locale short code
 * @returns {string}
 */
export function shortDuration(dateTime = new Date(), language = 'sw') {
  const duration = new Date() - dateTime;

  return humanizeDuration(duration, { largest: 1, language: `short-${language}`, spacer: '' });
}
