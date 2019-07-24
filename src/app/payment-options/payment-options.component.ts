import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input, OnChanges, OnDestroy,
  OnInit
} from '@angular/core';
import {AppdataService} from '../appdata.service';
import {ZTransaction} from '../shared/models/ZTransaction';
import {NookSessionData} from '../shared/models/NookSessionData';
import {isUndefined} from 'util';
import {Pipe} from '@angular/core';
import {ISlimScrollEvent, SlimScrollEvent} from 'ngx-slimscroll';
import SessionInfo = app.shared.models.SessionInfo;
import {CommonService} from '../shared/Services/CommonService';
import SessionData = app.shared.models.SessionData;
import Gateways = app.shared.models.Gateways;
import {SlideDownAnimation} from '../shared/animations/animate';
import {NgwWowService} from 'ngx-wow';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {__metadata} from 'tslib';

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.css'],
  animations: [SlideDownAnimation]
})
export class PaymentOptionsComponent implements OnInit, AfterViewChecked, AfterViewInit, AfterContentChecked, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  currentV2: string;
  isLoggedin: Boolean = false;
  session: SessionInfo;
  cards: any;
  currentComp: string;
  isSessionTimedOut: boolean;
  scrollEvents: EventEmitter<SlimScrollEvent>;
  currentPos = 0;
  prevDiv = 'main_content';
  activeItem: string;
  existingUser = false;
  isMobile = false;

  constructor(private data: AppdataService, private common: CommonService,
              private cdRef: ChangeDetectorRef, private wow: NgwWowService) {
  }

  ngOnInit() {
    this.data.isLoggedin.pipe(takeUntil(this.onDestroy$)).subscribe(message => this.isLoggedin = message);
    this.common.sessionInformation.pipe(takeUntil(this.onDestroy$)).subscribe(trx => {
      this.session = trx;

      if (this.session != null) {
        this.processGateway(this.session.data.session_data);
      }
    });
    this.data.currentComp.pipe(takeUntil(this.onDestroy$)).subscribe(comp => this.currentComp = comp);
    this.data.isSessionTimeout.pipe(takeUntil(this.onDestroy$)).subscribe(val => this.isSessionTimedOut = val);

    this.data.activeItem.pipe(takeUntil(this.onDestroy$)).subscribe(v => this.activeItem = v);
    this.data.existingUser.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.existingUser = x);

    this.scrollEvents = new EventEmitter<SlimScrollEvent>();
    this.data.isMobile.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.isMobile = x);
    this.wow.init();
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();

  }

  ngAfterViewInit() {

  }

  ngAfterViewChecked() {
    // this.getGateways();
    // this.cdRef.detectChanges();
    if (this.isSessionTimedOut) {
      this.data.showError(100, 'Session timed out');
    }
  }

  getGateways() {
    // if (this.transaction != null && this.transaction.session != null && this.transaction.session.session_data != null) {
    //   const gatewayRaw = this.transaction.session.session_data;
    //   const jsonGateway: NookSessionData = JSON.parse(gatewayRaw);
    //   this.processGateway(jsonGateway);
    // } else {
    // }
  }

  processGateway(session_data: SessionData) {
    // cards - visa, master, amex, otherscard
    // internetbanking
    // mobilebanking
    // type - visa, master, amex, internetbanking
    // gw - visacard, amexcard, city_amex

    const gateways = session_data.gateways;
    this.cards = {cards: [], internetbanking: [], mobilebanking: []};
    if (!isUndefined(gateways)) {
      const jsonGateways: Gateways = gateways;
      // Set Redirect URL Path
      if (!isUndefined(jsonGateways.gw) && !isUndefined(jsonGateways.desc)) {
        for (const cw in jsonGateways.gw) {
          if (!isUndefined(jsonGateways.gw[cw])) {
            jsonGateways.gw[cw] = jsonGateways.gw[cw].split(',');
          }
        }
        let cardpos = 0;
        let inpos = 0;
        let mobpos = 0;
        for (const cg in jsonGateways.desc) {
          if (!isUndefined(jsonGateways.desc[cg])) {
            const gw = jsonGateways.desc[cg].gw;
            const type = jsonGateways.desc[cg].type;
            if (type === 'visa' && gw === 'visacard') {
              this.cards['cards'][cardpos] = jsonGateways.desc[cg];
              cardpos++;
            } else if (type === 'master' && gw === 'mastercard') {
              this.cards['cards'][cardpos] = jsonGateways.desc[cg];
              cardpos++;
            } else if (type === 'amex' && gw === 'amexcard') {
              this.cards['cards'][cardpos] = jsonGateways.desc[cg];
              cardpos++;
            } else if (type === 'othercards') {
              this.cards['cards'][cardpos] = jsonGateways.desc[cg];
              cardpos++;
            } else if (type === 'internetbanking') {
              this.cards['internetbanking'][inpos] = jsonGateways.desc[cg];
              inpos++;
            } else if (type === 'mobilebanking') {
              this.cards['mobilebanking'][mobpos] = jsonGateways.desc[cg];
              mobpos++;
            } else {
            }
          }
        }
      }
    }

    const card_enable = (this.cards != null && this.cards['cards'] !== undefined && this.cards['cards'].length > 0);
    const mob_enable = (this.cards != null && this.cards['mobilebanking'] !== undefined && this.cards['mobilebanking'].length > 0);
    const net_enable = (this.cards != null && this.cards['internetbanking'] !== undefined && this.cards['internetbanking'].length > 0);

    this.data.isCardAvail.next(card_enable);
    this.data.isMobAvail.next(mob_enable);
    this.data.isNetAvail.next(net_enable);

    console.log(this.session.data.session_data.meta.default_tab);
    if (((((<any>(this.session || {})).data || {}).session_data || {}).meta || {}).default_tab) {
      // && Number(this.session.data.session_data.meta.numberOfCardSaved) === 0) {
      const dt = this.session.data.session_data.meta.default_tab;
      switch (dt) {
        case 'c' :
          if (card_enable) {
            this.data.changeView('card-entry', null, 'entry-page');
            // this.data.activeItemB.next('card-entry');
            // this.data.currentCompB.next('card-entry');
          } else {
            // ignore
          }
          break;
        case 'm':
          if (mob_enable) {
            this.data.changeView('mobile');
            // this.data.activeItemB.next('mobile');
            // this.data.currentCompB.next('mobile');
          } else {
            // ignore
          }
          break;
        case 'i':
          if (net_enable) {
            this.data.changeView('net');
            // this.data.activeItemB.next('net');
            // this.data.currentCompB.next('net');
          } else {
            // ignore
          }
          break;
        default:
          break;
      }
    } else {

      if (card_enable) {
        // this.data.activeItemB.next('cards');
        // this.data.currentCompB.next('cards');
        this.data.activeItemB.next('card-entry');
        this.data.currentCompB.next('card-entry');
        this.data.changeView('card-entry', null, 'entry-page');
      }
      if (!card_enable && mob_enable) {
        this.data.activeItemB.next('mobile');
        this.data.currentCompB.next('mobile');
      }
      if (!card_enable && !mob_enable && net_enable) {
        this.data.activeItemB.next('net');
        this.data.currentCompB.next('net');
      }

      if (this.session != null && this.session.data != null) {
        if (parseInt(this.session.data.session_data.meta.existingMobile, 10) === 1) {
          this.data.existingUserB.next(true);
          if (this.isLoggedin) {
            const storedCards = this.session && this.session.data && this.session.data.session_data ?
              Number(this.session.data.session_data.meta.numberOfCardSaved) : 0;
            if (storedCards > 0) {
              this.data.changeView('cards-list');
            } else {
              this.data.changeView('card-entry', null, 'entry-page');
            }
          }
        } else {
          this.data.existingUserB.next(false);
        }
      }
    }
  }

  processRedirect(event) {
    if (!isUndefined(event.gw)) {
      if (!isUndefined(event.r_flag)) {
        if (event.r_flag === '1') {
          if (window.opener != null) {
            window.opener.postMessage(JSON.stringify(
              {status: 'success', type: 'gw_redirect', url: event.redirectGatewayURL}
            ), '*');
          } else if (window.parent != null) {
            window.parent.postMessage(JSON.stringify(
              {status: 'success', type: 'gw_redirect', url: event.redirectGatewayURL}
            ), '*');
          } else {
          }
          window.location.href = event.redirectGatewayURL;

        } else {
          if (event.type === 'visa' || event.type === 'master' || event.type === 'amex') {
            if (this.isLoggedin) {
              this.data.showStoredCards();
            } else {
              if (this.session != null && this.session.data &&
                this.session.data.request.is_tokenize && this.session.data.session_data.cards.length > 0) {
                this.data.changeView('cards-list', event);

              } else {
                this.data.changeView('card-entry', event);
              }
            }
          }
        }
      }
    }
  }

  processData($event: string) {
    setTimeout(() => {
      const childPos = document.getElementById($event).offsetTop;

      let event = new SlimScrollEvent({
        type: 'scrollTo',
        y: childPos,
        duration: 500,
        easing: 'inOutQuint'
      });
      if ($event === 'login_password') {
        event = new SlimScrollEvent({
          type: 'scrollToBottom',
          duration: 500,
          easing: 'inOutQuint'
        });
      }
      this.scrollEvents.emit(event);

    }, 300);
  }

  demoScroll(pos: Boolean) {
    const names: string[] = ['remember_card_mobile', 'remember_card_otp', 'remember_card_password', 'transaction_success', 'feedback_area'];

    /*remember_card_mobile
    remember_card_otp
    remember_card_password
    transaction_success
    feedback_area*/


    const childPos = ((document.getElementById(names[this.currentPos]).offsetTop + 10));
    // - ( (document.getElementById('main_content').getBoundingClientRect().top)));

    let event = new SlimScrollEvent({
      type: 'scrollTo',
      y: childPos, // parseInt($event, 10), // 10 means decimal
      duration: 500,
      easing: 'inOutQuint'
    });

    if (this.currentPos === 4) {
      event = new SlimScrollEvent({
        type: 'scrollToBottom',
        duration: 500,
        easing: 'inOutQuint'
      });
    }
    this.scrollEvents.emit(event);
    this.currentPos++;
  }

  processScroll($event: SlimScrollEvent) {
    if ($event != null) {
      this.scrollEvents.emit($event);
    }

    const event = new SlimScrollEvent({
      type: 'scrollTo',
      y: 200,
      duration: 4000,
      easing: 'inOutQuint'
    });
    this.scrollEvents.emit(event);
  }

  changeCurrentView(val: string) {
    this.data.currentCompB.next(val);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }
}

export interface Gw {
  visa: string;
  master: string;
  amex: string;
  othercards: string;
  internetbanking: string;
  mobilebanking: string;
}

export interface Desc {
  name: string;
  type: string;
  logo: string;
  gw: string;
}
