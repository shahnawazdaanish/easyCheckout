import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppdataService} from '../appdata.service';
import OfferInformation = app.shared.models.OfferInformation;
import {ZTransaction} from '../shared/models/ZTransaction';
import {isUndefined} from 'util';
import {ActivatedRoute} from '@angular/router';
import DiscountList = app.shared.models.DiscountList;
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  offerList: OfferInformation;
  transactionID: string;
  discount: string;
  transaction: ZTransaction;

  constructor(protected data: AppdataService, private activeRoute: ActivatedRoute) {
    data.offerList.pipe(takeUntil(this.onDestroy$)).subscribe(resp => { this.offerList = resp; console.log(resp); });
    data.activeTransactionID.pipe(takeUntil(this.onDestroy$)).subscribe(id => { this.transactionID = id; });
    data.offerAvailedID.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.discount = x);
    data.transaction.pipe(takeUntil(this.onDestroy$)).subscribe(x => this.transaction = x);
  }

  selectOffer(discountID: string, item: DiscountList) {
    if (item.redirectGWPath !== '') {
      window.location.href = item.redirectGWPath;
    } else {
      // console.log(item);
      const routeParams = this.activeRoute.snapshot.params;
      // // console.log(queryParams);
      // // console.log(routeParams);
      if (!isUndefined(routeParams.id)) {
        this.transactionID = routeParams.id;
        this.data.setOffer(discountID, this.transactionID, item);
      } else {
        // Invalid parameter or route won't be match
      }
    }
  }

  ngOnInit() {
    // console.log(this.offerList);
  }
  ngOnDestroy() {
    this.onDestroy$.next();
  }

}
