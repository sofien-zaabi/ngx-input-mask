import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-input-mask-app';

  reactiveDateForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.reactiveDateForm = this.formBuilder.group({
      date: ["05045454", Validators.required]
    });
    setTimeout(() => console.log("ngOnInit dateForm value", this.reactiveDateForm.get('date').value))
  }

  reactiveFormChange(value: string) {
    console.log("reactiveFormChange change value", value);
    console.log("reactiveFormChange date value", this.reactiveDateForm.get('date').value);
  } 

}
