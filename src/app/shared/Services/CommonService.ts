import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import SessionInfo = app.shared.models.SessionInfo;
import {ErrorInformation} from '../models/ErrorInformation';

@Injectable({
  providedIn: 'root'
})
export class CommonService implements OnInit {
  sessionInformationService: BehaviorSubject<SessionInfo> = new BehaviorSubject<SessionInfo>(null);
  sessionInformation = this.sessionInformationService.asObservable();
  private activeSessionKey: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor() {
  }
  ngOnInit () {
  }



  setCurrentSession(session: SessionInfo) {
    this.sessionInformationService.next(session);
  }
  getCurrentSession(): Observable<SessionInfo> {
    return this.sessionInformationService.asObservable();
  }

  getActiveSessionKey(): string {
    return this.activeSessionKey.value;
  }
  setActiveSessionKey(session_key: string) {
    this.activeSessionKey.next(session_key);
  }

}
