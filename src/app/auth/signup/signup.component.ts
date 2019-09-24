import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form : FormGroup ;
  isLoading = false;
  constructor() { }

  ngOnInit() {

    this.form = new FormGroup({
      'email': new FormControl(null,{validators:[Validators.required, Validators.email]}),
      'password' : new FormControl(null,{validators:[Validators.required, Validators.minLength(6)]}),
    })
  }

  signUp(){
    if(!this.form.valid) return;
    console.log("Submitted login details are "+JSON.stringify(this.form.value));
  }

}
