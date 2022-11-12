import { Injectable } from '@angular/core';
import { Observable, from, switchMap, of } from 'rxjs';
import { User } from '../shared/models/user';
import {
  collection,
  Firestore,
  query,
  collectionData,
  doc,
  setDoc,
  docData,
} from '@angular/fire/firestore';
import { AuthService } from '../Auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  addUser(user: User): Observable<any> {
    const ref = doc(this.firestore, 'users', user?.email);
    return from(setDoc(ref, user));
  }

  getallUsers(): Observable<User[]> {
    const ref = collection(this.firestore, 'users');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<User[]>;
  }

  get CurrentAuthUSer(): Observable<User | null> {
    return this.authService.user.pipe(
      switchMap((user) => {
        if (!user?.email) {
          return of(null);
        }
        const ref = doc(this.firestore, 'users', user.email);
        return docData(ref) as Observable<User>;
      })
    );
  }
}
