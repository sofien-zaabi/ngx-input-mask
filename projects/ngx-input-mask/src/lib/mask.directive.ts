import {Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';
import {NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor} from '@angular/forms';
import { MaskService } from './mask.service';
import { dateMasks, timeMasks } from './mask.config';
import { isNumber } from 'util';

const noop = () => {};

@Directive({
  selector: '[mask]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: MaskDirective, multi: true },
    { provide: NG_VALIDATORS, useExisting: MaskDirective, multi: true },
    MaskService
  ]
})
export class MaskDirective implements ControlValueAccessor, OnChanges {

  @Input() public mask: any;
  @Input() public maskSpecialChars: string[] = [];
  @Input() public patterns: {} = {};
  @Input() public dateAutoComplete: boolean;

  private value: string = null;
  private displayValue: string = null;
  private key: string;

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (a: any) => void = noop;

  constructor(private elem: ElementRef, private maskService: MaskService, private renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("ngOnChanges ", changes);
    const {mask, maskSpecialChars, patterns, dateAutoComplete} = changes;
    if (mask) {
      this.maskService.maskValue = mask.currentValue || '';
    }
    if (maskSpecialChars) {
      if (Array.isArray(maskSpecialChars.currentValue)) {
        if(maskSpecialChars.currentValue.every(char => typeof char === "string" && char.length === 1)) {
          this.maskService.maskSpecialChars = maskSpecialChars.currentValue;
        } else throw new TypeError("each element of maskSpecialChars array must be a string and must contain only 1 character");
      } else throw new TypeError("maskSpecialChars must be an array of string");
    }
    // Only overwrite the mask patterns if a valid pattern has actually been passed in
    if (patterns && patterns.currentValue) {
      if(typeof patterns.currentValue === "object") {
        if(Object.entries(patterns.currentValue).every(entry => typeof entry[0] === "string" && entry[0].length === 1 && !this.maskService.maskSpecialChars.includes(entry[0]) && entry[1] instanceof RegExp)) {
          this.maskService.maskPatterns = patterns.currentValue;
        } else throw new TypeError("each property name of patterns object must be a character that don't exist in maskSpecialChars array (or you must override maskSpecialChars) and the value must be RegExp object")
      } else throw new TypeError("patterns must be an object");
    }
    if (dateAutoComplete) {
      this.dateAutoComplete = dateAutoComplete.currentValue;
    }
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.displayValue) {
      this.displayValue = this.maskService.applyMask(value, this.maskService.maskValue );
      if (this.displayValue) {
        this.renderer.setProperty(this.elem.nativeElement, 'value', this.displayValue);
      }
    }
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  @HostListener('input', ['$event'])
  public onInput(event: { target: { value?: string } }): void {
    let elem: HTMLInputElement = event.target as HTMLInputElement;
    let value: string = elem.value;
    if (!this.maskService.maskValue ) {
      return;
    }
    this.maskService.shiftSteps = 0;
    const position: number = (elem.selectionStart as number);
    this.onValueChange(value);
    elem.selectionStart = elem.selectionEnd = this.maskService.shiftSteps !== null ? position + (this.key === 'Backspace' ? 0 : this.maskService.shiftSteps) : position;
  }

  @HostListener('keydown', ['$event'])
  public a(e: KeyboardEvent): void {
    const el: HTMLInputElement = e.target as HTMLInputElement;
    this.key = e.key;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'delete') {
      const cursorStart: number | null = el.selectionStart;
      this.onFocus(e);
      if ((e.key === 'Backspace' || e.key === 'delete') && cursorStart === 0 && el.selectionEnd === el.value.length) {
        //this._position =  1;
      }
    }
  }

  @HostListener('blur', ['$event'])
  public onBlur(e: Event): void {
    const el: HTMLInputElement = e.target as HTMLInputElement;
  }

  @HostListener('change', ['$event'])
  public onChange(e: Event): void {
    const elem: HTMLInputElement = e.target as HTMLInputElement;
    let value: string = elem.value;
    if(value && this.maskService.maskValue ) {
      if(this.dateAutoComplete) {
        let dateTimeSep: string | undefined = this.maskService.dateTimeSeparators.find(separator => this.maskService.maskValue.trim().includes(separator));
        let maskParts: any = this.maskService.maskValue;
        let dateParts, dateIdx, timeIdx: any;
        if(dateTimeSep) {
          maskParts = this.maskService.maskValue.split(dateTimeSep);
          dateParts = new Array(maskParts.length);
          dateIdx = Array.isArray(maskParts) ? maskParts.findIndex(part => dateMasks.includes(part)) : null;
          timeIdx = Array.isArray(maskParts) ? maskParts.findIndex(part => timeMasks.includes(part)) : null;
        }
        if(isNumber(dateIdx) && dateIdx > -1 && isNumber(timeIdx) && timeIdx > -1) {
          dateParts[dateIdx] = this.maskService.autoCompleteDate(value, maskParts[dateIdx]);
          dateParts[timeIdx] = this.maskService.timeAutoComplete(value, maskParts[timeIdx]);
        } else if (dateMasks.includes(maskParts)) {
          dateParts = this.maskService.autoCompleteDate(value, maskParts);
        } else if(timeMasks.includes(maskParts)) {
          dateParts = this.maskService.timeAutoComplete(value, maskParts);
        }
        value = dateTimeSep ?  dateParts.join(dateTimeSep).slice(0, this.maskService.maskValue.length) : dateParts ? dateParts : value;
      }
      this.onValueChange(value);
    }
  }

  @HostListener('click', ['$event'])
  public onFocus(e: MouseEvent | KeyboardEvent): void {
    const el: HTMLInputElement = e.target as HTMLInputElement;
    if (
      el !== null &&
      el.selectionStart !== null &&
      el.selectionStart === el.selectionEnd
    ) {
      if (el.setSelectionRange) {
        el.focus();
        el.setSelectionRange(el.selectionStart, el.selectionEnd);
      }
    }
  }

  /* private updateValue(value: string) {
    this.value = value;
    MaskDirective.delay().then(
     // () => this.ngControl.control.updateValueAndValidity()
    );
  } */

  /* private defineValue() {
    let value: string = this.value;
    let displayValue: string = null;

    if (this.maskService.maskValue ) {
      if (value != null) {
        displayValue = this.maskService.applyMask(value, this.maskService.maskValue );
      }
    } else {
      displayValue = this.value;
    }

    MaskDirective.delay().then(() => {
      if (this.displayValue !== displayValue) {
        this.displayValue = displayValue;
        //this.ngControl.control.setValue(displayValue);
        return MaskDirective.delay();
      }
    }).then(() => {
      if (value != this.value) {
        //return this.updateValue(value);
      }
    });
  } */

  private onValueChange(newValue: string) {
    if (newValue !== null && newValue !== undefined && newValue.trim() !== "" && newValue !== this.displayValue) {
      this.displayValue = newValue;
      if (this.maskService.maskValue ) {
        this.displayValue = this.maskService.applyMask(newValue, this.maskService.maskValue );
      }
      this.renderer.setProperty(this.elem.nativeElement, "value", this.displayValue);
      this.value = this.maskService.unmask(newValue, this.maskService.maskValue );
    }
  }

  /*private static processValue(displayValue: string, mask: string, keepMask: boolean) {
    let value = keepMask ? displayValue : MaskDirective.unmask(displayValue, mask);
    return value
  }*/

  





  /* private static delay(ms: number = 0): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => null);
  } */

}
