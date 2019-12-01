import { Injectable } from '@angular/core';
import { maskPatterns, monthDaysMax, maskSpecialChars, dateTimeSeparators } from './mask.config';

@Injectable()
export class MaskService {

  
  shiftSteps: number = 0;
  maskValue: any;
  maskSpecialChars : string[] = maskSpecialChars;
  dateTimeSeparators: string[] = dateTimeSeparators;
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
        if (mask[pos - 1] === 'm' || mask[pos - 1] === 's') {
          if (Number(value.slice(pos - 1, pos + 1)) > 59) {
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

  
  autoCompleteDate(value: string, mask: string) {
    if (value) {
      let result: Array<any> = new Array(3);
      const d = new Date();
      const monthIdx: number | null = mask ? mask.indexOf('M') : null;
      const dayIdx: number | null = mask ? mask.indexOf('d') : null;
      const yearIdx: number | null = mask ? mask.indexOf('y') : null;
      const sepChar: string | null = dayIdx > -1 && monthIdx > -1 && mask[dayIdx + 2] === mask[monthIdx + 2] ? mask[dayIdx + 2] : null;
      if (yearIdx > -1 && (!value.slice(yearIdx, yearIdx + 4) || value.slice(yearIdx, yearIdx + 4).trim().length < 4)) {
        result[2] = d.getFullYear();
        if (monthIdx > -1 && !value.slice(monthIdx, monthIdx + 2)) {
          monthIdx === 0 ? result[0] = d.getMonth() : result[1] = d.getMonth();
        } else {
          const monthVal = value.slice(monthIdx, monthIdx + 2).trim().length == 1 ? "0" + value.slice(monthIdx, monthIdx + 2) : value.slice(monthIdx, monthIdx + 2);
          monthIdx === 0 ? result[0] = monthVal : result[1] = monthVal;
        }
        if (dayIdx > -1 && !value.slice(dayIdx, dayIdx + 2)) {
          dayIdx === 0 ? result[0] = d.getDate() : result[1] = d.getDate();
        } else {
          const DayVal = value.slice(dayIdx, dayIdx + 2).trim().length == 1 ? "0" + value.slice(dayIdx, dayIdx + 2) : value.slice(dayIdx, dayIdx + 2);
          dayIdx === 0 ? result[0] = DayVal : result[1] = DayVal;
        }
          return sepChar ? result.join(sepChar).trim() : value;
      } else
         return value;
    }
  }

  timeAutoComplete(value: string, mask: string) {
    // TO DO 
    return value;
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
