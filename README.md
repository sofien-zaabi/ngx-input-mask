# NgxInputMask

Angular 4/6/8 input mask directive for web applications. Easy to integrate and use.
It's not a plugin and there's no NPM module for it.
I created this directive to meet our needs in some projects and i published here, maybe it will help someone else.
Originaly, it's build for dateTime input mask and then i made it for all input formatting mask purpose.
It has a unique feature for dateTime input mask: autoCompletion of input field with current date and time.

### Installation
- `npm install` to install all dependecies 
- create the package :
 `npm run package` do the following :
 -  Builds ngx-input-mask to the directory  'dist/ngx-input-mask'
 -  Uses npm pack to create ngx-input-mask as an npm package in that directory: 'ngx-input-mask-0.0.1.tgz'
- Install the package :
    `npm install /path-to/ngx-input-mask-0.0.1.tgz ` // located in dist folder

- Once installed import `NgxInputMaskModule` from the installed package into your module as follows:

## Quickstart

Import **ngx-input-mask** module in Angular app.

```typescript
import { NgxInputMaskModule } from 'ngx-input-mask'


@NgModule({
  (...)
  imports: [
    NgxInputMaskModule
  ]
  (...)
})
```

Then, just define masks in inputs.

### Usage

```html
<input type="text" mask="{put your mask here}" />
```

#### Examples

| mask           | example        |
| -------------- | -------------- |
| dd/MM/yyyy     | 09/11/2019     |
| 9999-99-99     | 1689-08-23     |
| (000) 000-0000 | (216) 546-9856 |
| 000.000.000-99 | 048.457.987-98 |
| AAAA-99        | uhbg-56        |
| ????+000       | h95y+569       |


### maskSpecialChars (string[ ])

default special characters:

   | character |
   |-----------|
   | - |
   | / |
   | ( |
   | ) |
   | . |
   | : |
   | **space** |
   | + |
   | , |
   | @ |
   | [ |
   | ] |
   | " |
   | ' |

#### Usage

```html
<input type="text" [specialCharacters]="[ '[' ,']' , '\\' ]" mask="[99]\[AAA]" />
```

##### Then

```text
Input value: 78azr
Masked value: [78]\[azr]
```

```typescript
patterns ({ [character: string]: RegExp})
```

Default patterns:

  | code  | meaning                                     |
  | ----- | ------------------------------------------- |
  | **A** | letters (uppercase or lowercase)            |
  | **0** | digits (like 0 to 9 numbers)                |
  | **9** | digits (like 0 to 9 numbers)                |
  | **y** | digits (like 0 to 9 numbers)                |
  | **d** | digits (like 0 to 9 numbers)                |
  | **M** | digits (like 0 to 9 numbers)                |
  | **h** | digits (like 0 to 9 numbers)                |
  | **m** | digits (like 0 to 9 numbers)                |
  | **s** | digits (like 0 to 9 numbers)                |
  | **?** | letters (uppercase or lowercase) and digits |

##### Usage

```html
<input type="text" [patterns]="customPatterns" mask="(BBB-BB)" />
```

and in your component

```typescript
public customPatterns = { 'B': new RegExp('\[a-zA-Z]') };
```

##### Then

```text
Input value: 789HelloWorld
Masked value: (Hel-lo)
```

### Custom pattern 

You can define custom pattern and specify symbol to be rendered in input field.
the custom pattern must be valid: the symbole must contain one character and the value must be RegExp object.

```typescript
pattern = {
  'B': new RegExp('\\d')
}
```

### keepMask (boolean : true )

keep or remove mask special characters from input formcontrol value.

#### Usage

```html
<input type="text" keepMask="false" mask="[99]\[AAA]" />
```

##### Then

```text
Input value: 08/08/2019
FormControl value: 08082019
```

### DateTime Autocomplete feature

You can enable dateTime autocomplete feature and specify a valid datetime mask.
the mask you specify must be exist in date and time valid mask table below (if the mask is  a dateTime then you must ensure the date part and the time part are valid and also the dateTime separator exist in the table below).
for time mask there's 3 autocomplete options():
- **h0:m0:s0** => will compplete the missing parts with zero. 
- **hh:mm:ss** => will compplete the missing parts with current time value. 
- **h9:m9:s9** => will compplete the missing parts with max value. 

#### Usage

```html
<input type="text" mask="MM/dd/yyyyTh0:m0:s0" dateAutoComplete="true" />
```

##### Then

```text
Input value: 08/08
Masked value: 08/08/2020T00:00:00
```

```html
<input type="text" mask="MM/dd/yyyyThh:mm:ss" dateAutoComplete="true" />
```

##### Then

```text
Input value: 08/08
Masked value: 08/08/2020T18:14:47
```

```html
<input type="text" mask="MM/dd/yyyyTh9:m9:s9" dateAutoComplete="true" />
```

##### Then

```text
Input value: 08/08
Masked value: 08/08/2020T23:59:59
```

default DateTime separator :

   | character |
   |-----------|
   | **T** |
   | **space** |

List of valid date mask for autocomplete :

   | Mask |
   |-----------|
   | **dd/MM/yyyy** |
   | **dd/MM** |
   | **MM/dd/yyyy** |
   | **MM/dd** |
   | **d0/M0/y000** |
   | **d0/M0** |
   | **M0/d0/y000** |
   | **M0/d0** |
   | **d9/M9/y999** |
   | **d9/M9** |
   | **M9/d9/y999** |
   | **M9/d9** |

List of valid time mask for autocomplete :

   | Mask |
   |-----------|
   | **hh:mm:ss** |
   | **hh:mm** |
   | **mm:ss** |
   | **h9:m9:s9** |
   | **h9:m9** |
   | **m9:s9** |
   | **h0:m0:s0** |
   | **h0:m0** |
   | **m0:s0** |

## Run locally
- Clone the repository or downlod the .zip,.tar files.
- Run `ng serve ngx-input-mask-app` for a dev server
- Navigate to `http://localhost:4200/`
 The app will automatically reload if you change any of the source files.

## License
MIT License.
