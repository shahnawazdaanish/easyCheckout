import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ILogin} from '../login';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {ZTransaction} from '../shared/models/ZTransaction';
import {CardNo} from '../shared/models/MyCards';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {AppdataService} from '../appdata.service';
import {AlertService} from 'ngx-alerts';
import {CardsService} from '../cards.service';
import {DomSanitizer} from '@angular/platform-browser';
import {CommonService} from '../shared/Services/CommonService';
import {MainLoginResponse} from '../shared/models/MainLoginResponse';
import {LoginResponse} from '../shared/models/LoginResponse';
import {CardInfo} from '../shared/models/CardInfo';
import {GenericResponse} from '../shared/models/GenericResponse';
import {NotifyService} from '../shared/Services/notify.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit, OnDestroy {


  @ViewChild('htmlContainer') container;
  @ViewChild('forgetForm') forgetForm: FormGroupDirective;
  trustedHTML;

  model: ILogin = { shaz_username: '', shaz_password: '' };
  form: FormGroup;
  user: object;
  isLoggedin: Boolean = false;
  currentComp: string;
  message: string;
  btnClickSub;

  constructor(private router: Router, public authService: AuthService, private fb: FormBuilder,
              private data: AppdataService, private alertService: NotifyService, private cardService: CardsService,
              private sanitizer: DomSanitizer, private common: CommonService) {
    this.form = this.fb.group({
      shaz_username: ['', Validators.required]
    });
  }
  get f() { return this.form.controls; }

  ngOnInit() {
    this.data.isLoggedin.subscribe(message => this.isLoggedin = message);
    this.data.currentComp.subscribe(comp => this.currentComp = comp);
    this.btnClickSub = this.data.payBtnClick.subscribe( () => { this.parentBtnClick(); });
    this.onChanges();
  }
  tryForget () {

    if (this.form.invalid) {
      this.alertService.danger('Provide valid email address or mobile number');
    } else {
      const resp = this.data.resetPasswordInit(this.f.shaz_username.value)
        .subscribe((data: MainLoginResponse) => {
          // console.log(data);
          // this.data.isLoading.next(false);
          if (data.status) {
            if (data.status === 'SUCCESS') {
              const loginResp: LoginResponse = data.data;
              if (loginResp.status === 'success') {
                this.data.changeView('login');
                this.alertService.success(loginResp.data.msgToDisplay);
              } else {
                this.alertService.danger(data.message);
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



  }

  parentBtnClick() {
    if (this.form.valid) {
      this.forgetForm.ngSubmit.emit();
    } else {
      this.alertService.danger('Provide valid email address or mobile number');
    }
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      if (this.form.valid) {
        this.data.setBtnActive();
      } else {
        this.data.unsetBtnActive();
      }
    });
  }

  changeView(view: string): void {
    this.data.changeView(view);
  }

  ngOnDestroy() {
    // next use
    this.btnClickSub.unsubscribe();
  }
}
