import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [CommonModule, RouterModule, MatIconModule, MatTooltipModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isCollapsed = false;

  constructor(private router: Router) { }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    localStorage.removeItem('access_token_producto-service');
    localStorage.removeItem('access_token_categoria-service');
    localStorage.removeItem('access_token_usuario-service');
    localStorage.removeItem('active_client');
    this.router.navigate(['/login']);
  }
}
