import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private http: HttpClient) {}
  
  title = 'booktracker_client';

  /*getBooks() {
    this.http.get('http://your-api-endpoint.com/books').subscribe(data => {
      console.log(data);
    });
  }*/
}
