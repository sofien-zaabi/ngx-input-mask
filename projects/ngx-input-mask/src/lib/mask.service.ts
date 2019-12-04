import { Injectable } from '@angular/core';
import { maskPatterns, monthDaysMax, maskSpecialChars, dateTimeSeparators } from './mask.config';
import { dateMasks, timeMasks } from './mask.config';
import { isNumber } from 'util';

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
      } else if (this.maskSpecialChars.indexOf(mask[pos]) !== -1 || this.dateTimeSeparators.indexOf(mask[pos]) !== -1) {
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

  dateTimeAutoComplete(value: string) {
    let dateTimeSep: string | undefined = this.dateTimeSeparators.find(separator => this.maskValue.trim().includes(separator));
        let maskParts: any = this.maskValue;
        let dateParts, dateIdx, timeIdx: any;
        if(dateTimeSep) {
          maskParts = this.maskValue.split(dateTimeSep);
          dateParts = value.split(dateTimeSep);
          dateIdx = Array.isArray(maskParts) ? maskParts.findIndex(part => dateMasks.includes(part)) : null;
          timeIdx = Array.isArray(maskParts) ? maskParts.findIndex(part => timeMasks.includes(part)) : null;
        }
        if(isNumber(dateIdx) && dateIdx > -1 && isNumber(timeIdx) && timeIdx > -1) {
          dateParts[dateIdx] = this.dateAutoComplete(dateParts[dateIdx], maskParts[dateIdx]);
          dateParts[timeIdx] = this.timeAutoComplete(dateParts[timeIdx], maskParts[timeIdx]);
        } else if (dateMasks.includes(maskParts)) {
          dateParts = this.dateAutoComplete(value, maskParts);
        } else if(timeMasks.includes(maskParts)) {
          dateParts = this.timeAutoComplete(value, maskParts);
        }
        value = dateTimeSep ?  dateParts.join(dateTimeSep).slice(0, this.maskValue.length) : dateParts ? dateParts : value;
        return value;
  }

  dateAutoComplete(value: string, mask: string) {
    if (value && mask) {
      const d = new Date();
      const monthIdx: number = mask.indexOf('M');
      const dayIdx: number = mask.indexOf('d');
      const yearIdx: number = mask.indexOf('y');
      const sepChar: string | undefined = dayIdx > -1 && monthIdx > -1 && maskSpecialChars.includes(mask[dayIdx + 2]) && mask[dayIdx + 2] === mask[monthIdx + 2] ? mask[dayIdx + 2] : undefined;
      const maskPartsCount: number = sepChar ? mask.split(sepChar).length : 3;
      let result: Array<any> = new Array(maskPartsCount);
      const year: string = value.slice(yearIdx, mask.indexOf(sepChar, yearIdx) > -1 ? mask.indexOf(sepChar, yearIdx) : mask.length);
      if (yearIdx > -1 && (!year || year.trim().length < 4)) {
        result[Math.trunc(yearIdx / maskPartsCount)] = d.getFullYear();
      } else {
        result[Math.trunc(yearIdx / maskPartsCount)] = year;
      }
      const month: string = value.slice(monthIdx, mask.indexOf(sepChar, monthIdx) > -1 ? mask.indexOf(sepChar, monthIdx) : mask.length);
      if (monthIdx > -1 && !month) {
        result[Math.trunc(monthIdx / maskPartsCount)] = d.getMonth();
      } else {
        result[Math.trunc(monthIdx / maskPartsCount)] = month && month.trim().length === 1 ? '0' + month : month;
      }
      const day: string = value.slice(dayIdx, mask.indexOf(sepChar, dayIdx) > -1 ? mask.indexOf(sepChar, dayIdx) : mask.length);
      if (dayIdx > -1 && !day) {
        result[Math.trunc(dayIdx / maskPartsCount)] = d.getDate();
      } else {
        result[Math.trunc(dayIdx / maskPartsCount)] = day && day.trim().length === 1 ? '0' + day : month;

      }
      value = sepChar ? result.join(sepChar).trim() : value;
    }
    return value;
  }

  timeAutoComplete(value: string, mask: string) {
    // TO DO 
    if(mask) {
      const d = new Date();
      const HIdx: number = mask.indexOf('h');
      const MIdx: number = mask.indexOf('m');
      const SIdx: number = mask.indexOf('s');
      const sepChar: string | undefined = HIdx > -1 && MIdx > -1 && maskSpecialChars.includes(mask[HIdx + 2]) && mask[HIdx + 2] === mask[MIdx + 2] ? mask[HIdx + 2] : undefined;
      const maskPartsCount: number = sepChar ? mask.split(sepChar).length : 3;
      let result: Array<any> = new Array(maskPartsCount);
      const hours: string = value && value.slice(HIdx, mask.indexOf(sepChar, HIdx) > -1 ? mask.indexOf(sepChar, HIdx) : mask.length);
      if(HIdx > -1 && (!value || !hours)) {
        result[Math.trunc(HIdx / maskPartsCount)] = d.getHours() === 0 ? '00' : d.getHours();
      } else {
        result[Math.trunc(HIdx / maskPartsCount)] = hours && hours.trim().length == 1 ? "0" + hours : hours;
      }
      const minutes: string = value && value.slice(MIdx, mask.indexOf(sepChar, MIdx) > -1 ? mask.indexOf(sepChar, MIdx) : mask.length);
      if (MIdx > -1 && (!value || !minutes)) {
        result[Math.trunc(MIdx / maskPartsCount)] = mask[MIdx + 1] === '0' ? '00' : d.getMinutes();
      } else {
        result[Math.trunc(MIdx / maskPartsCount)] = minutes && minutes.trim().length == 1 ? "0" + minutes : minutes;
      }
      const secondes = value && value.slice(SIdx, mask.indexOf(sepChar, SIdx) > -1 ? mask.indexOf(sepChar, SIdx) : mask.length);
      if (SIdx > -1 && (!value || !secondes)) {
        result[Math.trunc(SIdx / maskPartsCount)] = mask[SIdx + 1] === '0' ? '00' : d.getSeconds();
      } else {
        result[Math.trunc(SIdx / maskPartsCount)] = secondes && secondes.trim().length == 1 ? "0" + secondes : secondes;
      }
      value = sepChar ? result.join(sepChar).trim() : value;
    }
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
