import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { Message } from '../models/message';
import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket'
import {NgForm} from '@angular/forms'


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit{

  constructor(public webSocketService: WebsocketService) { }

  ngOnInit(): void {

  }
}
