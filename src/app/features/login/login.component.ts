import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { NgIf, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [NgIf, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        if (this.isBrowser) {
          localStorage.setItem('token', response.token);
        }
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login greška:', err);
        this.errorMessage = 'Neispravan email ili lozinka. Pokušajte ponovo.';
      }
    });
  }
}
