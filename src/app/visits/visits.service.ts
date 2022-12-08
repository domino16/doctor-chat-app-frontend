import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { visitData } from '../shared/models/visit.data';

@Injectable({
  providedIn: 'root'
})
export class VisitsService {

  constructor(private firestore: Firestore) { }



  addVisit(userId: string, doctorId: string, visit: visitData) {
    const userref = collection(this.firestore,`users/${userId}/visits`);
    const doctorref = collection(this.firestore, `users/${doctorId}/visits`);

    addDoc(doctorref,  visit );
    addDoc(userref,  visit );
  }

  getVisits(userId: string): Observable<visitData[]> {
    const ref = collection(this.firestore, `users/${userId}/visits`);
    const queryAll = query(ref, orderBy('date', 'asc'));
    collectionData(queryAll).subscribe(data => console.log(data))
    return collectionData(queryAll) as Observable<visitData[]>;
  }
}
