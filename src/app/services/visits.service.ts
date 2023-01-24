
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { visitData } from '../shared/models/visit.data';

@Injectable({
  providedIn: 'root'
})
export class VisitsService {

  constructor(private Http:HttpClient) { }



  addVisit(userId: string, doctorId: string, visit: visitData):void{

    this.Http.post(`https://doctor-chat-app.herokuapp.com/user/visit/${userId}`,
    {comment: visit.comment,
      date: visit.date,
      doctor:visit.doctor,
      doctorImg:visit.doctorImg,
      place: visit.place,
      time:visit.time
    }).subscribe()

    this.Http.post(`https://doctor-chat-app.herokuapp.com/user/visit/${doctorId}`,
    {comment: visit.comment,
      date: visit.date,
      doctor:visit.doctor,
      doctorImg:visit.doctorImg,
      place: visit.place,
      time:visit.time
    }).subscribe()

  }


  getVisits(userId: string): Observable<visitData[]> {

    return this.Http.get<visitData[]>(`https://doctor-chat-app.herokuapp.com/user/visit/${userId}`)
  }


  updateVisitNotificationNumber(userId: string, number: number):Observable<any> {

    return this.Http.patch(`https://doctor-chat-app.herokuapp.com/user/setvisitnotification/${userId}`,number);
  }



}
