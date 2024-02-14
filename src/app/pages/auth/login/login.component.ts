import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {URLs} from '../../../config/urls';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
  
  ) { 
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    })
  }

  ngOnInit(): void {
    
  }

  get lc(){
    return this.loginForm?.controls;
  }

  login(){
    if(this.loginForm?.invalid){
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm?.controls[key].markAsTouched()
      })

      return;
    }
    this.router.navigateByUrl(URLs.DASHBOARD_URL);
  }
  ngOnDestroy(): void {
    
  }

}
