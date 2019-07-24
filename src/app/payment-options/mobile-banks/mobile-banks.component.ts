import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgwWowService} from 'ngx-wow';

@Component({
  selector: 'app-mobile-banks',
  templateUrl: './mobile-banks.component.html',
  styleUrls: ['./mobile-banks.component.css']
})

export class MobileBanksComponent implements OnInit {
  @Input() mobile_banks: object;
  @Output() handleRedirect: EventEmitter<any>;
  private wowSubscription: Subscription;
  constructor(private wowService: NgwWowService) {
    this.handleRedirect = new EventEmitter();
    this.wowService.init();
  }

  ngOnInit() {
  }
  passGatewayToRedirect(gateway: object) {
    this.handleRedirect.emit({gateway});
  }

}
