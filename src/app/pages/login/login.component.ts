import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
 public img :any ='https://thekland.com/assets/images/logo.png' ;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid credentials';
      return;
    }

    const { email, password } = this.loginForm.value;

    // ✅ 1. Try API login
    this.auth.login(email, password).subscribe({
      next: (res) => {
        if (res && res.status === 1 && res.data) {
          localStorage.setItem('user', JSON.stringify(res.data));
          if (res.data?.sessionToken) {
            localStorage.setItem('token', res.data.sessionToken);
          }
          this.router.navigate(['/account']);
        } else {
          this.checkLocalUser(email, password);
        }
      },
      error: () => {
        // ✅ 2. If API fails → fallback to local users
        this.checkLocalUser(email, password);
      }
    });
  }

  private checkLocalUser(email: string, password: string) {
    const stored = localStorage.getItem('registeredUsers');
    if (stored) {
      const users = JSON.parse(stored);
      const matchedUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (matchedUser) {
        // Save active session user
        localStorage.setItem('user', JSON.stringify(matchedUser));
        this.router.navigate(['/account']);
      } else {
        this.errorMessage = 'Invalid email or password';
      }
    } else {
      this.errorMessage = 'No registered users found. Please register first.';
    }
  }
}
