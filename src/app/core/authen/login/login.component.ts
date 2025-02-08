import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule ,Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  test: any;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], // Email hoặc số điện thoại
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false], // Checkbox "Nhớ mật khẩu"
    });
  }

  onLogin() {
    alert('Đăng nhập thành công');
    this.router.navigate(['/dashboard']);
  }

  onForgotPassword() {
    console.log('Chuyển hướng đến trang quên mật khẩu');
  }

  onRegister() {
    console.log('Chuyển hướng đến trang đăng ký');
  }

  loginWith(provider: string) {
    console.log(`Đăng nhập với ${provider}`);
  }
}
