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
  | **0** | digits (like 0 to 9 numbers)                |
  | **9** | digits (like 0 to 9 numbers)                |
  | **A** | letters (uppercase or lowercase)            |
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

### Custom pattern for this

You can define custom pattern and specify symbol to be rendered in input field.
the custom pattern must be valid: the symbole must contain one character and the value must be RegExp object.

```typescript
pattern = {
  'B': new RegExp('\\d')
}
```

## Run locally
- Clone the repository or downlod the .zip,.tar files.
- Run `ng serve ngx-input-mask-app` for a dev server
- Navigate to `http://localhost:4200/`
 The app will automatically reload if you change any of the source files.

## License
MIT License.
