import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import SessionInfo = app.shared.models.SessionInfo;
import {AppdataService} from '../appdata.service';

@Component({
  selector: 'app-transaction-information',
  templateUrl: './transaction-information.component.html',
  styleUrls: ['./transaction-information.component.css']
})
export class TransactionInformationComponent implements OnInit, AfterContentChecked {
  @Input() session: SessionInfo;
  constructor(private data: AppdataService) {
  }

  ngOnInit() {
    // this.data.isSessionTimeout.subscribe(val => this.isSessionTimedOut = val);

  }
  ngAfterContentChecked() {
    // GETTING TRANSACTION ID
    // if (this.transaction != null && this.transaction.session != null) {
    //   const session_data = JSON.parse(this.transaction.session.session_data);
    //   if (session_data) {
    //     const gateways = session_data.gateways ? JSON.parse(session_data.gateways) : null;
    //     if (gateways) {
    //       this.tran_id = gateways.tran_id;
    //     }
    //   }
    // }
    // console.log(this.session);
  }

  changeView(view: string) {
    this.data.changeView(view);
  }

}
