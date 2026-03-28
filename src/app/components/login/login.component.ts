import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>OV Film - Content Manager</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="admin@ovfilm.com"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              required
            />
          </div>
          <p class="error" *ngIf="error">{{ error }}</p>
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Iniciando sesion...' : 'Iniciar sesion' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: #1a1a1a;
      }
      .login-card {
        background: #2a2a2a;
        padding: 2rem;
        border-radius: 8px;
        width: 100%;
        max-width: 400px;
        color: #fff;
      }
      h2 {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      .form-group {
        margin-bottom: 1rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }
      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #444;
        border-radius: 4px;
        background: #333;
        color: #fff;
        font-size: 1rem;
        box-sizing: border-box;
      }
      button {
        width: 100%;
        padding: 0.75rem;
        border: none;
        border-radius: 4px;
        background: #c9a96e;
        color: #1a1a1a;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        margin-top: 0.5rem;
      }
      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .error {
        color: #ff6b6b;
        font-size: 0.85rem;
        margin: 0.5rem 0;
      }
    `,
  ],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/ES']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Credenciales incorrectas';
        console.error('Login error:', err);
      },
    });
  }
}
