import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [NgIf, ReactiveFormsModule] 
})


export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    console.log("1");
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;


      this.authService.signup({ name, email, password }).subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        error => {
          this.errorMessage = 'Greška pri registraciji. Pokušajte ponovo.';
          console.error(error);
        }
      );
    }
  }
}
