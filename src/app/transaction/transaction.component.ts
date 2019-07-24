import {
  AfterContentChecked, AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AppdataService} from '../appdata.service';
import {HttpClient} from '@angular/common/http';
import {isUndefined} from 'util';
import {ZTransaction} from '../shared/models/ZTransaction';
import {map, share, switchMap} from 'rxjs/operators';
import {interval, Subject, Subscription} from 'rxjs';
import {SessionService} from '../shared/Services/SessionService';
import {CommonService} from '../shared/Services/CommonService';
import SessionInfo = app.shared.models.SessionInfo;
import {ResizedEvent} from 'angular-resize-event';
import {NgwWowService} from 'ngx-wow';
import {MatSnackBar} from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import DiscountList = app.shared.models.DiscountList;
import {StorageService} from '../storage.service';
import {AlertService} from 'ngx-alerts';
import {NotifyService} from '../shared/Services/notify.service';


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit, OnDestroy, AfterContentChecked, AfterViewInit {
  @ViewChild('token_window') popView: ElementRef;
  private onDestroy$: Subject<void> = new Subject<void>();

  isBtnActive: Boolean;
  btnAct;
  currentComp: string;
  btnEvent;
  title = 'SSLWireless';
  loading = false;
  isLogin = true;
  message: string;
  // transactionID: string;
  sub;
  transaction: ZTransaction;
  selectedOffer: DiscountList;

  isMobile = false;
  private wowSubscription: Subscription;

  btnLoading = false;
  btnSuccess = false;
  btnFailed = false;

  forceLogoOff = false;


  session: SessionInfo;
  protected isSessionTimeout: boolean;
  protected session_key: string;


  constructor(private http: HttpClient, private data: AppdataService,
              private activeRoute: ActivatedRoute,
              private sessionService: SessionService, private common: CommonService,
              private wowService: NgwWowService, private snackBar: MatSnackBar,
              private storage: StorageService, private alert: NotifyService) {
    data.isSessionTimeout.pipe(takeUntil(this.onDestroy$)).subscribe(res => { this.isSessionTimeout = res; });
    data.activeTransactionID.pipe(takeUntil(this.onDestroy$)).subscribe(id => { this.session_key = id; });

    this.common.sessionInformation.pipe(takeUntil(this.onDestroy$)).subscribe(p => this.session = p );
    this.data.offerSelected.pipe(takeUntil(this.onDestroy$), share()).subscribe(x => this.selectedOffer = x);
    this.wowService.init();
    // snackBar.open('Message archived');
  }


  ngOnInit(): void {
    // this.sub = this.activatedRoute.params.subscribe(params => {
    //   this.transactionID = params['id'];
    // });

    // this.alert.success('Testing notification service');
    const queryParams = this.activeRoute.snapshot.queryParams;
    const routeParams = this.activeRoute.snapshot.params;
    if (!isUndefined(routeParams.id)) {
      this.session_key = routeParams.id;
      this.checkAndLoadTransaction(this.session_key);
    } else {
      // Invalid parameter or route won't be match
    }

    // this.data.currentMessage.subscribe(message => this.message = message);
    this.data.transaction.pipe(takeUntil(this.onDestroy$)).subscribe(trx => this.transaction = trx);
    this.data.app_loading.pipe(takeUntil(this.onDestroy$)).subscribe(load => this.loading = load);
    this.data.currentComp.pipe(takeUntil(this.onDestroy$)).subscribe(comp => this.currentComp = comp);
    this.btnAct = this.data.payBtnActive.pipe(takeUntil(this.onDestroy$)).subscribe( v => this.isBtnActive = v);
    this.data.isMobile.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.isMobile = x);

    this.data.btnLoading.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.btnLoading = x);
    this.data.btnSuccess.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.btnSuccess = x);
    this.data.btnFailed.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.btnFailed = x);

    this.wowSubscription = this.wowService.itemRevealed$.pipe(takeUntil(this.onDestroy$)).subscribe(
      (item: HTMLElement) => {
        // do whatever you want with revealed element
      });

    let forceFull = false;
    if (queryParams.full !== undefined) {
      if (queryParams.full === '1') {
        forceFull = true;
      } else {
        forceFull = false;
      }
    } else {
      forceFull = false;
    }
    if (queryParams.fail !== undefined) {
      const msg = (queryParams.message !== undefined) ? queryParams.message
        : 'Your transaction attempt was failed. You can retry for payment again';
      this.alert.warning(msg);
    }
    this.forceLogoOff = forceFull;
  }

  ngAfterViewInit () {
    // const h = this.popView.nativeElement.offsetHeight;
    //
    // setInterval(function() {
    // }, 500);
  }

  onResized(event: ResizedEvent) {
    // this.width = event.newWidth;
    // this.height = event.newHeight;
    window.postMessage(JSON.stringify({'status': 'success', 'type' : 'resize', 'height' : event.newHeight}), '*');
    window.parent.postMessage(JSON.stringify({'status': 'success', 'type' : 'resize', 'height' : event.newHeight}), '*');
  }

  checkAndLoadTransaction(session_key: string) {
    /*
    * Initiating transaction acquired by parameters
    * */
    this.common.setActiveSessionKey(session_key);
    this.sessionService.getSessionInformation(session_key);

    // CHECK OFFER TRXID
    const storedOfferTRXID = this.storage.getItem('discountTrxID');
    if (session_key !== storedOfferTRXID) {
      this.data.removeOffer();
    }

    // this.data.getOffers(session_key);
    // this.data.getEmiInfo(session_key);

    // const result = interval(5000).pipe(
    //   switchMap(() => this.data.checkTransaction(transactionID)),
    //   map(res => res);
    // )

    // const source = interval(4000);
    // const subscribe = source.subscribe(val => {
    //     if (!this.isSessionTimeout) {
    //       // this.data.checkTransaction(transactionID);
    //     }
    //   }
    // );
    //
    // interval(1000).pipe(
    //   map((x) => {
    //   })
    // );
  }
  showPayButton () {
    return this.currentComp === 'cards' || this.currentComp === 'mobile' || this.currentComp === 'net' ||
      this.currentComp === 'card-entry' || this.currentComp === 'cards-list';
  }
  showProcessButton () {
    return this.currentComp === 'signup';
  }
  showResetButton () {
    return this.currentComp === 'forget';
  }
  showLoginButton () {
    return this.currentComp === 'login';
  }
  showPayWithButton () {
    return this.currentComp === 'net';
  }

  changeCurrentView(v) {
    this.data.changeView(v);
  }
  sendEventInServer(event) {
    this.data.ClickPayButton(event);
  }
  testClick() {
  }

  ngAfterContentChecked() {
    // this.tour.initialize([{
    //   anchorId: 'shaz.tour.header',
    //   content: 'This is header',
    //   title: 'Welcome to Zpay',
    // }]);
    //
    // this.tour.start();
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
    // this.btnAct.unsubscribe();
    // this.wowSubscription.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

