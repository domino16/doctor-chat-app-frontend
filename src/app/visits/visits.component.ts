import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadVisitsStart } from './store/visits.action';
import { getVisits } from './store/visits.selectors';
import { rootState } from '../store/rootState';
import { visitData } from '../shared/models/visit.data';
import { getCurrentChatUser } from '../shared/store/shared.selector';
import { mergeMap, Observable, switchMap, take, Subject } from 'rxjs';
import { VisitsService } from './visits.service';
@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss']
})
export class VisitsComponent implements OnInit {

  visits:visitData[] = []
  userId!:string;
  currentDate = new Date().getTime()


  constructor(private store:Store<[rootState]>) {

  }

  ngOnInit(): void {
    this.store.select(getCurrentChatUser).subscribe(user => {this.userId =user?.email!}
    )
  this.store.dispatch(loadVisitsStart({userId:this.userId}))
  this.store.select<visitData[]>(getVisits).subscribe(visits => this.visits = visits)

  }

}
