import {
  Component,
  OnInit,
} from '@angular/core';
import { Message } from '../shared/models/message';
import { Observable} from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  username: string = '';
  message: string = '';
  messages!: Observable<Message[]>;
  searchControl:any;
  users = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {

  }
  user:User = {'address':''}
  send() {
    const message: Message = {
      message: this.message,
      author: 'lukaszo199',
      imgSrc:
        'https://upload.wikimedia.org/wikipedia/commons/a/a0/Andrzej_Person_Kancelaria_Senatu.jpg',
    };

    // this.http.postMessage(message).subscribe();
    // this.message = '';
  }


}
