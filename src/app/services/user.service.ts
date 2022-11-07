import { Injectable } from '@angular/core';
import { Observable, from} from 'rxjs';
import { User } from '../shared/models/user';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {

constructor(private http:HttpClient){}


adduser(user:User){
   return this.http.post('https://chat-36809-default-rtdb.europe-west1.firebasedatabase.app/users.json', user )

}

}
