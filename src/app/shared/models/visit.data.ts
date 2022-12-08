import { Timestamp } from "@angular/fire/firestore";

export interface visitData{
    doctor:string;
    doctorImg:string
    date:Timestamp;
    time:string;
    place:string;
    comment:string;
}



