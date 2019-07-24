import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CardNo, MyCards} from './shared/models/MyCards';
import {CardInfo} from './shared/models/CardInfo';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TranslateService} from './translate.service';
import {StorageService} from './storage.service';
import {environment} from '../environments/environment.prod';
import {CommonService} from './shared/Services/CommonService';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  // baseUrl = 'http://localhost/zpayCheckout/api.php';
  // baseUrl = 'https://nookdev.sslcommerz.com/api_com';
  // baseUrl = 'https://epaydev.sslcommerz.com/api.php';
  baseUrl = environment.apiEndPoint;

  constructor(private http: HttpClient, private translate: TranslateService, private storage: StorageService,
              private common: CommonService) { }

  private isPaymentPending: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  private pendingPaymentType: BehaviorSubject<string> = new BehaviorSubject<string>('newcard');  // newcard, card_index, tokenize, app
  private newCardService: BehaviorSubject<CardInfo> = new BehaviorSubject<CardInfo>(null);
  private cardIndexService: BehaviorSubject<MyCards> = new BehaviorSubject<MyCards>(null);


  checkPendingPayment(): Boolean {
    return this.isPaymentPending.value;
  }
  setPendingPayment(type: string, card: CardInfo): void {
    this.isPaymentPending.next(true);
    this.pendingPaymentType.next(type);

    if (card) {
      this.newCardService.next(card);
    }
  }

  getPendingType() {
    return this.pendingPaymentType.value;
  }
  getPendingNewCard(): CardInfo {
    return this.newCardService.value;
  }



  unsetPendingPayment(): void {
    this.isPaymentPending.next(false);
    this.pendingPaymentType.next(null);
    this.newCardService.next(null);
    this.cardIndexService.next(null);
  }
  payPendingNewCard (card: CardInfo, session_key: string, loggedIn: Boolean) {
    const  httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'text/html, application/xhtml+xml, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      responseType: 'text'
    };
    const body = this.appendBodyInformation();
    body.append('token', this._get('token'));
    body.append('card_no', card.number);
    body.append('expiry', card.expiry);
    body.append('card_cvv', card.cvv);
    body.append('name', card.name);
    body.append('session_key', session_key);
    // this.isLoading.next(true);
    return this.http.post(this.baseUrl + '/payment/new_card', body, { responseType: 'text'});
  }
  paymentWithStoredCard (card: any, session_key: string, loggedIn: Boolean, is_tokenize?: boolean) {
    // console.log('Here at payment');
    const  httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'text/html, application/xhtml+xml, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      responseType: 'text'
    };
    const body = this.appendBodyInformation();
    body.append('token', this._get('token'));
    if (is_tokenize) {
      body.append('cardindex', card.token);
    } else {
      body.append('cardindex', card.cardindex);
    }
    body.append('card_cvv', card.cvv);
    body.append('session_key', session_key);
    body.append('is_emi', card.is_emi ? '1' : '0');
    body.append('emi_tenure', card.emi_tenure);
    body.append('emi_bank_id', card.emi_bank_id);
    body.append('offer_id', this._get('discountID'));
    body.append('is_offer', this._get('discountID') ? '1' : '0');
    // this.isLoading.next(true);
    return this.http.post(this.baseUrl + '/payment/card_index', body, { responseType: 'text'});
  }

  appendBodyInformation() {
    const body = new FormData();
    body.append('reg_id', this.storage.getItem('_z_r_i', true));
    body.append('enc_key', this.storage.getItem('_z_e_k', true));
    body.append('lang', this.translate.currentLanguage());
    if (this.common && this.common.sessionInformationService &&
      this.common.sessionInformationService.value && this.common.sessionInformationService.value.data &&
      this.common.sessionInformationService.value.data.session_data) {
      body.append('gw_session_key', this.common.sessionInformationService.value.data.session_data.meta.gw_sessionkey);
    }
    return body;
  }
  _get (key) {
    // if (key === 'token') {
    //   return this.storage.getItem(key, true);
    // }
    return this.storage.getItem(key);
  }
}
