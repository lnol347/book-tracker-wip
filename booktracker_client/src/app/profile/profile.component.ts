import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { BookService } from '../book.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user$;
  readingList: any[] = [];
  showToast = false;
  selectedBook: any = null;

  constructor(
    private authService: AuthService,
    private bookService: BookService
  ) {
    this.user$ = this.authService.currentUser$;
  }
  
  // inicijalizacija liste čitanja
  ngOnInit() {
    this.loadReadingList();
  }

  // dobivanje liste čitanja
  loadReadingList() {
    this.bookService.getReadingList().subscribe({
      next: (list) => {
        this.readingList = list;
      },
      error: (error) => {
        console.error('Error loading reading list:', error);
      }
    });
  }

  // uklanjanje knjige iz liste čitanja
  removeFromList(id: number) {
    this.bookService.removeFromReadingList(id).subscribe({
      next: () => {
        this.readingList = this.readingList.filter(item => item.id !== id);
        this.showToast = true;
        setTimeout(() => {
          this.hideToast();
        }, 3000);
      },
      error: (error) => {
        console.error('Error removing book:', error);
      }
    });
  }

  // odjava korisnika
  logout() {
    this.authService.logout();
  }

  // skrivanje toast poruke
  hideToast() {
    this.showToast = false;
  }

  // prikaz detalja knjige
  showFullDescription(book: any) {
    this.selectedBook = book;
    document.body.classList.add('modal-open');
  }

  // zatvaranje modalnog prozora
  closeModal() {
    this.selectedBook = null;
    document.body.classList.remove('modal-open');
  }
}
