import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../book.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent {
  book = {
    title: '',
    author: '',
    description: ''
  };
  coverImage: File | null = null;

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.coverImage = file;
    }
  }

  // dodavanje knjige u listu čitanja
  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.book.title);
    formData.append('author', this.book.author);
    formData.append('description', this.book.description);
    if (this.coverImage) { // ako postoji slika, dodajemo je u formu
      formData.append('uploaded_cover', this.coverImage);
    }
    formData.append('status', 'want_to_read');

    this.bookService.addToReadingList(formData).subscribe({
      next: () => {
        console.log('Book added successfully');
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        console.error('Error adding book:', error);
      }
    });
  }
}
