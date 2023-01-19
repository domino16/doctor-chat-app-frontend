import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadVisitsStart, resetVisitNotificationNumber } from './store/visits.action';
import { getVisits } from './store/visits.selectors';
import { rootState } from '../store/rootState';
import { visitData } from '../shared/models/visit.data';
import { getCurrentChatUser } from '../shared/store/shared.selector';
import { WebSocketService } from '../services/webSocket.service';
@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss'],
})
export class VisitsComponent implements OnInit {
  visits: visitData[] = [];
  userId!: string;
  currentDate = new Date().getTime();


  constructor(private store: Store<[rootState]>, private webSocketService:WebSocketService) {}

  ngOnInit(): void {
    this.store.dispatch(resetVisitNotificationNumber())
    this.store.select(getCurrentChatUser).subscribe((user) => {
      this.userId = user?.email!;
    });
    this.store.dispatch(loadVisitsStart({ userId: this.userId }));
    this.store
      .select<visitData[]>(getVisits)
      .subscribe((visits) =>{
        this.visits = visits;
      });
      this.webSocketService.messageComeEvent.next('event');
  }


}
