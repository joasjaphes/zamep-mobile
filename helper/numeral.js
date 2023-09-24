export function format(number = '') {
  return String(number).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

/**
 * format digits to asterisks
 * @param {string|number} digits
 * @returns {string}
 */
export function hideDigits(digits = '') {
  return String(digits).replace(/./g, '*').substring(0, 10);
}

export function slicePhone(mobile = '') {
  return `0${mobile.slice(-9)}`;
}

export function formatPhone(mobile = '') {
  const match = mobile.match(/^(\d{3})(\d{3})(\d{3})(\d{3})$/);
  if (match) {
    return `0${match[2]} ${match[3]} ${match[4]}`;
  }
  return '';
}

export function formatDate(date = new Date()) {
  let dateObject = date;
  if (typeof date === 'string') {
    dateObject = new Date(date);
  }
  return dateObject.toLocaleDateString('en-US');
}

export function formatTime(date = new Date()) {
  let dateObject = date;
  if (typeof date === 'string') {
    dateObject = new Date(date);
  }
  return dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function isSameDay(day1 = new Date(), day2 = new Date()) {
  let firstDate = day1;
  let secondDate = day2;
  if (typeof day1 === 'string') {
    firstDate = new Date(day1);
  }
  if (typeof day2 === 'string') {
    secondDate = new Date(day2);
  }
  return (firstDate.getUTCFullYear() === secondDate.getUTCFullYear()
  && firstDate.getUTCMonth() === secondDate.getUTCMonth()
  && firstDate.getUTCDate() === secondDate.getUTCDate());
}

export function diffDays(day1 = new Date(), day2 = new Date()) {
  let firstDate = day1;
  let secondDate = day2;
  if (typeof day1 === 'string') {
    firstDate = new Date(day1);
  }
  if (typeof day2 === 'string') {
    secondDate = new Date(day2);
  }
  return Math.ceil(Math.abs(firstDate - secondDate) / (1000 * 60 * 60 * 24));
}
