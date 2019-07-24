import {Component, NgModule, NgZone, OnDestroy, OnInit} from '@angular/core';
import { ApiService } from './api.service';
import {AppdataService} from './appdata.service';
import {BrowserInformation} from './shared/models/BrowserInformation';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';
import {isUndefined} from 'util';
import {StorageService} from './storage.service';

declare function loadBrowserDetection(): any;
declare module Fingerprint2 {}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ApiService]
})
export class AppComponent implements OnInit, OnDestroy {
  protected browserInfo: BrowserInformation;
  protected isSessionTimeout: boolean;
  protected transactionID: string;
  protected  test = 'hello';
  /*
  * Constructor, which is called during class calling
  * */
  constructor(private data: AppdataService, private activeRoute: ActivatedRoute, private storage: StorageService) {
    data.isSessionTimeout.subscribe(res => { this.isSessionTimeout = res; });
    data.activeTransactionID.subscribe(id => { this.transactionID = id; });

    data.stringHello.subscribe(p => this.test = p);

  }

  /*
  * Initiate on view loading
  * */
  ngOnInit() {
    this.browserInfo = loadBrowserDetection();
    console.log(this.browserInfo);
    // new Fingerprint2().get(function(result, components) {
    //   // console.log(result);
    //   // console.log(components);
    // });
    this.registerDevice();


    const queryParams = this.activeRoute.snapshot.queryParams;
    const routeParams = this.activeRoute.snapshot.params;
    // console.log(queryParams);
    // console.log(routeParams);
    if (!isUndefined(routeParams.id)) {
      this.transactionID = routeParams.id;
      this.checkAndLoadTransaction(this.transactionID);
    }
  }

  updateText() {
    this.data.stringHelloB.next('AMAR');
  }

  checkAndLoadTransaction(transactionID) {
    /*
    * Initiating transaction acquired by parameters
    * */
    this.data.setActiveTransaction(transactionID);
    this.data.getTransaction(transactionID);
  }


  registerDevice() {
    if (this.browserInfo) {
      const reg_id = this.storage.getItem('_z_r_i', true);
      const enc_key = this.storage.getItem('_z_e_k', true);
      if (!reg_id && !enc_key) {
        this.data.getToken(this.browserInfo.browser, this.browserInfo.user_agent,
          this.browserInfo.screen_resolution, this.browserInfo.browser, this.browserInfo.os);
      } else {
        // Device Id not working
      }
    }
  }
  ngOnDestroy() {}
}
