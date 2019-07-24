import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgwWowService} from 'ngx-wow';

@Component({
  selector: 'app-net-banks',
  templateUrl: './net-banks.component.html',
  styleUrls: ['./net-banks.component.css']
})
export class NetBanksComponent implements OnInit {
  @Input() net_banks: object;
  @Output() handleRedirect: EventEmitter<any>;
  constructor(private wow: NgwWowService) {
    this.handleRedirect = new EventEmitter();
    this.wow.init();
  }

  ngOnInit() {
  }
  passGatewayToRedirect(gateway: object) {
    this.handleRedirect.emit({gateway});
  }

}
