import {AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {AppdataService} from '../../appdata.service';
import {CardNo, MyCards} from '../../shared/models/MyCards';
import {ZTransaction} from '../../shared/models/ZTransaction';
import {AlertService} from 'ngx-alerts';
import {CardsService} from '../../cards.service';
import {DomSanitizer} from '@angular/platform-browser';
import {forEach} from '@angular/router/src/utils/collection';
import SessionInfo = app.shared.models.SessionInfo;
import Card = app.shared.models.Card;
import EmiInformation = app.shared.models.EmiInformation;
import {CardInfo} from '../../shared/models/CardInfo';
import Emi = app.shared.models.Emi;
import {GenericResponse} from '../../shared/models/GenericResponse';
import {SessionService} from '../../shared/Services/SessionService';
import {NotifyService} from '../../shared/Services/notify.service';
import {CardToBeSubmit} from '../../shared/models/CardToBeSubmit';
import {BehaviorSubject, Subject} from 'rxjs';
import OfferInformation = app.shared.models.OfferInformation;
import DiscountList = app.shared.models.DiscountList;
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit, AfterContentInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  @Input() session: SessionInfo;
  @ViewChild('htmlContainer') container;
  @ViewChild('pBtn') payBtn: ElementRef;
  @ViewChildren('list_cvv') ListCvv;
  trustedHTML;
  cardsList: CardNo[];
  emiList: EmiInformation;
  transaction: ZTransaction;
  trxS;
  isLoggedIn: Boolean;
  btnClickS;
  btnActive;
  loginS;
  cvv;
  existingUser = false;
  palette: any;
  deleteB: any[] = [true, true, true, true, true, true, true];
  deleteH: any[] = [false, false, false, false, false, false, false];

  card: CardInfo = {
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    save: false,
    selected: false,
    emiBank: null,
    emiTenure: null
  };
  currentEmi: Emi;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  numberOfStoredCard = [];

  offerList: OfferInformation;


  constructor(private data: AppdataService, private alert: NotifyService, private cardService: CardsService,
              private sanitizer: DomSanitizer, private sessionService: SessionService) {
    this.trxS = this.data.transaction.pipe(takeUntil(this.onDestroy$)).subscribe(trx => this.transaction = trx);
    this.btnClickS = this.data.payBtnClick.pipe(takeUntil(this.onDestroy$)).subscribe((event) => this.parentBtnClick(event));
    this.loginS = this.data.isLoggedin.pipe(takeUntil(this.onDestroy$)).subscribe(l => this.isLoggedIn = l);
    this.data.emiList.pipe(takeUntil(this.onDestroy$)).subscribe(res => this.emiList = res);
    this.data.existingUser.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.existingUser = x);
    this.data.offerList.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.offerList = x);
  }

  ngOnInit() {
    if (this.session && this.session.data && this.session.data.session_data) {
      this.numberOfStoredCard = new Array(Number(this.session.data.session_data.meta.numberOfCardSaved));
      this.data.showStoredCards(true, this.session.data.session_data.meta.gw_sessionkey);
    }

    this.isLoading$.next(true);
    this.data.cards.pipe(takeUntil(this.onDestroy$)).subscribe(
      cards => {
        if (cards) {
          this.cardsList = cards;
          if (this.cardsList !== undefined) {
            if (this.cardsList.length > 0) {
              this.isLoading$.next(false);
            } else {
              this.data.changeView('card-entry');
            }
          } else {
            // nothing to do
          }
        } else {
          // No cards\
        }
      });
    this.data.unsetBtnActive();
  }

  ngAfterContentInit() {
    // if (this.cardsList) {
    //   this.cardsList.length > 0 ? this.data.changeView('cards-list') : this.data.changeView('card-entry');
    // } else {
    //   const sesTrs = this.session && this.session.data && this.session.data.session_data ?
    //     this.session.data.session_data.meta.gw_sessionkey : '';
    //   this.data.showStoredCards(true, sesTrs);
    // }
  }

  loadCardEntryPage() {
    this.data.changeView('card-entry');
  }

  switchClasses(event, type) {
    const target = event.target || event.srcElement || event.currentTarget;
    const btnID = target.classList.contains('loading-btn');
    const elem = document.getElementById('tapImg') as HTMLElement;
    // if (!btnID) {
    //   event.srcElement = event.parentElement;
    // }

    //if (btnID) {
    event.preventDefault();
    event.stopPropagation();
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
      elem.classList.add('hidden');
    } else {
      event.srcElement.classList.remove('loading-btn--pending');
      event.srcElement.classList.remove('loading-btn--success');
      event.srcElement.classList.remove('loading-btn--fail');
      elem.classList.remove('hidden');
    }
    //}
  }

  parentBtnClick(event?) {
    this.switchClasses(event, 'loading');
    // CHECK IF THIS TRANSACTION IS TOKENIZE OR NOT
    // const isTokenize: boolean = this.session && this.session.data && this.session.data.request.is_tokenize === 1 && 1 !== 1;

    const cardTbS: CardToBeSubmit = {
      cardindex: '',
      cvv: '',
      is_emi: false,
      emi_bank_id: '',
      emi_tenure: ''
    };
    let card: CardNo = null;
    // if (isTokenize) {
    //   card = this.session.data.session_data.cards.find(x => x.selected);
    // } else {
    card = this.cardsList.find(x => x.selected);
    // }
    if (card) {
      // this.sessionService.getSessionInformation(this.session.data.session_key);
      if (this.cvv) {
        cardTbS.cardindex = card.cardindex;
        cardTbS.cvv = this.cvv;
        cardTbS.is_emi = !!card.emiBankID && !!card.emiTenure;
        cardTbS.emi_bank_id = card.emiBankID;
        cardTbS.emi_tenure = card.emiTenure;
        return this.cardService.paymentWithStoredCard(cardTbS, this.session.data.session_key,
          this.isLoggedIn, false).pipe(takeUntil(this.onDestroy$)).subscribe((data) => {
          try {
            const dt = JSON.parse(data);
            if (dt.status !== undefined) {
              if (dt.status === 'fail') {
                this.switchClasses(event, '');
                if (dt.reason !== undefined) {
                  this.alert.warning(dt.reason);
                } else {
                  this.alert.warning(dt.message);
                }
                return;
              }
            }
          } catch (e) {
            // exception
          }


          let resp: any;
          try {
            resp = JSON.parse(data);
          } catch (e) {
          }
          if (resp && resp.data && resp.data.type) {
            if (resp.status === 'success' && resp.data.type === 'moto') {
              this.switchClasses(event, 'success');
              const ur = this.session.data.request.return_url;
              setTimeout(function () {

                if (window.opener != null) {
                  window.opener.postMessage(JSON.stringify(
                    {status: 'success', type: 'gw_redirect', url: resp.data.url}
                  ), '*');
                }
                if (window.parent != null) {
                  window.parent.postMessage(JSON.stringify(
                    {status: 'success', type: 'gw_redirect', url: resp.data.url}
                  ), '*');
                }

                window.location.href = resp.data.url;
              }, 1500);
            } else {
              card.withoutOTP = '0';
              this.cvv = '';
              this.switchClasses(event, 'fail');
              this.alert.danger('Transaction is not successful, try again');
            }
          } else {


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

          // this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml(data);
          //
          //   setTimeout(() => {
          //     const scripts = this.container.nativeElement.getElementsByTagName('script');
          //     for (const script of scripts) {
          //       eval(script.text);
          //     }
          //
          //     const f = this.container.nativeElement.getElementsByTagName('form')[0];
          //     if (f) {
          //       f.submit();
          //     }
          //   });
        }, (error) => {
        });
      } else {
        this.switchClasses(event, '');
        this.alert.danger('Please put a valid CVV number to pay');
      }

    } else {
      this.switchClasses(event, '');
      this.alert.danger('Please select one of the cards to pay');
    }
  }

  checkCvv() {
    if (this.cvv.length > 2) {
      this.data.setBtnActive();
    } else {
      this.data.unsetBtnActive();
    }
  }

  deleteCard(card: CardNo) {
    if (card) {
      this.data.deleteCardAuth(card.cardindex).pipe(takeUntil(this.onDestroy$)).subscribe((data: GenericResponse) => {
        if (data) {
          if (data.status === 'SUCCESS') {
            const index: number = this.cardsList.indexOf(card);
            if (index !== -1) {
              this.cardsList.splice(index, 1);
            }
            if (this.session && this.session.data && this.session.data.session_data) {
              this.data.showStoredCards(true, this.session.data.session_data.meta.gw_sessionkey);
            }
            this.alert.success('Card deleted successfully');

          } else {
            this.alert.warning('Unable to delete card');
          }
        } else {
          this.alert.warning('Invalid OTP number, Please try again');
        }

      }, (error) => {
        this.alert.danger('Unable to check OTP, Please try again');
      });
    } else {
      this.alert.danger('Unable to check OTP, Please try again');
    }
  }

  setSelectionToggle(card: CardNo, index: number) {
    setTimeout(() => {
      this.ListCvv.toArray()[index].nativeElement.select();
      document.getElementById('cvv-' + index).focus();
    }, 100);
    this.data.unsetBtnActive();
    this.cvv = null;
    if (this.session && this.session.data) {
      if (Number(card.withoutOTP) === 1) {
        this.cvv = 'xxxx';
        this.data.setBtnActive();
      } else {
        this.cvv = '';
        this.data.unsetBtnActive();
      }
    }
    this.cardsList.forEach((v, i) => {
      if (v !== card) {
        v.selected = false;
        v.deleted = false;
        v.emiBankID = null;
      }
    });
    card.selected = !card.selected;

    this.card.card_index = card.cardindex;

    // EMI PROCESSING
    const firstSix = card.cardNo.replace(' ', '').substr(0, 6);
    if (firstSix.length >= 6 && this.emiList && this.emiList.data && this.emiList.data.data) {

      let cardEmi: Emi;
      for (const emi of this.emiList.data.data.emi) {
        for (const bin of emi.binList) {
          if (bin === firstSix) {
            cardEmi = emi;
          }
        }
      }
      if (cardEmi) {
        this.currentEmi = cardEmi;
        card.emiBankID = cardEmi.emiBankID;
      } else {
        this.currentEmi = null;
        card.emiBankID = '';
      }
    }
  }

  setTokenizeSelectionToggle(card) {
    this.data.unsetBtnActive();
    this.cvv = null;
    this.session.data.session_data.cards.forEach((v, i) => {
      v.selected = false;
    });
    card.selected = !card.selected;
  }

  loadTenure(event, emiBank) {
    const emiB: Emi[] = this.emiList.data.data.emi.filter(obj => {
      return obj.emiBankID === emiBank;
    });
    if (emiB.length > 0) {
      this.currentEmi = emiB[0];
    }
  }

  ngOnDestroy() {
    // this.trxS.unsubscribe();
    // this.btnClickS.unsubscribe();
    // this.data.unsetBtnActive();
    // this.loginS.unsubscribe();
    this.onDestroy$.next();
  }

  isCardInEmi(number) {
    const firstSix = number.replace(' ', '').substr(0, 6);
    if (firstSix.length >= 6 && this.emiList && this.emiList.data && this.emiList.data.data) {

      let cardEmi: Emi;
      for (const emi of this.emiList.data.data.emi) {
        for (const bin of emi.binList) {
          if (bin === firstSix) {
            cardEmi = emi;
          }
        }
      }
      if (cardEmi) {
        // this.currentEmi = cardEmi;
        // this.card.emiBank = cardEmi.emiBankID;
        return true;
      }
      return false;
    }
  }

  isCardInOffer(card: CardNo) {
    const firstSix = card.cardNo.replace(' ', '').substr(0, 6);
    if (firstSix.length >= 6 && this.offerList && this.offerList.data && this.offerList.data.data) {

      let cardOffer: DiscountList;
      for (const offer of this.offerList.data.data.discountList) {
        for (const bin of offer.allowedBIN) {
          if (bin === firstSix) {
            cardOffer = offer;
          }
        }
      }
      if (cardOffer) {
        // this.currentEmi = cardEmi;
        // this.card.emiBank = cardEmi.emiBankID;
        card.offer = cardOffer;
        return true;
      }
      return false;
    }
  }

  getEmiOfCard(number): Emi {
    const firstSix = number.replace(' ', '').substr(0, 6);
    if (firstSix.length >= 6 && this.emiList && this.emiList.data && this.emiList.data.data) {

      let cardEmi: Emi;
      for (const emi of this.emiList.data.data.emi) {
        for (const bin of emi.binList) {
          if (bin === firstSix) {
            cardEmi = emi;
          }
        }
      }
      if (cardEmi) {
        // this.currentEmi = cardEmi;
        // this.card.emiBank = cardEmi.emiBankID;
        return cardEmi;
      }
      return null;
    }
  }

  /*getVibrantColor(url: string) {
    // Using builder
    Vibrant.from(url).getPalette((err, palette) => {
      this.palette = palette;
    });

  }

  styleContainer(): any {
    if (this.palette.LightVibrant) {
      return { 'background-color': this.palette.LightVibrant.getHex(), 'border-color':
          this.palette.LightMuted.getHex(), 'color': '#000000' };
    } else {
      return { 'background-color': '#FFFFFF', 'border-color':
          this.palette.LightMuted.getHex(), 'color': '#000000' };
    }

  }*/
}
