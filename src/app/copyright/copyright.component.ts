import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppdataService} from '../appdata.service';

@Component({
  selector: 'app-copyright',
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.css']
})
export class CopyrightComponent implements OnInit {
  currentComp = 'cards';
  isCardEnabled;
  isMobEnabled;
  isNetEnabled;
  constructor(private data: AppdataService) {}

  ngOnInit() {
    this.data.currentComp.subscribe(p => this.currentComp = p);
    this.data.isCardAvail.asObservable().subscribe(p => this.isCardEnabled = p);
    this.data.isMobAvail.asObservable().subscribe(p => this.isMobEnabled = p);
    this.data.isNetAvail.asObservable().subscribe(p => this.isNetEnabled = p);
  }
  changeCurrentView(val: string) {
    // this.data.currentCompB.next(val);
    this.data.changeView(val);
  }

}
