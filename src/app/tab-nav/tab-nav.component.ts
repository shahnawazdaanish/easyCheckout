import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AppdataService} from '../appdata.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-tab-nav',
  templateUrl: './tab-nav.component.html',
  styleUrls: ['./tab-nav.component.css']
})
export class TabNavComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  @Output() setCurrentViewToTransaction: EventEmitter<any> = new EventEmitter<any>(true);
  currentView: string;
  activeItem: string;
  isCardEnabled;
  isMobEnabled;
  isNetEnabled;
  isLoggedIn;
  isMobile = false;
  constructor(private data: AppdataService) { }

  ngOnInit() {
    this.data.currentComp.pipe(takeUntil(this.onDestroy$)).subscribe(p => this.currentView = p);
    this.data.activeItem.pipe(takeUntil(this.onDestroy$)).subscribe(v => this.activeItem = v);
    this.data.isCardAvail.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(p => this.isCardEnabled = p);
    this.data.isMobAvail.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(p => this.isMobEnabled = p);
    this.data.isNetAvail.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(p => this.isNetEnabled = p);
    this.data.isLoggedin.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.isLoggedIn = x );
    this.data.isMobile.pipe(takeUntil(this.onDestroy$)).subscribe( x => this.isMobile = x);
  }

  changeCurrentView(val: string) {
    this.data.changeView(val);
    // this.setCurrentViewToTransaction.emit(val);
  }
  removeClass(event, cssclass) {
    event.srcElement.classList.remove('active');
  }
  ngOnDestroy() {
    this.onDestroy$.next();
  }
}
