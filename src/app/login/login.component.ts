import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ZTransaction} from '../shared/models/ZTransaction';
import {AppdataService} from '../appdata.service';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import { ILogin } from '../login';
import { AuthService } from '../auth.service';
import {Router} from '@angular/router';
import {LoginResponse} from '../shared/models/LoginResponse';
import {CardNo, MyCards} from '../shared/models/MyCards';
import {MainLoginResponse} from '../shared/models/MainLoginResponse';
import {AlertService} from 'ngx-alerts';
import {CardsService} from '../cards.service';
import {CardInfo} from '../shared/models/CardInfo';
import {DomSanitizer} from '@angular/platform-browser';
import SessionInfo = app.shared.models.SessionInfo;
import {CommonService} from '../shared/Services/CommonService';
import {GenericResponse} from '../shared/models/GenericResponse';
import {NotifyService} from '../shared/Services/notify.service';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('htmlContainer') container;
  @ViewChild('loginForm') loginForm: FormGroupDirective;
  trustedHTML;

  model: ILogin = { shaz_username: '', shaz_password: '' };
  form: FormGroup;
  user: object;
  isLoggedin: Boolean = false;
  transaction: ZTransaction;
  cards: CardNo[];
  currentComp: string;
  message: string;
  returnUrl: string;
  session: SessionInfo;
  btnClickSub;
  constructor(private router: Router, public authService: AuthService, private fb: FormBuilder,
              private data: AppdataService, private alertService: NotifyService, private cardService: CardsService,
              private sanitizer: DomSanitizer, private common: CommonService, private storage: StorageService) {
    this.form = this.fb.group({
      shaz_username: ['', Validators.required],
      shaz_password: ['', Validators.required]
    });
    this.returnUrl = '/dashboard';
    // this.authService.logout();
  }
  get f() { return this.form.controls; }

  ngOnInit() {
    this.data.isLoggedin.subscribe(message => this.isLoggedin = message);
    this.data.transaction.subscribe(trx => {this.transaction = trx; });
    this.data.currentComp.subscribe(comp => this.currentComp = comp);
    this.data.cards.subscribe(cards => this.cards = cards);
    this.common.sessionInformation.subscribe( p => {
      this.session = p;
      if (this.session && this.session.data && this.session.data.request.is_tokenize) {
        this.alertService.warning('Login service is not available for Tokenize Merchant Transaction');
        this.data.changeView('cards');
      }
    });
    this.btnClickSub = this.data.payBtnClick.subscribe( () => { this.parentBtnClick(); });

    this.onChanges();
  }
  tryLogin () {
    const val = this.form.value;

    // if (val.shaz_username && val.shaz_password) {
    //   this.data.loginUser(val.shaz_username, val.password);
    // }


    if (this.form.invalid) {
      return;
    } else {
      const resp = this.data.loginUserWithResponse(this.f.shaz_username.value, this.f.shaz_password.value)
        .subscribe((data: MainLoginResponse) => {
          // console.log(data);
          // this.data.isLoading.next(false);
          if (data.status) {
            if (data.status === 'SUCCESS') {
              const loginResp: LoginResponse = data.data;
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
                      this.cardService.payPendingNewCard(card, this.transaction.session_key, this.isLoggedin).subscribe( (resp) => {
                        this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml(resp);

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
      // if (this.f.shaz_username.value === this.model.shaz_username && this.f.shaz_password.value === this.model.shaz_password) {
      //   //this.authService.authLogin(this.model);
      //   localStorage.setItem('isLoggedIn', "true");
      //   localStorage.setItem('token', this.f.userid.value);
      //   this.router.navigate([this.returnUrl]);
      // }
      // else{
      //   this.message = "Please check your userid and password";
      // }
    }



  }
  showSignUp() {
    this.data.changeView('signup');
  }
  changeView(view: string): void {
    this.data.changeView(view);
  }


  parentBtnClick() {
    // this.form.valueChanges.subscribe(val => {
    //   // console.log(this.form.valid);
    // });

    if (this.form.valid) {
      this.loginForm.ngSubmit.emit();
    } else {
      this.alertService.danger('Incorrect login credentials, Please check your login ID and password!');
    }
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      if (val.shaz_username !== '' && val.shaz_password !== '') {
        this.data.setBtnActive();
      } else {
        this.data.unsetBtnActive();
      }
    });
  }

  ngOnDestroy() {
    // next use
    this.btnClickSub.unsubscribe();
  }


}
