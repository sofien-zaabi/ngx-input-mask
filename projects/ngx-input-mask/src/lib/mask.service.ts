import { Injectable } from '@angular/core';
import { maskPatterns, monthDaysMax, maskSpecialChars } from './mask.config';

@Injectable()
export class MaskService {

  
  shiftSteps: number = 0;
  maskValue: any;
  maskSpecialChars : string[] = maskSpecialChars;
  maskPatterns: {} = maskPatterns;
  constructor() { }

  applyMask(value: string, mask: string): string {
    value = value.toString();
    let len = value.length;
    let maskLen = mask.length;
    let pos = 0;
    let result = '';

    for (let i = 0; i < Math.min(len, maskLen); i++) {
      //let maskSymbol = mask.charAt(pos);
      const inputChar = value.charAt(i);

      if (this.checkMaskChar(inputChar, mask[pos])) {
        // pos++;
        // if (regex.test(inputChar)) {
        if (mask[pos] === 'h') {
          if (Number(inputChar) > 2) {
            result += 0;
            pos += 1;
            this.shiftSteps += 1;
            i--;
            continue;
          }
        }
        if (mask[pos - 1] === 'h') {
          if (Number(value.slice(pos - 1, pos + 1)) > 23) {
            continue;
          }
        }
        if (mask[pos] === 'm') {
          if (Number(inputChar) > 5) {
            result += 0;
            pos += 1;
            this.shiftSteps += 1;
            i--;
            continue;
          }
        }
        if (mask[pos] === 's') {
          if (Number(inputChar) > 5) {
            result += 0;
            pos += 1;
            this.shiftSteps += 1;
            i--;
            continue;
          }
        }
        if (mask[pos] === 'd') {
          if (Number(inputChar) > 3) {
            result += 0;
            pos += 1;
            this.shiftSteps += 1;
            i--;
            continue;
          }
        }
        if (mask[pos - 1] === 'd') {
          if (Number(value.slice(pos - 1, pos + 1)) > 31) {
            continue;
          } else if (value.slice(pos - 1, pos + 1).length === 2 && Number(value.slice(pos - 1, pos + 1)) === 0) {
            result += 1;
            pos += 1;
          }
        }
        if (mask[pos] === 'M') {
          if (Number(inputChar) > 1) {
            result += 0;
            pos += 1;
            this.shiftSteps += 1;
            i--;
            continue;
          }
        }
        if (mask[pos - 1] === 'M') {
          if (Number(value.slice(pos - 1, pos + 1)) > 12) {
            continue;
          } else if (value.slice(pos - 1, pos + 1).length === 2 && Number(value.slice(pos - 1, pos + 1)) === 0) {
            result += 1;
            pos += 1;
            continue;
          }
        }
        result += inputChar;
        pos++;
        /*} else {
          i--;
          len--;
		  this._position--;
        }*/
      } else if (this.maskSpecialChars.indexOf(mask[pos]) !== -1) {
        if (mask[pos] === inputChar) {
          result += mask[pos];
          pos += 1;
          //this.shiftSteps += 1;
        } else {
          result += mask[pos];
          pos += 1;
          this.shiftSteps += 1;
          i--;
        }
      }
      /*else {
               i--;
               //len--;
               this.shiftSteps -= 1;
             }*/
    }
    if(this.maskValue.indexOf('d0') > -1 && this.maskValue.indexOf('M0') > -1) {
      return this.monthMaxDays(result, this.maskValue);
    } else return result;
    
  }

  monthMaxDays(value: string, mask: string) {
    if (value !== null && value !== undefined && value !== '') {
      const monthIndex: number | null = mask ? mask.indexOf('M') : null;
      const dayIndex: number | null = mask ? mask.indexOf('d') : null;
      if (monthIndex > -1 && dayIndex > -1) {
        let days: string | null = value.slice(dayIndex, dayIndex + 2) ? value.slice(dayIndex, dayIndex + 2) : null;
        const month: string | null = value.slice(monthIndex, monthIndex + 2) ? value.slice(monthIndex, monthIndex + 2) : null;
        if (days && days.length === 2 && month && month.length === 2) {
          return Number(days) > monthDaysMax[month] ? dayIndex === 0 ? monthDaysMax[month] + value.slice(dayIndex + 2, value.length) : value.slice(0, dayIndex) + monthDaysMax[month] + value.slice(dayIndex + 2, value.length) : value;
        } else return value;
      }

    }
  }

  private checkMaskChar(inputChar: string, maskChar: string): boolean {
    const regex: RegExp = this.maskPatterns[maskChar];
    return ( regex && regex.test(inputChar));
  }

  
  unmask(maskedValue: string, mask: string): string {
    let maskLen = (mask && mask.length) || 0;
    return maskedValue.split('').filter(
      (currChar, idx) => (idx < maskLen) && this.maskPatterns.hasOwnProperty(mask[idx])
    ).join('');
  }


}
