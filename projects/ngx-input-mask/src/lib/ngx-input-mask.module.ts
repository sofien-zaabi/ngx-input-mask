import { NgModule } from '@angular/core';
import { MaskDirective } from './mask.directive';
import { FormsModule } from '@angular/forms';
import { MaskService } from './mask.service';



@NgModule({
  declarations: [MaskDirective ],
  providers: [MaskService],
  imports: [FormsModule],
  exports: [MaskDirective]
})
export class NgxInputMaskModule { }
