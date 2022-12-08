import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, docData, Firestore, orderBy, query, updateDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { User } from '../shared/models/user';
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

  addVisitNotificationNumber(userId: string, number: number):Observable<any> {
    const userref = doc(this.firestore,`users/${userId}`);
    return from(updateDoc(userref, {visitNotificationsNumber:number} ));
  }



}
