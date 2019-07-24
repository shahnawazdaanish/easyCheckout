import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ZTransaction} from '../../shared/models/ZTransaction';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  @Input() cards: object;
  @Output() handleRedirect: EventEmitter<any>;
  constructor() {
    this.handleRedirect = new EventEmitter();
  }

  ngOnInit() {
  }
  passGatewayToRedirect(gateway: object) {
    this.handleRedirect.emit({gateway});
  }

}
