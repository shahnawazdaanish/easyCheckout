import {Component, OnInit, ViewChild} from '@angular/core';
import { MatProgressBar } from '@angular/material';
import {AppdataService} from '../appdata.service';
import {AlertService} from 'ngx-alerts';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {MainLoginResponse} from '../shared/models/MainLoginResponse';
import {LoginResponse} from '../shared/models/LoginResponse';
import {NotifyService} from '../shared/Services/notify.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  key: string;
  isLoading = true;
  isCorrectURL = false;
  isBtnActive = false;
  isActionEnds = false;
  actionType = '';
  actionMessage = '';
  form: FormGroup;
  reset: any = {
    new_password : '',
    confirm_password: '',
    strength : 0
  };
  @ViewChild('resetForm') resetForm: FormGroupDirective;

  constructor(private data: AppdataService, private alertService: NotifyService,
              private activeRoute: ActivatedRoute, private fb: FormBuilder) {
    this.form = this.fb.group({
      PasswordGroup: this.fb.group({
        new_password: ['', [Validators.required, Validators.minLength(8)]],
        confirm_password: ['', [Validators.required, Validators.minLength(8)]],
      }, {validators: this.checkPasswords })
    });
  }

  get f() { return this.form.controls; }

  ngOnInit() {


    // const queryParams = this.activeRoute.snapshot.queryParams;
    // const routeParams = this.activeRoute.snapshot.params;
    this.activeRoute.queryParams.subscribe(q => {
      // do something with the query params
      if (q.key && q.key !== '') {
        this.data.resetPasswordVerify(q.key, '').subscribe((data: any) => {
          this.isLoading = false;
          this.key = q.key;
        }, () => {
          // error
          this.isLoading = false;
        });
      } else {
        this.alertService.danger('Oops! Link is expired or not available, try resetting again');
      }
    });

    this.onChanges();
  }



  tryReset() {
    // return;
    if (this.form.invalid) {
      this.alertService.danger('Provide a strong password and confirm the same password');
    } else {
      const resp = this.data.resetPasswordChange(this.key, this.reset.new_password,
        this.reset.confirm_password, '')
        .subscribe((d: MainLoginResponse) => {
          // this.data.isLoading.next(false);
          if (d.status) {
            if (d.status === 'SUCCESS') {
              const loginResp: LoginResponse = d.data;
              if (loginResp.status === 'success') {
                this.alertService.success(loginResp.data.msgToDisplay);
                this.isActionEnds = true;
                this.actionType = 'success';
              } else {
                this.alertService.danger(d.message);
                this.isActionEnds = true;
                this.actionType = 'fail';
                this.actionMessage = loginResp.data.msgToDisplay;
              }
            } else {
              // Data unavailable
              this.alertService.danger(d.message);
              this.isActionEnds = true;
              this.actionType = 'fail';
              this.actionMessage = d.message;
            }
          }
          // this.router.navigate([this.returnUrl]);
        }, error => {
          this.data.isLoading.next(false);
          this.isActionEnds = true;
          this.actionType = 'fail';
          this.actionMessage = 'Unable to change your password to system right now, try later';
        });
    }



  }
  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      if (this.form.valid) {
        if (val.PasswordGroup.new_password === val.PasswordGroup.confirm_password) {
          if (this.reset.strength >= 4) {
            this.isBtnActive = true;
          } else {
            this.isBtnActive = false;
          }
        } else {
          this.isBtnActive = false;
        }
      } else {
        this.isBtnActive = false;
      }


      /*if (val.PasswordGroup.new_password !== '' && val.PasswordGroup.confirm_password !== '') {
        this.isBtnActive = true;
      } else {
        this.isBtnActive = false;
      }*/
    });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.new_password.value;
    const confirmPass = group.controls.confirm_password.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  checkStrength(strength) {
    this.reset.strength = strength;
  }

}
