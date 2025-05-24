import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink, 
    RouterOutlet,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,

  ],
  template: `
    <mat-toolbar color="primary">
      <span>ABC Car Rental</span>
      <nav class="nav-links">
        <a mat-button routerLink="/bookings" routerLinkActive="active">Bookings</a>
        <a mat-button routerLink="/cars" routerLinkActive="active">Available Cars</a>
      </nav>
    </mat-toolbar>

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .nav-links {
      margin-left: 20px;
    }
    .active {
      background-color: rgba(255, 255, 255, 0.2);
    }
  `]
})
export class AppComponent {}