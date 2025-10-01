import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: any;
  form!: FormGroup;
  message = '';
  error = '';
  isEditing = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);

      this.form = this.fb.group({
        firstName: [this.user.firstName, Validators.required],
        lastName: [this.user.lastName, Validators.required],
        email: [this.user.email, [Validators.required, Validators.email]],
        phoneCode: [this.user.phoneCode, Validators.required],
        phone: [this.user.phone, Validators.required],
        oldPassword: [''],
        newPassword: [''],
        confirmPassword: ['']
      });

      // form disabled by default
      this.form.disable();
    } else {
      this.router.navigate(['/login']);
    }
  }

  enableEdit() {
    this.isEditing = true;
    this.form.enable();
  }

  disableEdit() {
    this.isEditing = false;
    this.form.disable();
  }

  saveProfile() {
    if (this.form.invalid) {
      this.error = 'Please fill all required fields';
      this.message = '';
      return;
    }

    // Password change validation only if fields are filled
    if (this.form.value.oldPassword || this.form.value.newPassword || this.form.value.confirmPassword) {
      if (this.form.value.oldPassword !== this.user.password) {
        this.error = 'Old password is incorrect';
        this.message = '';
        return;
      }

      if (this.form.value.newPassword.length < 6) {
        this.error = 'New password must be at least 6 characters long';
        this.message = '';
        return;
      }

      if (this.form.value.newPassword !== this.form.value.confirmPassword) {
        this.error = 'New password and Confirm password do not match';
        this.message = '';
        return;
      }
    }

    const updatedUser = {
      ...this.user,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      phoneCode: this.form.value.phoneCode,
      phone: this.form.value.phone,
      password: this.form.value.newPassword
        ? this.form.value.newPassword
        : this.user.password,
      image: this.user.image || ''
    };

    // update registeredUsers array
    let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    users = users.map((u: any) => (u.email === this.user.email ? updatedUser : u));
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    // update current session
    localStorage.setItem('user', JSON.stringify(updatedUser));
    this.user = updatedUser;

    this.message = 'Profile updated successfully!';
    this.error = '';
    this.isEditing = false;
    this.form.disable();

    this.form.patchValue({ oldPassword: '', newPassword: '', confirmPassword: '' });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      this.uploadImage(base64Data);
    };
    reader.readAsDataURL(file);
  }

  uploadImage(base64Data: string) {
    const apiKey = '7f01eebb43d9f949f0fdddd3a4843396';
    const formData = new FormData();
    formData.append('image', base64Data);

    fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(result => {
        if (result && result.success) {
          const imageUrl = result.data.url;
          this.user.image = imageUrl;

          localStorage.setItem('user', JSON.stringify(this.user));
          this.message = 'Profile image updated successfully!';
        } else {
          this.error = 'Image upload failed: ' + (result?.error?.message || 'Unknown error');
        }
      })
      .catch(err => {
        this.error = 'Image upload error: ' + err.message;
      });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete this account?')) {
      const stored = localStorage.getItem('registeredUsers');
      if (stored) {
        let users = JSON.parse(stored);
        users = users.filter((u: any) => u.email !== this.user.email);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
      }

      localStorage.removeItem('user');
      localStorage.removeItem('token');

      alert('Account deleted successfully');
      this.router.navigate(['/login']);
    }
  }
}
