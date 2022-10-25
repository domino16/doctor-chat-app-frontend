import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Message } from '../models/message';
import { Observable, interval, Subscription } from 'rxjs';
import { webSocket } from 'rxjs/webSocket'
import {NgForm} from '@angular/forms';
import { HttpMessagesService } from '../services/http-messages.service';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit{

  username: string = '';
  message : string = '';
  messages! : Observable<Message[]>

  constructor(private http: HttpMessagesService) {

  }

  ngOnInit(): void {
   this.http.subMessages.subscribe(data=> this.messages = data)

  }

  send(){
    const message: Message = {
      message: this.message,
      author: 'lukaszo199',
      imgSrc:'https://upload.wikimedia.org/wikipedia/commons/a/a0/Andrzej_Person_Kancelaria_Senatu.jpg'

  }

    this.http.postMessage(message).subscribe()
    this.message = '';
  }


}
