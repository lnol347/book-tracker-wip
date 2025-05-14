import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleBook, BookService } from '../book.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  books: GoogleBook[] = [];
  searchQuery: string = '';
  selectedFilter: string = '';
  private searchSubject = new Subject<string>();
  showToast = false;
  selectedBook: any = null;

  constructor(private bookService: BookService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchBooks(query);
    });
  }

  // inicijalno učitavanje
  ngOnInit() {
    this.searchBooks('Harry Potter');
  }

  onSearchChange(query: string) {
    this.searchSubject.next(query);
  }

  // primjena filtera
  applyFilter() {
    this.searchBooks(this.searchQuery);
  }

  // traženje knjiga
  private searchBooks(query: string) {
    if (!query) return;
    this.bookService.searchBooks(query, this.selectedFilter)
      .subscribe({
        next: (books: GoogleBook[]) => {
          this.books = books;
        },
        error: (error) => console.error('Error fetching books:', error)
      });
  }

  // dodavanje knjige u listu čitanja
  addToReadingList(book: GoogleBook) {
    // ako postoji slika, dodajemo je u formu
    if (book.volumeInfo.imageLinks?.thumbnail) {
      const imageUrl = book.volumeInfo.imageLinks.thumbnail;
      
      fetch(`${this.bookService.baseApiUrl}/proxy-image/?url=${encodeURIComponent(imageUrl)}`)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' });
          
          const formData = new FormData();
          formData.append('title', book.volumeInfo.title);
          formData.append('author', book.volumeInfo.authors?.[0] || 'Unknown');
          formData.append('description', book.volumeInfo.description || '');
          formData.append('uploaded_cover', file);
          formData.append('status', 'want_to_read');

          this.bookService.addToReadingList(formData).subscribe({
            next: () => {
              this.showToast = true;
              setTimeout(() => {
                this.hideToast();
              }, 3000);
            },
            error: (error) => {
              console.error('Error adding book to reading list:', error);
            }
          });
        });
    } else {
      // Ako nema slike, samo pošaljemo ostale podatke
      const formData = new FormData();
      formData.append('title', book.volumeInfo.title);
      formData.append('author', book.volumeInfo.authors?.[0] || 'Unknown');
      formData.append('description', book.volumeInfo.description || '');
      formData.append('status', 'want_to_read');

      this.bookService.addToReadingList(formData).subscribe({
        next: () => {
          this.showToast = true;
          setTimeout(() => {
            this.hideToast();
          }, 3000);
        },
        error: (error) => {
          console.error('Error adding book to reading list:', error);
        }
      });
    }
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

  // skrivanje toast poruke
  hideToast() {
    this.showToast = false;
  }
}
