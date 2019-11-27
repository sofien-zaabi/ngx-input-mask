

export const maskPatterns = {
  'A': /[a-zA-Z]/,
  '0': /\d/,
  '9': /\d/,
  'y': /\d/,
  'd': /\d/,
  'm': /\d/,
  'M': /\d/,
  'h': /\d/,
  's': /\d/,
  '?': /\w/
};

export const monthDaysMax = {
  '01': 31,
  '02': 29,
  '03': 31,
  '04': 30,
  '05': 31,
  '06': 30,
  '07': 31,
  '08': 31,
  '09': 30,
  '10': 31,
  '11': 30,
  '12': 31
};


export const maskSpecialChars = ['-', '/', '(', ')', '.', ':', ' ', '+', ',', '@', '[', ']', '"', "'"];

export const dateTimeMasks: string[] = ['d0/M0/0000', 'd0/M0', 'M0/d0/0000', 'M0/d0', 'Hh:m0:s0', 'Hh:m0', 'm0:s0'];