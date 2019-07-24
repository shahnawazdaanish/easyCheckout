import { Injectable } from '@angular/core';
import {AlertService} from 'ngx-alerts';
import {MatSnackBar} from '@angular/material';
import {AppdataService} from '../../appdata.service';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  alert: AlertService;
  alertMob: MatSnackBar;
  isMobile: boolean;
  isFull: boolean;
  duration: number;
  constructor(private al: AlertService, private mobAlert: MatSnackBar, public data: AppdataService) {
    this.alert = al;
    this.alertMob = this.mobAlert;
    this.data.isMobile.subscribe(x => this.isMobile = x);
    this.data.isFull.subscribe(x => this.isFull = x);
    this.duration = 700000;
  }

  success(message: string) {
    this.mobAlert.open(message, null, {
      duration: this.duration,
      verticalPosition: this.isMobile || this.isFull ? 'top' : 'bottom',
      panelClass : ['mob-success-alert']
    });
    // this.alert.success(message);
  }
  danger(message: string) {
    this.mobAlert.open(message, null, {
      duration: this.duration,
      verticalPosition: this.isMobile || this.isFull ? 'top' : 'bottom',
      panelClass : ['mob-danger-alert']
    });
    // this.alert.danger(message);
  }
  warning(message: string) {
    this.mobAlert.open(message, null, {
      duration: this.duration,
      verticalPosition: this.isMobile || this.isFull ? 'top' : 'bottom',
      panelClass : ['mob-warning-alert']
    });
    // this.alert.warning(message);
  }
}
