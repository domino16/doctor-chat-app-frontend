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
import { authUser } from '../Auth/store/auth.selector';
import { Store } from '@ngrx/store';
import { rootState } from '../store/rootState';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private store: Store<rootState>
  ) {}



  addUser(user: User): Observable<any> {
    const ref = doc(this.firestore, 'users', user?.email);
    return from(setDoc(ref, user));
  }

  getallUsers(): Observable<User[]> {
    const ref = collection(this.firestore, 'users');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<User[]>;
  }

   CurrentAuthUser(): Observable<User | null> {
    // return this.authService.user$
    return this.store.select(authUser).pipe(
      switchMap((user) => {
        if (!user?.email) {
          return of(null);
        }
        const ref = doc(this.firestore, 'users', user.email);
        return docData(ref) as Observable<User>;
      })
    );
  }

  get CurrentAuthUSer(): Observable<User | null> {
    // return this.authService.user$
    return this.store.select(authUser).pipe(
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
