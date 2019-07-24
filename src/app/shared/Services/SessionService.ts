import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AlertService} from 'ngx-alerts';
import SessionInfo = app.shared.models.SessionInfo;
import {BehaviorSubject, Observable} from 'rxjs';
import {CommonService} from './CommonService';
import {AppdataService} from '../../appdata.service';
import {NotifyService} from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnInit {
  // INITIALIZER VARIABLES
  $http: HttpClient;
  $alert: NotifyService;
  $common: CommonService;
  $app: AppdataService;
  paymentSession: SessionInfo;



  /*
  * SESSION SERVICE
  * This session service will provide all features from session information
  * checkSession(), getSession()
  * */
  constructor(private http: HttpClient, private alert: NotifyService, private common: CommonService, private app: AppdataService) {
    this.$http = http;
    this.$alert = alert;
    this.$common = common;
    this.$app = app;
  }

  ngOnInit() {
  }

  /*
  * Get Session Information
  * Get all information related with session by session_key
  * @Input session_key: string
  * @Output promise <SessionInfo>
  * */
  getSessionInformation(session_key: string) {
    this.$http.get<SessionInfo>(environment.apiEndPoint + '/session_info/' + session_key).subscribe(resp => {
      if (resp.status != null && resp.status.toLowerCase() === 'success') {
        console.log(resp);
        this.$common.setCurrentSession(resp);
        if (resp.data && resp.data.session_data) {
          if (resp.data.session_data.meta.emi) {
            this.app.getEmiInfo(resp.data.session_key);
          }
          if (resp.data.session_data.meta.offer) {
            this.app.getOffers(resp.data.session_key);
          }
        }
        if (this.$app.isLoggedin.getValue()) {
          this.$app.showStoredCards(true, resp.data.session_data.meta.gw_sessionkey);
        }
      } else {
        if (this.$alert) {
          this.$alert.warning('Transaction has been expired');
        }
        const message = (resp.message !== undefined) ? resp.message : 'Transaction information is not available. Session may be expired.';
        const url = (resp.data.url) ? resp.data.url : '';
        this.$app.showError(100, message, url);
      }
    }, error => {
      this.$alert.warning('Something happened with your transaction! Try again.');
    });
  }

}
