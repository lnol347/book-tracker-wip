import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from './book.model';
// model google API knjige
export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    categories?: string[];
    imageLinks?: {
      thumbnail: string;
    };
    description?: string;
  };
}
// model liste čitanja
export interface ReadingListItem {
  id: number;
  book: Book;
  status: string;
  date_added: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // Trenutno odabrana knjiga za prikaz detalja
  selectedBook: GoogleBook | null = null;
  // Base URL za API zahtjeve
  baseApiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  searchBooks(query: string, filter: string = ''): Observable<GoogleBook[]> {
    return this.http.get<any>(`${this.baseApiUrl}/search-books/?q=${query}${filter ? '&' + filter : ''}`).pipe(
      map(response => response.items || [])
    );
  }

  // Dodavanje nove knjige u bazu
  addBook(formData: FormData) {
    return this.http.post<Book>(`${this.baseApiUrl}/books/`, formData);
  }

  // Dohvaćanje liste knjiga prijavljenog korisnika
  getReadingList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/reading-list/`);
  }

  // Dodavanje knjige na korisnikovu listu čitanja
  addToReadingList(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/reading-list/`, formData);
  }

  // Uklanjanje knjige s korisnikove liste čitanja
  removeFromReadingList(id: number): Observable<any> {
    return this.http.delete(`${this.baseApiUrl}/reading-list/${id}/`);
  }
}
