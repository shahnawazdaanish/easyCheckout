import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, from, Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ZTransaction} from './shared/models/ZTransaction';
import {ZResponse} from './shared/models/ZResponse';
import {isUndefined} from 'util';
import {GenericResponse} from './shared/models/GenericResponse';
import {TokenData, TokenResponse} from './shared/models/TokenResponse';
import {CardNo, MyCards} from './shared/models/MyCards';
import {CardInfo} from './shared/models/CardInfo';
import {SignUpInfo} from './shared/models/SignUpInfo';
import OfferInformation = app.shared.models.OfferInformation;
import {ErrorInformation} from './shared/models/ErrorInformation';
import EmiInformation = app.shared.models.EmiInformation;
import {TranslateService} from './translate.service';
import {StorageService} from './storage.service';
import {environment} from '../environments/environment.prod';
import {SessionService} from './shared/Services/SessionService';
import {CommonService} from './shared/Services/CommonService';
import DiscountList = app.shared.models.DiscountList;
import {takeUntil} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppdataService implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  stringHelloB: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  stringHello = this.stringHelloB.asObservable();

  storedPhoneB: BehaviorSubject<string> = new BehaviorSubject<string>('');
  storedPhone = this.storedPhoneB.asObservable();

  isMobileB: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isMobile = this.isMobileB.asObservable();

  btnLoadingB: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  btnLoading = this.btnLoadingB.asObservable();

  btnSuccessB: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  btnSuccess = this.btnSuccessB.asObservable();

  btnFailedB: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  btnFailed = this.btnFailedB.asObservable();

  isCardTabEnabledSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isCardTabEnabled = this.isCardTabEnabledSubject.asObservable();

  isNetTabEnabledSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isNetTabEnabled = this.isNetTabEnabledSubject.asObservable();

  isMobTabEnabledSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isMobTabEnabled = this.isMobTabEnabledSubject.asObservable();
  /*
  * Transaction ID listener
  * */
  activeTransactionIDSubject: Subject<string> = new Subject<string>();
  activeTransactionID = this.activeTransactionIDSubject.asObservable();


  /*
  * Session timeout logic
  * */
  isSessionTimeoutSubject: Subject<boolean> = new Subject<boolean>();
  isSessionTimeout = this.isSessionTimeoutSubject.asObservable();

  /*
  * Error page handler
  * All kind of error generation
  * */
  protected errorMessageSubject: BehaviorSubject<ErrorInformation> = new BehaviorSubject<ErrorInformation>(null);
  errorMessage = this.errorMessageSubject.asObservable();


  /*
  * Payment button clicks
  * */
  payBtnClickSubject: Subject<void> = new Subject();
  payBtnClick = this.payBtnClickSubject.asObservable();
  payBtnAct = new BehaviorSubject<Boolean>(false);
  payBtnActive = this.payBtnAct.asObservable();

  /*
  * Login and device registrations
  * */
  protected deviceRegKeys: TokenData;
  userStatus = {};
  isLoggedin = new BehaviorSubject<Boolean>(false);


  /*
  * View changing vars
  * */
  currentCompB = new BehaviorSubject<string>('');
  currentComp = this.currentCompB.asObservable();
  currentCompDataB = new BehaviorSubject<object>(null);
  currentCompData = this.currentCompDataB.asObservable();
  activeItemB: BehaviorSubject<string> = new BehaviorSubject(null);
  activeItem = this.activeItemB.asObservable();

  currentStepB = new BehaviorSubject<string>('');
  currentStep = this.currentStepB.asObservable();

  existingUserB: BehaviorSubject<boolean> = new BehaviorSubject(false);
  existingUser = this.existingUserB.asObservable();

  isCardAvail = new BehaviorSubject<boolean>(false);
  isMobAvail = new BehaviorSubject<boolean>(false);
  isNetAvail = new BehaviorSubject<boolean>(false);

  /*
  * Transactional offers list
  * */
  offerListSubject: BehaviorSubject<OfferInformation> = new BehaviorSubject<OfferInformation>(null);
  offerList = this.offerListSubject.asObservable();

  offerSelectedSubject: BehaviorSubject<DiscountList> = new BehaviorSubject<DiscountList>(null);
  offerSelected = this.offerSelectedSubject.asObservable();

  offerAvailedSubject: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  offerAvailed = this.offerAvailedSubject.asObservable();

  offerAvailedIDSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  offerAvailedID = this.offerAvailedIDSubject.asObservable();

  /*
  * Transactional EMI list
  * */
  emiListSubject: BehaviorSubject<EmiInformation> = new BehaviorSubject<EmiInformation>(null);
  emiList = this.emiListSubject.asObservable();


  // Watch ZTransaction
  private transactionSource = new BehaviorSubject<ZTransaction>(null);
  transaction = this.transactionSource.asObservable();


  // Watch ZCards
  cardsSource = new BehaviorSubject<CardNo[]>(null);
  cards = this.cardsSource.asObservable();


  // Watch Login
  private messageSource = new BehaviorSubject<boolean>(false);
  currentMessage = this.messageSource.asObservable();


  // Watch Loading
  isLoading = new BehaviorSubject<boolean>(false);
  app_loading = this.isLoading.asObservable();
  // Watch Popup Full parameter
  isFullB = new BehaviorSubject<boolean>(false);
  isFull = this.isFullB.asObservable();


  forceLoginPageB = new BehaviorSubject<boolean>(false);
  forceLoginPage = this.forceLoginPageB.asObservable();

  constructor(private http: HttpClient, private translate: TranslateService, private storage: StorageService,
              private common: CommonService) {
    this.deviceRegKeys = {
      reg_id: this.storage.getItem('_z_r_i', true),
      enc_key: this.storage.getItem('_z_e_k', true)
    };
    // this.getTransaction();
    // const loginStatus = localStorage.getItem('isLoggedIn');
    const loginStatus = this.storage.getItem('isLoggedIn');
    this.isLoggedin.next(loginStatus === 'true');
    // const token = localStorage.getItem('token');
    const token = this.storage.getItem('token');
    // console.log(token);
    if (token) {
      this.checkLogin(token);
    }
    this.getSelectedOffer();

    /* this.getClientIP().subscribe((data: any) => {
      // console.log(data);
      if (data.ip && data.ip !== '') {
        // localStorage.setItem('cus_ip', data.ip);
      }
    }, () => {
      // error getting ip();
    }); */
  }

  // baseUrl = 'https://zpay-c36c5.firebaseapp.com/api.php';
  // baseUrl = 'http://localhost/zpayCheckout/api.php';
  // baseUrl = 'https://nookdev.sslcommerz.com/api_com';
  // baseUrl = 'https://epaydev.sslcommerz.com/api.php';
  // baseUrl = 'https://api-epay.sslcommerz.com/securepay/api.php';
  baseUrl = environment.apiEndPoint;

  ngOnInit() {
  }


  /*
  * Tab enable disable
  * */
  changeCardTab(val: boolean) {
    this.isCardTabEnabledSubject.next(val);
  }

  changeNetTab(val: boolean) {
    this.isNetTabEnabledSubject.next(val);
  }

  changeMobTab(val: boolean) {
    this.isMobTabEnabledSubject.next(val);
  }

  changePopUpFull(state: boolean) {
    this.isFullB.next(state);
  }


  changeState(state: string, val: boolean) {
    if (state === 'loading') {
      this.btnLoadingB.next(val);
    } else if (state === 'success') {
      this.btnSuccessB.next(val);
    } else if (state === 'fail') {
      this.btnFailedB.next(val);
    } else {
    }
  }

  /*
  * Error Handler functions
  * */

  showError(status: number, message: string, url?: string): void {
    this.errorMessageSubject.next({status: status, message: message, url: url});
    this.changeView('error-page');
  }


  setActiveTransaction(transactionID: string): void {
    this.activeTransactionIDSubject.next(transactionID);
  }


  setBtnActive() {
    this.payBtnAct.next(true);
  }

  unsetBtnActive() {
    this.payBtnAct.next(false);
  }

  forceLoginPageShow(stateL: boolean) {
    this.forceLoginPageB.next(stateL);
  }


  changeMessage(message: boolean) {
    this.messageSource.next(message);
  }

  changeView(view: string, data?: object, step?: string, forceLoginP?: boolean) {
    this.currentCompB.next(view);
    if (data != null) {
      this.currentCompDataB.next(data);
    }
    if (step != null) {
      console.log(step);
      this.currentStepB.next(step);
    } else {
      this.currentStepB.next('entry-page');
    }
    if (forceLoginP !== undefined) {
      this.forceLoginPageB.next(forceLoginP);
    }
  }
  changeStep(step: string) {
    this.currentCompB.next(step);
  }

  changeStoredPhone(number: string) {
    if (number) {
      this.storedPhoneB.next(number);
    }
  }

  /*
  * Get Token from API with device information
  * Input: osType, deviceId,deviceImei,Model,deviceManufa
  * Output: deviceKey,EncKey
  * */
  getToken(Os, deviceId, deviceImei, deviceModel, deviceManufacturer) {
    const body = new FormData();
    body.append('osType', Os);
    body.append('deviceId', deviceId);
    body.append('deviceImei', deviceImei);
    body.append('Model', deviceModel);
    body.append('deviceManufa', deviceManufacturer);
    this.http.post(this.baseUrl + '/get_token', body).pipe(takeUntil(this.onDestroy$)).subscribe((data: TokenResponse) => {
      // console.log(data);
      if (data.status === 'SUCCESS') {
        if (data.data.reg_id && data.data.enc_key) {
          this.storage.setItem('_z_r_i', data.data.reg_id, true);
          this.storage.setItem('_z_e_k', data.data.enc_key, true);
        } else {
          // No data
        }
      } else {
        // Fail to get registration info
      }
    }, (error) => {
    });
  }

  /*
  * Get transaction details from SSLCommerz
  * this is the main transaction interface to grab details
  * */
  getTransaction(transactionID) {
    // Make the HTTP request:
    this.isLoading.next(true);
    this.http.get<ZResponse>(this.baseUrl + '/session_info/' + transactionID)
      .pipe(takeUntil(this.onDestroy$)).subscribe((data: ZResponse) => {
      this.isLoading.next(false);
      if (data != null && !isUndefined(data.status) && data.status === 'SUCCESS') {
        /*
        * Got the success response from transaction interface
        * */
        this.transactionSource.next(data.data);
      } else {
        /*
        * Transaction invalid or session timed out.
        * */
        // console.log('DATA URL ==>', data.data.url);
        this.isSessionTimeoutSubject.next(true);
        const message = (data.message !== undefined) ? data.message : 'Transaction information is not available. Session may be expired.';
        const url = (data.data.url) ? data.data.url : '';
        this.showError(100, message, url);
      }
      // console.log(this.transaction);
    }, (error) => {
      // console.log('DATA ERROR', error);
      this.isLoading.next(false);
    });
  }

  checkTransaction(transactionID): boolean {
    // Make the HTTP request:
    // this.isLoading.next(true);
    this.http.get<ZResponse>(this.baseUrl + '/check_timeout/' + transactionID,
      {headers: {ignoreLoadingBar: ''}}).pipe(takeUntil(this.onDestroy$)).subscribe((data: ZResponse) => {
      this.isLoading.next(false);
      if (data != null && !isUndefined(data.status) && data.status === 'SUCCESS') {
        /*
        * transaction is alive
        * */
        return true;
      } else {
        /*
        * Transaction session timed out.
        * */
        this.isSessionTimeoutSubject.next(true);
        return false;
      }
      // // console.log(this.transaction);
    }, (error) => {
      this.isLoading.next(false);
      return false;
    });
    return false;
  }

  getBase64(url: string) {
    const body = this.appendBodyInformation();
    body.append('url', url);
    return this.http.post(this.baseUrl + '/get_base64', body);
  }

  checkAlreadyRegistered(number) {
    const body = this.appendBodyInformation();
    body.append('token', this._get('token'));
    body.append('number', number);
    // this.isLoading.next(true);
    return this.http.post(this.baseUrl + '/check_registered', body);
  }

  checkOTP(number, otp) {
    const body = this.appendBodyInformation();
    body.append('token', this._get('token'));
    body.append('number', number);
    body.append('otp', otp);
    // this.isLoading.next(true);
    return this.http.post(this.baseUrl + '/verify_otp', body);
  }

  checkOTPForAuth(number, otp, transSession?: string) {
    const body = this.appendBodyInformation();
    body.append('token', this._get('token'));
    body.append('number', number);
    body.append('otp', otp);
    body.append('gw_session_key', transSession);
    // this.isLoading.next(true);
    return this.http.post(this.baseUrl + '/verify_checkout_otp', body);
  }

  deleteCardAuth(card_index) {
    const body = this.appendBodyInformation();
    body.append('token', this._get('token'));
    body.append('card_index', card_index);
    // this.isLoading.next(true);
    return this.http.post(this.baseUrl + '/delete_card', body);
  }

  getOffers(transactionID) {
    const body = this.appendBodyInformation();
    body.append('token', this._get('token'));
    body.append('session_id', transactionID);
    // this.isLoading.next(true);
    this.http.post(this.baseUrl + '/get_offer', body).pipe(takeUntil(this.onDestroy$)).subscribe((data: OfferInformation) => {
      // console.log(data);
      this.isLoading.next(false);
      this.offerListSubject.next(data);
    }, (error) => {
      this.isLoading.next(false);
    });
  }

  getSelectedOffer() {
    if (typeof(Storage) !== 'undefined') {
      const offID = this.storage.getItem('discountID');
      if (offID !== null) {
        this.setOffer(offID);
      }
    } else {
      alert('Please allow storage to keep your choices');
    }
  }

  setOffer(offerID: string, trxID?: string, item?: DiscountList) {
    if (typeof(Storage) !== 'undefined') {
      this.storage.setItem('discountID', offerID);
      this.storage.setItem('discountTrxID', trxID);
      this.offerAvailedIDSubject.next(offerID);
      this.offerSelectedSubject.next(item);
      this.offerAvailedSubject.next(true);

      this.changeView('card-entry');
    } else {
      alert('Please allow storage to keep your choices');
    }
  }
  removeOffer(temp?: string) {
    if (temp) {
      if (temp === 'yes') {
        this.offerAvailedSubject.next(false);
      } else {
        this.offerAvailedSubject.next(true);
      }
    } else {
      if (typeof(Storage) !== 'undefined') {
        this.storage.removeItem('discountID');
        this.storage.removeItem('discountTrxID');
        this.offerAvailedIDSubject.next(null);
        this.offerSelectedSubject.next(null);
        this.offerAvailedSubject.next(true);
      } else {
        alert('Please allow storage to keep your choices');
      }
    }
  }

  unsetOffer() {
    this.offerAvailedSubject.next(false);
    this.offerAvailedIDSubject.next(null);
    this.offerSelectedSubject.next(null);
  }

  getEmiInfo(transactionID) {
    const body = this.appendBodyInformation();
    body.append('token', this._get('token'));
    body.append('session_id', transactionID);
    // this.isLoading.next(true);
    this.http.post(this.baseUrl + '/get_emi', body).pipe(takeUntil(this.onDestroy$)).subscribe((data: EmiInformation) => {
      // console.log(data);
      this.isLoading.next(false);
      if (data != null && data.status.toLowerCase() === 'success') {
        this.emiListSubject.next(data);
      }
    }, (error) => {
      this.isLoading.next(false);
    });
  }

  checkLogin(token) {
    // Make the HTTP request:
    // this.isLoading.next(true);
    const body = this.appendBodyInformation();
    body.append('cus_session', token);
    this.http.post(this.baseUrl + '/login_status', body).pipe(takeUntil(this.onDestroy$)).subscribe((data: any) => {
      console.log(data);
      this.isLoading.next(false);
      if (data === false) {
        this.logout();
      } else {
        // is Loggedin, do nothing
      }
      // console.log(this.transaction);
    }, (error) => {
      // this.isLoading.next(false);
    });
  }

  // Login Service
  loginUser(username: string, password: string) {
    this.isLoading.next(true);
    const body = new FormData();
    body.append('username', username);
    body.append('password', password);
    this.http.post(this.baseUrl + '/login_user', body).pipe(takeUntil(this.onDestroy$)).subscribe((data) => {
      // console.log(data);
      this.isLoading.next(false);
      return data;
    }, error => {
      this.isLoading.next(false);
      console.log(error);
      return [];
    });
  }

  loginUserWithResponse(username: string, password: string) {
    // this.isLoading.next(true);
    const body = this.appendBodyInformation();
    body.append('username', username);
    body.append('password', password);
    return this.http.post(this.baseUrl + '/login_user', body);
  }

  resetPasswordInit(username: string) {
    // this.isLoading.next(true);
    const body = this.appendBodyInformation();
    body.append('username', username);
    return this.http.post(this.baseUrl + '/forget_password', body);
  }

  resetPasswordVerify(key: string, ip: string) {
    // this.isLoading.next(true);
    const body = this.appendBodyInformation();
    body.append('key', key);
    body.append('ip', ip);
    return this.http.post(this.baseUrl + '/forget_password_verify', body);
  }

  resetPasswordChange(key: string, new_password: string, confirm_password: string, ip: string) {
    // this.isLoading.next(true);
    const body = this.appendBodyInformation();
    body.append('key', key);
    body.append('new_password', new_password);
    body.append('confirm_password', confirm_password);
    body.append('ip', ip);
    return this.http.post(this.baseUrl + '/forget_password_change', body);
  }

  SignUpWithNumber(number: string) {
    const body = this.appendBodyInformation();
    body.append('token', this._get('token'));
    body.append('phone', number);
    // this.isLoading.next(true);
    return this.http.post(this.baseUrl + '/singup_send_otp', body);
  }

  checkoutSendOTP(number: string) {
    const body = this.appendBodyInformation();
    body.append('token', this._get('token'));
    body.append('phone', number);
    // this.isLoading.next(true);
    return this.http.post(this.baseUrl + '/send_checkout_otp', body);
  }

  checkoutReSendOTP(number: string) {
    const body = this.appendBodyInformation();
    body.append('token', this._get('token'));
    body.append('phone', number);
    // this.isLoading.next(true);
    return this.http.post(this.baseUrl + '/resend_checkout_otp', body);
  }

  SignUpWithFullData(signup: SignUpInfo) {
    const body = this.appendBodyInformation();
    body.append('token', this._get('token'));
    body.append('number', signup.number);
    body.append('otp', signup.otp);
    body.append('email', signup.email);
    body.append('password', signup.password);
    // this.isLoading.next(true);
    return this.http.post(this.baseUrl + '/singup_user', body);
  }

  logout() {
    // localStorage.setItem('isLoggedIn', 'false');
    // localStorage.setItem('token', null);
    // localStorage.setItem('phone', null);
    this.storage.setItem('isLoggedIn', 'false');
    this.storage.setItem('token', null);
    this.storage.setItem('phone', null);
    this.isLoggedin.next(false);
    // this.changeView('login');
  }

  appendBodyInformation() {
    const body = new FormData();
    body.append('reg_id', this.storage.getItem('_z_r_i', true));
    body.append('enc_key', this.storage.getItem('_z_e_k', true));
    body.append('lang', this.translate.currentLanguage());
    let gwKey = '';
    if (this.common && this.common.sessionInformationService &&
      this.common.sessionInformationService.value && this.common.sessionInformationService.value.data &&
      this.common.sessionInformationService.value.data.session_data) {
      gwKey = this.common.sessionInformationService.value.data.session_data.meta.gw_sessionkey;
    }
    body.append('gw_session_key', gwKey);

    return body;
  }

  showStoredCards(fromServer: boolean = false, transSessionID?: string) {
    if (fromServer) {
      const body = this.appendBodyInformation();
      body.append('token', this._get('token'));
      body.append('gw_session_key', transSessionID);
      // this.isLoading.next(true);
      this.http.post(this.baseUrl + '/mycards', body).pipe(takeUntil(this.onDestroy$)).subscribe((data: MyCards) => {
        if (data.data != null) {
          this.cardsSource.next(data.data.cardNos);
          this.isLoading.next(false);
          // if (data.data.cardNos.length > 0) {
          //   this.changeView('cards-list');
          // } else {
          //   this.changeView('card-input');
          // }
          if (data && data.data && data.data.cardNos !== undefined && data.data.cardNos.length > 0) {
            this.changeView('cards-list');
          } else {
            this.changeView('card-entry');
          }
        }
      }, (error) => {
        this.isLoading.next(false);
      });
    } else {
      // j
      this.changeView('cards-list');
    }

  }

  paymentWithNewCard(card: CardInfo, session_key: string, loggedIn: Boolean) {
    const httpOptions = {
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
    body.append('save', String(card.save));
    body.append('session_key', session_key);
    body.append('is_emi', card.emi ? '1' : '0');
    body.append('emi_tenure', card.emiTenure);
    body.append('emi_bank_id', card.emiBank);
    body.append('offer_id', this._get('discountID'));
    body.append('is_offer', this._get('discountID') ? '1' : '0');
    // this.isLoading.next(true);
    // return this.http.post(this.baseUrl + '/payment/new_card', body, {responseType: 'text'});
    return this.http.post(this.baseUrl + '/transact', body, {responseType: 'text'});
  }

  _get(key) {
    if (key === 'token') {
      return this.storage.getItem(key);
    }
    return this.storage.getItem(key, true);
  }

  ClickPayButton(event) {
    this.payBtnClickSubject.next(event);
  }

  getClientIP() {
    return this.http.get('https://jsonip.com/');
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }
}
