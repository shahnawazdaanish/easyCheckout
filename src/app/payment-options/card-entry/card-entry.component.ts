import {
  AfterContentInit,
  AfterViewChecked, AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild, ViewChildren
} from '@angular/core';
import {AppdataService} from '../../appdata.service';
import {CardInfo} from '../../shared/models/CardInfo';
import {AlertService} from 'ngx-alerts';
import {ZTransaction} from '../../shared/models/ZTransaction';
import {DOCUMENT} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {CardsService} from '../../cards.service';
import EmiInformation = app.shared.models.EmiInformation;
import {FormsModule} from '@angular/forms';
import Emi = app.shared.models.Emi;
import {animate, style, transition, trigger} from '@angular/animations';
import {SlimScrollEvent} from 'ngx-slimscroll';
import {RegInfo} from '../../shared/models/RegInfo';
import {SignupComponent} from '../../signup/signup.component';
import {GenericResponse} from '../../shared/models/GenericResponse';
import {SignUpInfo} from '../../shared/models/SignUpInfo';
import {MainLoginResponse} from '../../shared/models/MainLoginResponse';
import {LoginResponse} from '../../shared/models/LoginResponse';
import SessionInfo = app.shared.models.SessionInfo;
import {CommonService} from '../../shared/Services/CommonService';
import {OpenClose, SlideInOutAnimation} from '../../shared/animations/animate';
import {NgwWowService} from 'ngx-wow';
import {SessionService} from '../../shared/Services/SessionService';
import {NotifyService} from '../../shared/Services/notify.service';
import {CardNo} from '../../shared/models/MyCards';
import {StorageService} from '../../storage.service';
import DiscountList = app.shared.models.DiscountList;
import OfferInformation = app.shared.models.OfferInformation;
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

declare function loadCleaveInput(): any;

declare function loadPayForm(): any;

declare function initVirtualKeyboardDetector(): any;

declare var payform: any;
declare var $;

@Component({
  selector: 'app-card-entry',
  templateUrl: './card-entry.component.html',
  styleUrls: ['./card-entry.component.css'],
  animations: [SlideInOutAnimation, OpenClose]
})
export class CardEntryComponent implements OnInit, AfterContentInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  @ViewChild('htmlContainer') container;
  @ViewChild('cardphone') CardPhone: ElementRef;
  // transaction: ZTransaction;
  session: SessionInfo;
  trustedHTML;
  isLoggedIn: Boolean;
  regMode: Boolean;
  btnClickS;
  btnActive;
  sessionSub;
  currentGateway: object;
  emiList: EmiInformation;
  currentEmi: Emi;
  showSub = false;
  editing = false;

  currentReg = '';
  otp: string[] = ['', '', '', '', '', ''];
  otpTry = 0;


  numberChecked: Boolean = false;

  @Input() remeber: Boolean;
  @Output() passData: EventEmitter<string> = new EventEmitter<string>();

  card_type: string;
  cvv_type = 'password';
  // card: CardInfo = {
  //   number : '4321 4700 0031 3881',
  //   expiry : '07/22',
  //   cvv : '773',
  //   name : 'Shahnawaz Ahmed',
  //   save : false,
  //   selected : false
  // };
  reg: SignUpInfo = {
    number: '',
    email: '',
    name: '',
    password: '',
    otp: ''
  };

  card: CardInfo = {
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    save: false,
    selected: false,
    phone: ''
  };
  inFocus = {
    number: false,
    expiry: false,
    cvv: false,
    name: false
  };

  number_options: object = {
    creditCard: true,
    onCreditCardTypeChanged: (type) => {
      // // console.log(type);
      this.card_type = type;
    }
  };
  expiry_options: object = {
    date: true,
    datePattern: ['m', 'y']
  };

  isCardNumberValid = false;
  isCardExpiryValid = false;
  isCardCVVValid = false;
  isCardNameValid = false;

  isCardNumberError = false;
  isCardExpiryError = false;
  isCardCVVError = false;

  existingUser = false;
  currentStep = 'entry-page';
  numberVerified = false;

  messegeShown = false;

  timeLeft = 20;
  interval;
  isFull = false;
  isMobile = false;
  cvc_zoom = false;

  cards_list: CardNo[];
  selected_offer: DiscountList;
  offer_availed: Boolean;
  offerList: OfferInformation;
  removing_offer_alert: string;

  forceLoginPage = false;
  forcePaste = false;


  @ViewChild('ccnum') ccnum: ElementRef;
  @ViewChild('expiry') expiry: ElementRef;
  @ViewChild('cvv') cvv: ElementRef;
  @ViewChild('name') name: ElementRef;
  @ViewChild('save') save: ElementRef;

  constructor(private data: AppdataService, private alertService: NotifyService, @Inject(DOCUMENT) private document: any,
              private sanitizer: DomSanitizer, private cardService: CardsService, private common: CommonService,
              private wowService: NgwWowService, private elemRef: ElementRef,
              private sessionService: SessionService, private storage: StorageService) {
    this.btnClickS = this.data.payBtnClick.pipe(takeUntil(this.onDestroy$)).subscribe((evt) => this.parentBtnClick(evt));
    this.sessionSub = this.common.sessionInformation.pipe(takeUntil(this.onDestroy$)).subscribe(trx => {
      this.session = trx;

      if (trx && trx.data != null) {
        this.card.phone = trx.data.session_data.meta.cust_mobile;
      }
    });
    this.data.isLoggedin.pipe(takeUntil(this.onDestroy$)).subscribe(val => this.isLoggedIn = val);
    this.btnActive = this.data.payBtnAct.pipe(takeUntil(this.onDestroy$)).subscribe();
    this.data.emiList.pipe(takeUntil(this.onDestroy$)).subscribe(res => this.emiList = res);
    this.data.isFull.pipe(takeUntil(this.onDestroy$)).subscribe(f => this.isFull = f);
    this.data.isMobile.pipe(takeUntil(this.onDestroy$)).subscribe(f => this.isMobile = f);
    this.data.existingUser.pipe(takeUntil(this.onDestroy$)).subscribe(x => {
      this.existingUser = x;
      if (x) {
        // this.data.changeView('card-entry');
        if (this.isLoggedIn) {
          // load card list
          // this.data.changeView('cards-list');
        } else {
          this.currentStep = 'remember-number';
        }
      } else {
        this.currentStep = 'entry-page';
      }
    });
    this.data.cards.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.cards_list = x);
    this.data.offerSelected.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.selected_offer = x);
    this.data.offerAvailed.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.offer_availed = x);
    this.data.offerList.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.offerList = x);
    this.wowService.init();
  }

  ngOnInit() {
    if (this.currentGateway != null && this.currentGateway['emi'] !== undefined && this.currentGateway['emi'] == 1) {
      this.card.emi = true;
    }
    // // console.log(this.emiList);

    if (this.emiList && this.emiList.data.data !== undefined) {
      if (this.emiList.data.data.emi !== undefined) {
        // this.card.emiBank = this.emiList.data.data.emi[0].emiBankID;

      }
    }
    this.data.currentCompData.pipe(takeUntil(this.onDestroy$)).subscribe(res => this.currentGateway = res);
    this.data.currentStep.pipe(takeUntil(this.onDestroy$)).subscribe(res => {
      // // console.log(res);
      this.currentStep = res;
    });
    this.data.forceLoginPage.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.forceLoginPage = x);
    // loadPayForm();
    if (!this.isFull) {
      initVirtualKeyboardDetector();
    }

    setTimeout(() => {
      this.ccnum.nativeElement.select();
      document.getElementById('ccnum').focus();
    }, 1000);
  }

  ngAfterContentInit() {
    // // // console.log('Loading Cleave');
    // setTimeout(function () {
    // loadCleaveInput();
    // loadPayForm();
    // }, 300);
    // cleave.onCreditCardTypeChanged((event) => {
    //   // // console.log('adsfadsf');
    // });
    // // // console.log('Current Gateway');
    // // // console.log(this.currentGateway);

  }

  changeView(view) {
    this.data.changeView(view);
  }

  keyTab(event, current, next, back) {
    // // console.log(this.forcePaste);
    event.stopPropagation();
    if (!this.forcePaste) {
      this.fillOTP(event, current, next, back, 'key');
    }
  }

  removeInputAndGoBack(current, back) {
    // // console.log(current.value);
    // Backspace pressed
    if (current.value !== '') {
      current.value = '';
    } else {
      current.value = '';
      back.value = '';

      if (back && typeof back.focus !== 'undefined') {
        back.focus();
      }
    }
  }

  phoneEditMode() {
    this.card.phone = '';
    this.editing = true;
    this.CardPhone.nativeElement.focus();
    this.CardPhone.nativeElement.click();
  }

  keyAction(event, current, next, back) {
    // // console.log('otps', this.otp);
    // // console.log('key up');

    let validOTP = true;
    for (let i = 0; i < this.otp.length; i++) {
      if (this.otp[i] !== undefined) {
        if (this.otp[i] === '') {
          validOTP = false;
        } else {

        }
      }
    }
    if (this.otp.length === 6 && validOTP) {
      // this.data.setBtnActive();
      let cardList = false;
      if (this.card.number.length < 10) {
        cardList = true;
      } else {
        cardList = false;
      }
      this.verifyCheckoutOTP(cardList);
    } else {
      this.data.unsetBtnActive();
    }
    if (event.keyCode === 8) {
      const old_current = current.value;
      current.value = '';
      if (back && typeof back.focus !== 'undefined') {
        if (old_current) {
          back.value = '';
        }
        back.focus();
      }
      // back.focus();
    }
  }

  CardChanged(event) {
  }

  validateCC() {
    // RESET ERROR MESSAGE
    if (this.card.number.length <= 18) {
      this.isCardNumberError = false;
    }

    this.card.emi = this.session.data.session_data != null ? (Number(this.session.data.session_data.meta.emi) === 1) : false;
    // this.card.emi = true;
    if (this.card.emi) {
      // EMI BIN CHECKING - IF NOT ALLOWED BIN THEN REJECT
      const firstSix = this.card.number.replace(' ', '').substr(0, 6);
      if (firstSix.length >= 6 && this.emiList) {

        let cardEmi: Emi;
        for (const emi of this.emiList.data.data.emi) {
          for (const bin of emi.binList) {
            if (bin === firstSix) {
              cardEmi = emi;
            }
          }
        }
        // // console.log(cardEmi);
        if (cardEmi) {
          this.currentEmi = cardEmi;
          this.card.emiBank = cardEmi.emiBankID;
        } else {
          this.currentEmi = null;
          this.card.emiBank = null;
        }

        const obj = this.emiList.data.data.emi.filter((data) => {
          return data.emiBankID === this.card.emiBank;
        })[0];
        if (obj) {
          if (!(obj.binList.indexOf(firstSix) > -1)) {
            if (this.messegeShown === false) {
              this.alertService.warning('This card number is not allowed for EMI transaction with selected emi bank');
              this.messegeShown = true;
            }
            const that = this;
            setTimeout(function () {
              that.messegeShown = false;
            }, 3000);

            return this.isCardNumberValid = false;
          }
        }
      } else {
        this.currentEmi = null;
        this.card.emiBank = null;
      }
    }


    if (payform) {
      const valid = payform.validateCardNumber(this.card.number);
      this.card.brand = payform.parseCardType(this.card.number);

      const card_len = this.card.number.length;
      if (valid && card_len >= 19 || (valid && this.card.brand && this.card.brand.toLowerCase() === 'amex' && card_len >= 17)) {
        this.expiry.nativeElement.focus();
        this.isCardNumberValid = true;
        this.isCardNumberError = false;
      } else {
        this.isCardNumberValid = false;
        if (card_len >= 19 || (this.card.brand && this.card.brand.toLowerCase() === 'amex' && card_len >= 17)) {
          this.isCardNumberError = true;
        }
      }
    }
    this.tryBtnActive();
  }

  validateExpiry() {
    if (this.card.expiry.length < 5) {
      this.isCardExpiryError = false;
    }
    if (payform && this.card.expiry.length >= 5) {
      const exp = payform.parseCardExpiry(this.card.expiry);
      if (exp.month) {
        const valid = payform.validateCardExpiry(exp.month, exp.year);
        if (valid) {
          this.cvv.nativeElement.focus();
          this.isCardExpiryValid = true;
          this.isCardExpiryError = false;
        } else {
          this.isCardExpiryValid = true;
          this.isCardExpiryError = true;
        }
      }
    }
    this.tryBtnActive();
  }

  validateCVC() {
    if (this.card.cvv.length < 3) {
      this.isCardCVVError = false;
    }
    if (payform && this.card.cvv.length >= 3) {
      const valid = payform.validateCardCVC(this.card.cvv);
      // // console.log('card cvv validation: ' + valid);
      if (valid && this.card_type !== 'amex') {
        this.name.nativeElement.focus();
        this.isCardCVVValid = true;
        this.isCardCVVError = false;
      } else if (valid && this.card_type === 'amex' && this.card.cvv.length === 4) {
        this.name.nativeElement.focus();
        this.isCardCVVValid = true;
        this.isCardCVVError = false;
      } else {
        this.isCardCVVValid = false;
        this.isCardCVVError = true;
      }
    }
    this.tryBtnActive();
  }

  validateName() {
    if (this.card.name) {
      this.isCardNameValid = true;
    } else {
      this.isCardNameValid = false;
    }
    this.tryBtnActive();
  }

  tryBack(type) {
    switch (type) {
      case 'expiry' :
        if (this.card.expiry.length === 0) {
          this.ccnum.nativeElement.focus();
        }
        break;
      case 'cvv' :
        if (this.card.cvv.length === 0) {
          this.expiry.nativeElement.focus();
        }
        break;
      case 'name' :
        if (this.card.name.length === 0) {
          this.cvv.nativeElement.focus();
        }
        break;
      default :
        break;
    }
  }

  tryBtnActive() {
    const cardInfoValid = this.validateCardInformation();
    const isLoggedIn = this.isLoggedIn;
    // // console.log(cardInfoValid);
    if (cardInfoValid) {
      // this.btnActive.next(true);
      // // console.log(this.card.save);
      // // console.log('isLogin : ' + this.isLoggedIn);
      if (this.card.save) {
        if (!this.isLoggedIn) {
          // // console.log('show mobile number taking block');
          $('#remember_card_mobile').slideDown();
          this.data.unsetBtnActive();

          // if (this.session.data.request.is_tokenize) {
          //   // Tokenize transaction does not required login
          //   this.regMode = false;
          //   this.data.setBtnActive();
          // } else {
          //   // // console.log('Trying to deactivate button');
          //   this.data.unsetBtnActive();
          //   this.regMode = true;
          //   if (this.currentReg === '') {
          //     this.currentReg = 'phone';
          //     this.scrollToNext('remember_card_mobile');
          //   }
          //   this.checkRegDone();
          // }

        } else {
          $('#remember_card_mobile').slideUp();
          // // console.log('Trying to active button');
          this.regMode = false;
          this.data.setBtnActive();
        }
      } else {
        $('#remember_card_mobile').slideUp();
        this.regMode = false;
        this.data.setBtnActive();
      }
    } else {
      if (this.card.save) {
        // If tried to remember card without card info
        this.alertService.warning('Please provide valid card information');
      }
      this.card.save = false;
      this.data.unsetBtnActive();
    }
  }

  checkRegDone() {
    if (this.reg.number !== null && this.reg.number !== '') {
      if (this.reg.password.length > 0) {
        // Check old or new user
        const old_user = this.reg.oldUser;
        if (old_user) {
          // // console.log('old user');
          this.data.payBtnAct.next(true);
        } else {
          // // console.log('new user');
          // // console.log(this.reg.email);
          // // console.log(this.reg.otp);
          if (this.reg.email) {
            // // console.log('email pass');
            if (this.reg.otp) {
              // // console.log('otp pass');
              if (this.reg.strength && this.reg.strength >= 4) {
                this.data.payBtnAct.next(true);
              } else {
                // password is not strong.
              }
            } else {
              this.data.payBtnAct.next(false);
              // this.alertService.warning('OTP invalid! Please try again');
            }
          } else {
            this.data.payBtnAct.next(false);
            // this.alertService.warning('You must provide an email address');
          }
        }
      }
    }
  }

  showCardView(input: string) {
    this.setInputBoolean(input, true);
    // // console.log(this.inFocus);
    $('.card-wrapper').addClass('open_card').show();
  }

  hideOnBlur(input: string) {

    const inF = this.inFocus.number || this.inFocus.expiry || this.inFocus.cvv || this.card.name;
    const allEmpty = this.card.number && !this.card.expiry && !this.card.cvv && !this.card.name;
    // // console.log(inF);
    // // console.log(allEmpty);
    // // console.log(this.inFocus);

    if ((inF && allEmpty) || (inF && !allEmpty)) {
      $('.card-wrapper').addClass('open_card').show();
    } else {
      $('.card-wrapper').removeClass('open_card').addClass('slideInRight').hide(400);
    }
    this.setInputBoolean(input, false);
  }

  setInputBoolean(input, val) {
    // // console.log(input);
    switch (input) {
      case 'number' :
        this.inFocus.number = val;
        break;
      case 'expiry' :
        this.inFocus.expiry = val;
        break;
      case 'cvv' :
        this.inFocus.cvv = val;
        break;
      case 'name' :
        this.inFocus.name = val;
        break;
      default:
        break;
    }
  }

  validateCardInformation() {
    let valid = false;
    if (payform) {
      const numberValid = payform.validateCardNumber(this.card.number);
      const expiryValid = payform.parseCardExpiry(this.card.expiry);
      const cvvValid = payform.validateCardCVC(this.card.cvv);
      const nameValid = this.card.name !== '';
      if (numberValid && expiryValid && cvvValid && nameValid) {
        valid = true;
      } else {
      }
    } else {
    }
    return valid;
  }

  changeCvvInputType() {
    this.cvv_type = 'text';
    setTimeout(() => {
      this.cvv_type = 'password';
    }, 500);
  }

  switchClasses(event, type) {
    const elem = document.getElementById('tapImg') as HTMLElement;

    if (type === 'loading') {
      event.srcElement.classList.add('loading-btn--pending');
      event.srcElement.classList.remove('loading-btn--success');
      event.srcElement.classList.remove('loading-btn--fail');
      elem.classList.add('hidden');
    } else if (type === 'success') {
      event.srcElement.classList.remove('loading-btn--pending');
      event.srcElement.classList.add('loading-btn--success');
      event.srcElement.classList.remove('loading-btn--fail');
      elem.classList.add('hidden');
    } else if (type === 'fail') {
      event.srcElement.classList.remove('loading-btn--pending');
      event.srcElement.classList.remove('loading-btn--success');
      event.srcElement.classList.add('loading-btn--fail');
    } else {
      event.srcElement.classList.remove('loading-btn--pending');
      event.srcElement.classList.remove('loading-btn--success');
      event.srcElement.classList.remove('loading-btn--fail');
      elem.classList.remove('hidden');
    }
  }

  parentBtnClick(event?) {
    // // console.log(event);
    this.switchClasses(event, 'loading');
    if (this.card.number && this.card.expiry && this.card.cvv && this.card.name && this.session) {
      // this.sessionService.getSessionInformation(this.session.data.session_key);

      if (this.card.save) {
        if (this.session.data.request.is_tokenize) {
          // No checking required for login
        } else {
          if (this.isLoggedIn) {
          } else {
            this.cardService.setPendingPayment('newcard', this.card);
            // // console.log('not save');
            // this.data.changeView('login');

            if (!this.reg.oldUser) {
              if (this.reg.number && this.reg.otp && this.reg.email && this.reg.password && this.reg.strength === 4) {

                this.data.SignUpWithFullData(this.reg).pipe(takeUntil(this.onDestroy$)).subscribe((data: GenericResponse) => {
                  // // console.log(data);
                  if (data.status === 'SUCCESS') {
                    this.alertService.success(data.message);
                    this.loginUser();
                  } else {
                    this.alertService.danger(data.message);
                  }
                });
              } else {
                this.switchClasses(event, '');
                this.alertService.warning('Registration information are invalid, Please check your inputs again');
              }
            } else {
              this.loginUser();
            }
            return;
          }
        }
      } else {
        this.data.btnLoadingB.next(false);
      }

      // // console.log(this.card);

      this.data.paymentWithNewCard(this.card, this.session.data.session_key, this.isLoggedIn)
        .pipe(takeUntil(this.onDestroy$)).subscribe((data: any) => {
        // this.card.number = '';
        // this.card.expiry = '';
        this.card.cvv = '';
        // this.card.name = '';
        this.card.save = false;


        this.switchClasses(event, '');

        this.cardService.unsetPendingPayment();


        // // console.log(data);
        let resp: any;
        try {
          resp = JSON.parse(data);
        } catch (e) {
        }
        if (resp && resp.data && resp.data.type) {
          if (resp.status === 'success' && resp.data.type === 'moto') {
            this.switchClasses(event, 'success');
            const ur = resp.data.url;
            setTimeout(function () {

              if (window.opener != null) {
                window.opener.postMessage(JSON.stringify(
                  {status: 'success', type: 'gw_redirect', url: ur}
                ), '*');
              }
              if (window.parent != null) {
                window.parent.postMessage(JSON.stringify(
                  {status: 'success', type: 'gw_redirect', url: ur}
                ), '*');
              }
              if (!this.parent.isFull) {
                window.location.href = ur;
              }
            }, 1500);
          } else {
            this.switchClasses(event, 'fail');
            this.alertService.danger('Transaction is not successful, try again');
          }
        } else if (resp && resp.status && resp.status === 'fail') {
          this.alertService.danger(resp.message ? resp.message : 'Transaction is not successful, try again');
        } else {

          if (resp && resp.status && resp.status === 'fail') {
            this.alertService.danger(resp.data.message ? resp.data.message : 'Transaction is not successful, try again');
            return;
          }


          if (window.opener != null) {
            window.opener.postMessage(JSON.stringify(
              {status: 'success', type: 'otp', data: data}
            ), '*');
          }
          if (window.parent != null) {
            window.parent.postMessage(JSON.stringify(
              {status: 'success', type: 'otp', data: data}
            ), '*');
          }

          this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml(data);

          setTimeout(() => {
            const scripts = this.container.nativeElement.getElementsByTagName('script');
            for (const script of scripts) {
              eval(script.text);
            }

            const f = this.container.nativeElement.getElementsByTagName('form')[0];
            if (f) {
              f.submit();
            }
          });
        }

        // // // console.log(data);
        // this.document.body.innerHTML = data;
        // setTimeout(() => {
        //   this.document.forms[0].submit();
        // }, 300);
      }, (error) => {
        // // console.log(error);
      });

    } else {
      this.switchClasses(event, '');
      this.alertService.danger('Invalid card information, Please fill card form properly');
    }
  }

  loadTenure(event, emiBank) {
    this.currentEmi = undefined;
    this.card.emiTenure = undefined;
    // // console.log(event);
    // // console.log(emiBank);
    const emiB: Emi[] = this.emiList.data.data.emi.filter(obj => {
      return obj.emiBankID === emiBank;
    });
    // // console.log(emiB);
    if (emiB.length > 0) {
      this.currentEmi = emiB[0];
    }
    this.showSub = true;
  }

  listenChange($event) {
    this.isCardInOffer();
    // // console.log($event);
    setTimeout(() => {
      this.tryBtnActive();
    }, 0);
  }


  scrollToNext(div?: string) {
    this.passData.emit((div != null) ? div : '220');
  }

  scrollToPrev() {
    this.passData.emit('-220');
  }

  checkRegistered(number) {
    const regex = number.match('^(?:\\+88|01)?(?:\\d{11}|\\d{13})$');
    if (regex) {
      if (!this.numberChecked) {
        this.numberChecked = true;

        this.data.checkAlreadyRegistered(number).pipe(takeUntil(this.onDestroy$)).subscribe((data) => {
          if (data) {
            this.alertService.warning('You are with us already, Please login to pay');

            this.reg.oldUser = true;
            this.currentReg = 'login_password';
            this.scrollToNext('login_password');
          } else {
            this.data.SignUpWithNumber(this.reg.number).subscribe((res: GenericResponse) => {
              // // console.log(res);
              if (res.status === 'SUCCESS') {
                this.alertService.success(res.message);
                this.reg.oldUser = false;
                this.currentReg = 'otp';
                this.scrollToNext('remember_card_otp');
                // this.data.unsetBtnActive();
              } else {
                this.alertService.danger(res.message);
              }
            }, error1 => {
              this.alertService.warning('Internet connection issue. Try again');
            });
          }

        }, (error) => {
        });

      }
    } else {
      this.numberChecked = false;
    }

  }

  checkOTP(number) {
    const regex = number.match('^\\d{6}$');
    if (regex) {
      if (!this.numberChecked) {
        this.numberChecked = true;

        this.data.checkOTP(this.reg.number, this.reg.otp).pipe(takeUntil(this.onDestroy$)).subscribe((data) => {
          if (data) {
            this.currentReg = 'email_password';
            this.scrollToNext('remember_card_password');
          } else {
            this.alertService.warning('Invalid OTP number, Please try again');
          }

        }, (error) => {
          this.alertService.danger('Unable to check OTP, Please try again');
        });

      }
    } else {
      this.numberChecked = false;
    }

  }

  changeNumber() {
    this.currentReg = 'phone';
    setTimeout(() => {
      this.scrollToNext('remember_card_mobile');
    }, 200);
  }

  resendOTP() {
    this.data.SignUpWithNumber(this.reg.number).pipe(takeUntil(this.onDestroy$)).subscribe((res: GenericResponse) => {
      // // console.log(res);
      if (res.status === 'SUCCESS') {
        this.alertService.success(res.message);
        this.currentReg = 'otp';
        this.scrollToNext('remember_card_otp');
        // this.data.unsetBtnActive();
      } else {
        this.alertService.danger(res.message);
      }
    }, error1 => {
      this.alertService.warning('Internet connection issue. Try again');
    });
  }

  sendCheckoutOTP() {
    // // console.log(this.card.phone);
    if (this.card.phone !== '') {
      this.data.checkoutSendOTP(this.card.phone).pipe(takeUntil(this.onDestroy$)).subscribe((res: GenericResponse) => {
        // console.log(res);
        if (res.status === 'SUCCESS') {
          this.alertService.success(res.message);
          // this.currentReg = 'otp';
          // this.scrollToNext('remember_card_otp');
          // this.data.unsetBtnActive();
          this.currentStep = 'remember-otp';
          $('#remember_card_mobile').slideUp();
          $('#remember_card_otp').slideDown();
        } else {
          this.alertService.danger(res.message);
        }
      }, error1 => {
        this.alertService.warning('Internet connection issue. Try again');
      });
    } else {
      this.alertService.warning('Please provide valid phone number to continue');
    }
  }

  resendCheckoutOTP() {
    // console.log(this.card.phone);
    if (!this.numberVerified) {
      if (this.card.phone !== '') {
        this.data.checkoutReSendOTP(this.card.phone).pipe(takeUntil(this.onDestroy$)).subscribe((res: GenericResponse) => {
          // console.log(res);
          if (res.status === 'SUCCESS') {
            this.startTimer();
            this.alertService.success(res.message);
            // this.currentReg = 'otp';
            // this.scrollToNext('remember_card_otp');
            // this.data.unsetBtnActive();
            // $('#remember_card_mobile').slideUp();
            // $('#remember_card_otp').slideDown();
          } else {
            this.alertService.danger(res.message);
          }
        }, error1 => {
          this.alertService.warning('Internet connection issue. Try again');
        });
      } else {
        this.alertService.warning('Please provide valid phone number to continue');
      }
    }
  }

  verifyCheckoutOTP(cardList?: boolean) {
    if (this.otpTry >= 3) {
      this.otpTry = 0;
      this.alertService.warning('Since you have tried more than 3 times, Please start again');
      this.data.changeView('card-entry');
      this.currentStep = 'entry-page';
    }
    this.otpTry++;

    if (this.otp.length > 5) {
      const transSession = this.session && this.session.data && this.session.data.session_data ?
        this.session.data.session_data.meta.gw_sessionkey : '';

      this.data.checkOTPForAuth(this.card.phone, this.otp.join(''), transSession)
        .pipe(takeUntil(this.onDestroy$)).subscribe((data: GenericResponse) => {
        if (data) {
          // console.log(data);
          if (data.status === 'SUCCESS') {
            this.alertService.success('OTP information verified successfully');
            this.numberVerified = true; // update all about verified

            if (data.data.data.custSession !== undefined) {
              this.data.isLoggedin.next(true);
              // localStorage.setItem('isLoggedIn', 'true');
              // localStorage.setItem('token', data.data.data.custSession);
              // localStorage.setItem('phone', this.card.phone);
              this.storage.setItem('isLoggedIn', 'true');
              this.storage.setItem('token', data.data.data.custSession);
              this.storage.setItem('phone', this.card.phone);
              this.data.changeStoredPhone(this.card.phone);
            }
            if (this.existingUser) {
              if (!this.card.save) {
                if (cardList) {
                  this.data.changeView('cards-list');
                } else {
                  this.data.changeView('card-entry');
                }
              } else {
                this.data.setBtnActive();
              }
              // this.data.changeView('cards-list');
            } else {
              if (this.card.number !== '' && this.card.expiry !== '' && this.card.cvv !== '' && this.card.name !== '') {
                this.data.setBtnActive();
              } else {
                this.data.changeView('cards-list');
              }
            }
          } else {
            this.alertService.warning('OTP information does not match, try again');
          }
        } else {
          this.alertService.warning('Invalid OTP number, Please try again');
        }

      }, (error) => {
        this.alertService.danger('Unable to check OTP, Please try again');
      });

    } else {
      this.data.unsetBtnActive();
    }

  }

  checkStrength(strength) {
    this.reg.strength = strength;
  }

  SignUpWithData() {
    this.data.SignUpWithFullData(this.reg).subscribe((data: GenericResponse) => {
      // console.log(data);
      if (data.status === 'SUCCESS') {
        this.alertService.success(data.message);
        this.data.changeView('login');
      } else {
        this.alertService.danger(data.message);
      }
    });
  }

  ngOnDestroy() {
    // this.data.unsetBtnActive();
    // this.btnClickS.unsubscribe();
    // this.sessionSub.unsubscribe();
    $('.card-wrapper').removeClass('open_card').hide();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  loginUser() {
    const resp = this.data.loginUserWithResponse(this.reg.number, this.reg.password).pipe(takeUntil(this.onDestroy$))
      .subscribe((res: MainLoginResponse) => {
        // this.data.isLoading.next(false);
        if (res.status) {
          if (res.status === 'SUCCESS') {
            const loginResp: LoginResponse = res.data;
            if (loginResp.status === 'success') {
              // localStorage.setItem('isLoggedIn', 'true');
              // localStorage.setItem('token', loginResp.data.custSession);
              this.storage.setItem('isLoggedIn', 'true');
              this.storage.setItem('token', loginResp.data.custSession);
              this.data.isLoggedin.next(true);

              // console.log('Pending payment?');
              // console.log(this.cardService.checkPendingPayment());
              if (this.cardService.checkPendingPayment()) {
                const type = this.cardService.getPendingType();
                // console.log('Pending Type : ' + type);
                if (type === 'newcard') {
                  const card: CardInfo = this.cardService.getPendingNewCard();
                  // console.log('pending card');
                  // console.log(card);
                  if (card) {
                    this.cardService.payPendingNewCard(card, this.session.data.session_key,
                      true).subscribe((log_resp) => {
                      this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml(log_resp);

                      setTimeout(() => {
                        const scripts = this.container.nativeElement.getElementsByTagName('script');
                        for (const script of scripts) {
                          eval(script.text);
                        }

                        const f = this.container.nativeElement.getElementsByTagName('form')[0];
                        if (f) {
                          f.submit();
                        }
                      });
                    }, (error) => {
                      // console.log(error);
                    });
                  } else {
                    // Card information not available, Skip pending payment.
                    // console.log('card info not available');
                  }
                } else {
                  // Skipping for pending payment as it is undefined.
                  // console.log('pending payment not available');
                }
              } else {

                if (loginResp.data.cardNos.length > 0) {
                  this.data.cardsSource.next(loginResp.data.cardNos);
                  this.data.showStoredCards();
                } else {
                  this.data.changeView('cards');
                }
              }
            } else {
              this.alertService.danger('Unable to logged you in system. Please try again later');
            }
          } else {
            // Data unavailable
            this.alertService.danger('Please check your login credentials');
          }
        }
        // this.router.navigate([this.returnUrl]);
      }, error => {
        this.data.isLoading.next(false);
        // console.log(error);
      });
  }


  startTimer() {
    this.timeLeft = 20;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        // this.timeLeft = 15;
        clearInterval(this.interval);
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  isCardInOffer() {
    // console.log(this.card.emiTenure);
    // if (this.card.emiTenure !== undefined) {
    //   this.data.removeOffer();
    //   return false;
    // }
    // console.log(this.offerList);
    // console.log('IS NUMBER OR NOT > ', isNaN(Number(this.card.emiTenure)));
    if (isNaN(Number(this.card.emiTenure))) {
    } else {
      if (this.selected_offer) {
      }
      this.data.removeOffer();
      return false;
    }
    // console.log(this.offerList);
    const firstSix = this.card.number.replace(' ', '').substr(0, 6);
    const firstOne = this.card.number.replace(' ', '').substr(0, 1);
    // if (firstSix.length >= 6 && this.offerList && this.offerList.data && this.offerList.data.data) {
    if (this.offerList && this.offerList.data && this.offerList.data.data) {

      let cardOffer: DiscountList;
      for (const offer of this.offerList.data.data.discountList) {
        // console.log('all', offer.allowedBIN.length);
        // console.log('fall', offer.firstDigitAllowed.length);
        if (offer.allowedBIN.length > 0) {
          for (const bin of offer.allowedBIN) {
            if (bin === firstSix) {
              cardOffer = offer;
            }
          }
        } else if (offer.firstDigitAllowed.length > 0) {
          for (const bin of offer.firstDigitAllowed) {
            if (bin === firstOne) {
              cardOffer = offer;
            }
          }
        }
      }
      // console.log('Card Offer', cardOffer);
      // console.log('Card Tenure', this.card.emiTenure);
      if (cardOffer) {
        // this.currentEmi = cardEmi;
        // this.card.emiBank = cardEmi.emiBankID;
        // this.card.offer = cardOffer;
        this.removing_offer_alert = '';
        this.data.setOffer(cardOffer.AvailDiscountId, this.session.data.session_key, cardOffer);
        return true;
      } else {
        // console.log(this.selected_offer);
        if (this.selected_offer != null) {
          // console.log('Offer was selected: ' + this.selected_offer.AvailDiscountId);
          this.removing_offer_alert = 'Proceed without offer';
        }
        this.data.removeOffer();
        this.card.offer = null;
      }
      return false;
    } else {
      if (this.selected_offer != null) {
      } else {
        this.data.removeOffer();
      }
      this.card.offer = null;
      return false;
    }
  }

  removeOffer() {
    this.data.removeOffer();
  }

  checkEMITenure() {
    // console.log(this.card.emiTenure);
    if (!isNaN(Number(this.card.emiTenure))) {

      // console.log('selected offer but in EMI');
      this.removing_offer_alert = 'Discount is not applicable on EMI Products.';
      this.data.removeOffer('yes');
    } else {
      // console.log('NOT EMI');
      this.data.removeOffer('no');
      this.removing_offer_alert = '';
    }
  }

  onPaste(event: ClipboardEvent) {
    this.forcePaste = true;
    this.fillOTP(event, null, null, null, 'paste');
  }

  fillOTP(event, current?, next?, back?, type?: string) {
    // console.log('EVENT TYPE ====> ' + type);
    if (type === 'key') {
      // console.log('otps', this.otp);
      // console.log('key clicked');
      const inputted_value = event.target.value;
      let keyCode = event.keyCode;
      // console.log('KEYCODE: ', keyCode);

      if (keyCode !== 8) {
        if (keyCode === 229 && inputted_value === '') {
          this.removeInputAndGoBack(current, back);
          return;
        }
        if (inputted_value !== '') {
          if (!isNaN(inputted_value)) {
            if (inputted_value.length > 1) {
              event.target.value = inputted_value.substr(0, 1);
            }

            if (next && typeof next.focus !== 'undefined') {
              next.focus();
            }

            let validOTP = true;
            for (let i = 0; i < this.otp.length; i++) {
              if (this.otp[i] !== undefined) {
                if (this.otp[i] === '' || this.otp[i] == null) {
                  validOTP = false;
                } else {

                }
              }
            }
            if (this.otp.length === 6 && validOTP) {
              // this.data.setBtnActive();
              let cardList = false;
              if (this.card.number.length < 10) {
                cardList = true;
              } else {
                cardList = false;
              }
              // console.log('OTP VALUE CHECKING', this.otp);
              this.verifyCheckoutOTP(cardList);
            } else {
              this.data.unsetBtnActive();
            }

          } else {
            this.alertService.warning('Please input digit as OTP');
          }
        } else {

        }
      } else {
        this.removeInputAndGoBack(current, back);
      }


      // const nextInput = event.srcElement.nextElementSibling;
      // // console.log( event.srcElement.nextSibling);
      // // console.log(nextInput);
      // if (nextInput == null) {
      //   return;
      // } else {
      //   nextInput.focus();
      // }
      // if (event.keyCode === 8) {
      //   current.value = '';
      //   if (back && typeof back.focus !== 'undefined') {
      //     back.focus();
      //   }
      //   // back.focus();
      // } else {
      //   // next.focus();
      // }

    } else if (type === 'paste') {
      const intRegex = /^\d+$/;
      const clipboardData = event.clipboardData || (<any>window).clipboardData || event.originalEvent.clipboardData;
      const pastedText = clipboardData.getData('text');
      //// console.log(pastedText);
      //// console.log(pastedText.length);
      //// console.log(intRegex.test(pastedText));
      if (pastedText.length === 6 && intRegex.test(pastedText)) {
        const parsedOtp = pastedText.split('');
        // // console.log(parsedOtp);
        this.otp = parsedOtp;
        let cardList = false;
        if (this.card.number.length < 10) {
          cardList = true;
        } else {
          cardList = false;
        }
        this.verifyCheckoutOTP(cardList);
        // // console.log(this.otp);
        setTimeout(() => {
          this.forcePaste = false;
          event.preventDefault();
        }, 1000);
      }
    } else {

    }
  }
}
