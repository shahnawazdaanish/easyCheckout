import {NookSessionData} from './NookSessionData';

export class NookSession {
  uin: string;
  session_key: string;
  session_data: string;
  constructor(uin: string, session_key: string, session_data: string) {
    this.uin = uin;
    this.session_key = session_key;
    this.session_data = session_data;
  }

  getSessionData() {
    return JSON.parse(this.session_data);
  }
}
