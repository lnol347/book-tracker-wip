import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  // Stanje collapse izbornika na manjim ekranima
  isCollapsed = true;

  constructor(public authService: AuthService) {}

  // Odjava korisnika
  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.isCollapsed = true;
  }
}