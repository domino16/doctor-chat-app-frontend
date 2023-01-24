import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import {Frame, Stomp} from '@stomp/stompjs'
import { Subject, take } from "rxjs";
import * as SockJS from 'sockjs-client';
import { loadChats } from "../chat/store/chat.actions";
import { getSelectedChat } from "../chat/store/chat.selectors";
import { rootState } from "../store/rootState";



@Injectable({
  providedIn: 'root'
})
export class WebSocketService{

  webSocketEndPoint: string = `https://doctor-chat-app.herokuapp.com/ws`;
    topic: string = `/topic/messages`;
    stompClient: any;
    chatId!:number;
    messageComeEvent = new Subject();
    constructor(private store: Store<rootState>){
    }


    _connect() {

 console.log("Initialize WebSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;

this.store.select(getSelectedChat).pipe(take(2)).subscribe(chat=>{
        this.chatId = chat?.id!;

        _this.stompClient.connect({}, function (frame:Frame) {
          _this.messageComeEvent.next("event");
            _this.stompClient.subscribe(`/topic/messages/${chat?.id!}`, function (sdkEvent:any) {
                _this.messageComeEvent.next(sdkEvent);
                _this.store.dispatch(loadChats())
            });

            _this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);

      })

    };
    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }
    // on error, schedule a reconnection attempt
    errorCallBack(error:String) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect();
        }, 5000);

    }

  sendMessage(message:String, chatId:number) {
    this.stompClient.send(`/app/chat/${chatId}`, {}, message);
  }


}
