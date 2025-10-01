import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  message = '';
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.error = 'Please enter a valid email address';
      return;
    }

    this.auth.forgotPassword(this.form.value.email).subscribe({
      next: () => {
        this.message = 'Password reset link sent to your email!';
        this.error = '';
      },
      error: () => {
        this.error = 'Failed to send reset link. Try again.';
        this.message = '';
      }
    });
  }
}
