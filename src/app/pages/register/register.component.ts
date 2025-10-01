import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registerUser() {
    if (this.form.invalid) {
      this.error = 'Please fill all fields correctly';
      return;
    }

    const newUser = this.form.value;

    //  Load existing users from localStorage 
    let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // Check if email already exists
    const exists = users.find((u: any) => u.email === newUser.email);
    if (exists) {
      this.error = 'User already registered with this email';
      return;
    }

    // Add new user
    users.push(newUser);

    // Save back as JSON
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    alert('User registered successfully!');
    this.router.navigate(['/login']);
  }
}
