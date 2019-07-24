import {Component, OnDestroy, OnInit} from '@angular/core';
import {SignUpInfo} from '../shared/models/SignUpInfo';
import {AppdataService} from '../appdata.service';
import {GenericResponse} from '../shared/models/GenericResponse';
import {AlertService} from 'ngx-alerts';
import {NotifyService} from '../shared/Services/notify.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signup: SignUpInfo = {
    number : '',
    otp : '',
    email : '',
    password: '',
    conf_password: ''
  };
  number_format = {
    prefix: '880',
    delimiter: '',
    blocks: [3, 2, 4, 4],
  };

  btnClickS;
  current_view = 'mobile';

  constructor(private data: AppdataService, private alertService: NotifyService) { }

  ngOnInit() {
    this.btnClickS = this.data.payBtnClick.subscribe(() => this.parentBtnClick() );
  }

  phoneNumberTyping() {
    if (this.signup.number.length > 12) {
      this.data.setBtnActive();
    } else {
      this.data.unsetBtnActive();
      // ignore
    }
  }
  OTPNumberTyping() {
    if (this.signup.otp.length > 4) {
      this.data.setBtnActive();
    } else {
      this.data.unsetBtnActive();
    }
  }
  EmailTyping() {
    if (this.signup.email && this.signup.password) {
      this.data.setBtnActive();

    } else {
      this.data.unsetBtnActive();
    }
  }


  parentBtnClick() {
    if (this.current_view === 'mobile') {
      this.GetOTPByNumber();
    } else if (this.current_view === 'otp') {
      if (this.signup.otp && this.signup.otp.length > 4) {
        this.current_view = 'info';
        this.data.unsetBtnActive();
      } else {
        this.alertService.danger('Please input valid OTP sent to your phone');
      }
    } else if (this.current_view === 'info') {
      this.SignUpWithData();
    } else {
      this.current_view = 'mobile';
    }
  }

  GetOTPByNumber() {
    if (this.signup.number) {
      this.data.SignUpWithNumber(this.signup.number).subscribe((data: GenericResponse) => {
        if (data.status === 'SUCCESS') {
          this.alertService.success(data.message);
          this.current_view = 'otp';
          this.data.unsetBtnActive();
        } else {
          this.alertService.danger(data.message);
        }

      });
    } else {
      this.alertService.danger('Please provide a valid number');
    }
  }


  SignUpWithData() {
    this.data.SignUpWithFullData(this.signup).subscribe((data: GenericResponse) => {
      if (data.status === 'SUCCESS') {
        this.alertService.success(data.message);
        this.data.changeView('login');
      } else {
        this.alertService.danger(data.message);
      }
    });
  }




  ngOnDestroy() {
    this.data.unsetBtnActive();
  }
}
