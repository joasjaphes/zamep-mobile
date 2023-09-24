/**
 * Function to get name initials
 * @param {string} string
 */
export default function getInitials(string = '') {
  let initials = [...string.matchAll(/(\p{L}{1})\p{L}+/gu)] || [];

  initials = (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase();

  return initials;
}
