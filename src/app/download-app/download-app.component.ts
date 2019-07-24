import { Component, OnInit } from '@angular/core';
import {AppdataService} from '../appdata.service';
import {NookSessionData} from '../shared/models/NookSessionData';
import SessionInfo = app.shared.models.SessionInfo;
import {CommonService} from '../shared/Services/CommonService';

@Component({
  selector: 'app-download-app',
  templateUrl: './download-app.component.html',
  styleUrls: ['./download-app.component.css']
})
export class DownloadAppComponent implements OnInit {
  isSessionTimedOut: boolean;
  session: SessionInfo;
  sessionData: NookSessionData;

  constructor(private data: AppdataService, private common: CommonService) {
    this.common.sessionInformation.subscribe(res => this.session = res);
    this.data.isSessionTimeout.subscribe(r => this.isSessionTimedOut = r);
  }

  ngOnInit() {  }
  changeView(view: string) {
    this.data.changeView(view);
  }

}
