import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../shared/models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpUserService {
  private url = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  postUser(user: User) {
    return this.http.post(this.url, user).pipe(tap(console.log));
  }
}
