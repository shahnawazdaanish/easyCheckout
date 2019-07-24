import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Inject, OnDestroy,
  OnInit,
  Sanitizer,
  ViewChild
} from '@angular/core';
import {AppdataService} from '../appdata.service';
import {ZTransaction} from '../shared/models/ZTransaction';
import OfferInformation = app.shared.models.OfferInformation;
import SessionInfo = app.shared.models.SessionInfo;
import {SessionService} from '../shared/Services/SessionService';
import {CommonService} from '../shared/Services/CommonService';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import FastAverageColor from 'fast-average-color/dist/index.es6';
import {Observable, Observer, Subject} from 'rxjs';
import {GenericResponse} from '../shared/models/GenericResponse';
import {DomSanitizer} from '@angular/platform-browser';
import {TranslateService} from '../translate.service';
import {StorageService} from '../storage.service';
import {share, takeUntil} from 'rxjs/operators';
import {NgxCoolDialogsService} from 'ngx-cool-dialogs';

declare function loadHeight(): any;
declare function loadColorPick(active, primary): any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewChecked, AfterContentInit, AfterContentChecked, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  @ViewChild('logoImg') lgImg: ElementRef;
  isLoggedin: Boolean = false;
  message: string;
  session: SessionInfo;
  offer: OfferInformation;
  currentComp: string;
  currentStep: string;
  storedPhone: string;
  isExisting;

  isCardEnabled;
  isMobEnabled;
  isNetEnabled;






  test = 'sasdf';
  color;
  vibrant;
  swatches;
  swatch;
  blockSize;
  defaultRGB;
  canvas;
  context;
  width;
  height;
  length;
  palette;
  colorThief;
  imgPath;
  dominantColor;
  sourceImage;
  bgcolor;

  base64img;
  currentLang: string;

  pickerLoop;
  logoLoop;
  heightLoop;







  public deviceInfo = null;
  isMobile = false;
  forceLogoOff = false;

  constructor(private data: AppdataService, private common: CommonService,
              private deviceService: DeviceDetectorService,
              @Inject(DOCUMENT) private document: Document,
              private activeRoute: ActivatedRoute, private sanitize: DomSanitizer,
              private translate: TranslateService, private storage: StorageService, private coolDialogs: NgxCoolDialogsService) {
    this.detectDevice();
    this.currentLang = translate.currentLanguage();
    // translate.use('bn').then(() => {
      // console.log('LANGUAGE ==============================>');
      // console.log(translate.data);
      // console.log('========================================<');
    // });
  }
  ngOnInit() {
    this.data.isLoggedin.pipe(takeUntil(this.onDestroy$), share()).subscribe(message => this.isLoggedin = message);
    // this.data.getTransaction('x');
    this.common.sessionInformationService.pipe(takeUntil(this.onDestroy$), share()).subscribe((ses) =>  {
      // console.log('SESSION INFO', ses);
      this.session = ses;
      if (this.session && this.session.data && this.session.data.session_data) {
        // // console.log('PHONE NO', this.session.data.session_data.meta.cust_mobile);
        if (this.storedPhone !== this.session.data.session_data.meta.cust_mobile) {
          this.data.logout();
        }

        const activeColor = this.session &&
        this.session.data &&
        this.session.data.session_data ? this.session.data.session_data.meta.activeColor : '';
        const primaryColor = this.session &&
        this.session.data &&
        this.session.data.session_data ? this.session.data.session_data.meta.primaryColor : '';
        // console.log('Colors', activeColor, primaryColor);

        loadHeight();
        this.loadBase64Img(this.session.data.session_data.meta.storeLogoBase64);

        this.pickerLoop = setInterval(() => {
          console.log('I am in picker loop');
          if (this.session && this.base64img && activeColor && primaryColor) {
            loadColorPick(activeColor.split(','), primaryColor.split(','));
            clearInterval(this.pickerLoop);
          } else if (this.session && this.base64img && !activeColor) {
            loadColorPick('', '');
            clearInterval(this.pickerLoop);
          } else {
            // nothing to do
          }
        }, 500);

        // setTimeout(function() {
        //   if (activeColor && primaryColor) {
        //     loadColorPick(activeColor.split(','), primaryColor.split(','));
        //   } else {
        //     loadColorPick('', '');
        //   }
        // }, 1000);

        // processTimeOut();


      }
    });
    this.data.offerList.pipe(takeUntil(this.onDestroy$), share()).subscribe(offer => this.offer = offer);
    this.data.currentCompB.pipe(takeUntil(this.onDestroy$), share()).subscribe(x => this.currentComp = x);
    this.data.currentStepB.pipe(takeUntil(this.onDestroy$), share()).subscribe(x => this.currentStep = x);
    this.data.isCardAvail.asObservable().pipe(takeUntil(this.onDestroy$), share()).subscribe(p => this.isCardEnabled = p);
    this.data.isMobAvail.asObservable().pipe(takeUntil(this.onDestroy$), share()).subscribe(p => this.isMobEnabled = p);
    this.data.isNetAvail.asObservable().pipe(takeUntil(this.onDestroy$), share()).subscribe(p => this.isNetEnabled = p);
    if (this.storage.getItem('phone') !== null && this.storage.getItem('phone') !== '') {
      this.data.changeStoredPhone(this.storage.getItem('phone'));
    }
    this.data.storedPhone.pipe(takeUntil(this.onDestroy$), share()).subscribe(x => this.storedPhone = x);


    const queryParams = this.activeRoute.snapshot.queryParams;
    // console.log(queryParams);
    let forceFull = false;
    if (queryParams.full !== undefined) {
      if (queryParams.full === '1') {
        // console.log('full true');
        forceFull = true;
      } else {
        forceFull = false;
      }
    } else {
      forceFull = false;
    }
    this.forceLogoOff = forceFull;
    this.data.changePopUpFull(forceFull);

    // console.log('force full : ', forceFull);
    this.isMobile = this.deviceService.isMobile();
    if (this.isMobile) {
      this.data.isMobileB.next(true);
      this.document.body.classList.add('mobile_device');

      // if (!forceFull) {
      //   this.data.isMobileB.next(true);
      //   this.document.body.classList.add('mobile_device');
      // } else {
      //   this.isMobile = false;
      //   this.data.isMobileB.next(false);
      //   this.document.body.classList.remove('mobile_device');
      // }
    } else {
      if (this.forceLogoOff) {
        this.data.isMobileB.next(false);
        this.document.body.classList.remove('mobile_device');
        this.document.body.classList.add('mobile_popup');
      } else {
        this.data.isMobileB.next(false);
        this.document.body.classList.remove('mobile_device');
      }
    }


  }
  ngAfterContentInit() {

  }
  loadBase64Img(img) {
      this.base64img = this.sanitize.bypassSecurityTrustResourceUrl(
        img);
  }
  ngAfterViewChecked () {
    // if (this.session && this.session.data && this.session.data.session_data) {
    //   // // console.log('PHONE NO', this.session.data.session_data.meta.cust_mobile);
    //   if (this.storedPhone !== this.session.data.session_data.meta.cust_mobile) {
    //     this.data.logout();
    //   }
    // }
    // // console.log('View INITED > ');

    // setTimeout(function() {
      // // console.log('SHOWING LOGO');
      // // console.log(this.session);

    // }, 0);


    if (this.translate.currentLanguage() === 'bn') {
      this.document.body.classList.add('easy_chk_bn');
    } else {
      this.document.body.classList.remove('easy_chk_bn');
    }
  }
  makeLogin() {
    this.data.isLoggedin.next(true);
  }
  makeLogout() {
    this.data.isLoggedin.next(false);
  }
  loadOffers() {
    this.data.changeView('offer-list');
  }
  loadHelp() {
    this.data.changeView('help');
  }
  loadSupport() {
    this.data.changeView('support');
  }
  tryLogin() {
    this.data.changeView('card-entry', null, 'remember-number', true);
  }
  tryLogout() {
    this.data.logout();
    this.data.cardsSource.next(null);
    this.data.changeView('card-entry');
  }
  changeCurrentView(val: string) {
    // this.data.changeView(val);
    this.data.changeView(val);
  }

  detectDevice() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    // console.log(this.deviceInfo);
  }
  getImageBase64() {
    if (this.session && this.session.data && this.session.data.request) {
      /*this.data.getBase64(this.session.data.request.store_image_url).subscribe((res: any) => {
        if (res.status) {
          if (res.status === 'SUCCESS') {
            return this.sanitize.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + res.data.base64);
          }
        }
      });*/
    }
    return null;
  }
  getImgColor(event) {
    // // console.log(event.path[0].src);
    // if (event.path[0].src) {
    //   this.getBase64ImageFromURL(event.path[0].src).subscribe(base64data => {
    //     // console.log('BASE64' + base64data);
    //     // this is the image as dataUrl
    //     // this.base64Image = 'data:image/jpg;base64,' + base64data;
    //   }, error => {
    //     // console.log(error);
    //   });
    // } else {
    //   // console.log('path error');
    // }
    /*this.data.getBase64(event.path[0].src).subscribe( (res: any) => {
      // // console.log(res);
      if (res.status) {
        if (res.status === 'SUCCESS') {

          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.src = 'data:image/png;base64, ' + res.data.base64;
          // this.session.data.request.store_image_url = this.sanitize.bypassSecurityTrustResourceUrl(img.src).toString();

          // // console.log(res.data.base64); // myBase64 is the base64 string

          // const fac = new FastAverageColor();
          // const color = fac.getColorAsync(img);
          // // console.log(color);
        }
      }
    });*/
  }
  toDataUrl(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      const reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }
  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    const dataURL = canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }

  historyBack() {
    if (this.isLoggedin) {
      this.changeCurrentView('cards-list');
    } else {
      this.changeCurrentView('card-entry');
    }
  }
  changeLang() {
    if (this.currentLang === 'en') {
      this.translate.use('bn');
    } else {
      this.translate.use('en');
    }
  }
  ngAfterContentChecked() {
    this.currentLang = this.translate.currentLanguage();
  }
  ngOnDestroy() {
    this.onDestroy$.next();
  }
  processTimeOut() {
    if (this.session && this.session.data && this.session.data.session_data) {
      const minsAllowed = Number.parseInt(this.session.data.session_data.meta.max_duration_min);
      if (minsAllowed > 0) {
        const db_time = new Date(Date.parse( this.session.data.request.created_at.replace(/[-]/g, '/') ));
        console.log(db_time);
      } else {

      }
    }
  }

  cancelTransaction() {
    this.coolDialogs.confirm('Your transaction will be canceled and cannot be revert! ', {
      theme: 'material',
      okButtonText: 'Yes, Cancel',
      cancelButtonText: 'No',
      color: '#ff3636',
      title: 'Are you sure?'
    })
      .subscribe(res => {
        if (res) {
          if (this.session && this.session.data && this.session.data.request && this.session.data.request.cancel_url) {
            window.location.href = this.session.data.request.cancel_url;
          } else {
            this.coolDialogs.alert('Unable to cancel this transaction as cancel url is not present');
          }
        } else {
        }
      });
  }
}
