import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../shared/models/message';
import { Observable, interval, Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpMessagesService {
  private url = 'http://localhost:3000/chat';

  subMessages = new Subject<Observable<Message[]>>();

  constructor(private http: HttpClient) {
    interval(1000).subscribe((data) =>
      this.subMessages.next(this.getMessages())
    );
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.url);
  }

  postMessage(message: Message) {
    return this.http.post(this.url, message).pipe(tap(console.log));
  }
}
