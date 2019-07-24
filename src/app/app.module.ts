import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard} from './auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { NgSlimScrollModule, SLIMSCROLL_DEFAULTS } from 'ngx-slimscroll';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AlertModule } from 'ngx-alerts';
import {CardModule} from 'ngx-card/ngx-card';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { AngularResizedEventModule } from 'angular-resize-event';
import {DeviceDetectorModule} from 'ngx-device-detector';
import { NgwWowModule } from 'ngx-wow';
import { CookieService } from 'ngx-cookie-service';
// import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { NgxCoolDialogsModule } from 'ngx-cool-dialogs';

import { AppComponent } from './app.component';
import { PostComponent } from './post/post.component';
import { NamesComponent } from './names/names.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { TransactionInformationComponent } from './transaction-information/transaction-information.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { CopyrightComponent } from './copyright/copyright.component';
import { TransactionComponent } from './transaction/transaction.component';
import {
  MatTabsModule, MatIconModule, MatRippleModule, MatToolbarModule, MatButtonModule,
  MatSidenavModule, MatListModule, MatMenuModule, MatProgressBarModule, MatSnackBarModule
} from '@angular/material';
import { CardsComponent } from './payment-options/cards/cards.component';
import { MobileBanksComponent } from './payment-options/mobile-banks/mobile-banks.component';
import { NetBanksComponent } from './payment-options/net-banks/net-banks.component';
import { MyNavComponent } from './my-nav/my-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { TabNavComponent } from './tab-nav/tab-nav.component';
import {CardEntryComponent} from './payment-options/card-entry/card-entry.component';
import {CardListComponent} from './payment-options/card-list/card-list.component';
import {CleaveJSDirective} from './cleave-js.directive';
import {PayFormDirective} from './pay-form.directive';
import {SignupComponent} from './signup/signup.component';
import {TourMatMenuModule} from 'ngx-tour-md-menu';
import { NotFoundComponent } from './not-found/not-found.component';
import { OffersComponent } from './offers/offers.component';
import { ErrorsComponent } from './errors/errors.component';
import { DownloadAppComponent } from './download-app/download-app.component';
import {MatchHeightDirective} from './shared/directives/same_height.directive';
import { ForgetComponent } from './forget/forget.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {OnlyNumberDirective} from './shared/directives/OnlyNumber.directive';
import {TranslateService} from './translate.service';
import { TranslatePipe } from './translate.pipe';
import { SupportComponent } from './support/support.component';
import { TermsComponent } from './terms/terms.component';
import { SafeHtmlPipe } from './safe-html.pipe';

export function setupTranslateFactory(service: TranslateService): Function {
  return () => {
    const lang = service.getItem('lang');
     lang ? service.use(lang) : service.use('en');
    // service.use('en');
  };
}

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    NamesComponent,
    HeaderComponent,
    TransactionInformationComponent,
    PaymentOptionsComponent,
    CopyrightComponent,
    TransactionComponent,
    CardsComponent,
    MobileBanksComponent,
    NetBanksComponent,
    MyNavComponent,
    LoginComponent,
    TabNavComponent,
    CardEntryComponent,
    CardListComponent,
    CleaveJSDirective,
    PayFormDirective,
    SignupComponent,
    NotFoundComponent,
    OffersComponent,
    ErrorsComponent,
    DownloadAppComponent,
    MatchHeightDirective,
    ForgetComponent,
    ResetPasswordComponent,
    OnlyNumberDirective,
    TranslatePipe,
    SupportComponent,
    TermsComponent,
    SafeHtmlPipe
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatTabsModule,
    MatIconModule,
    MatProgressBarModule,
    MatRippleModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    NgSlimScrollModule,
    LoadingBarHttpClientModule,
    BrowserAnimationsModule,
    AlertModule.forRoot({maxMessages: 5, timeout: 700000, position: 'left'}),
    TourMatMenuModule.forRoot(),
    ScrollToModule.forRoot(),
    CardModule,
    PasswordStrengthMeterModule,
    AngularResizedEventModule,
    DeviceDetectorModule.forRoot(),
    NgwWowModule,
    MatSnackBarModule,
    // NgxCleaveDirectiveModule
    NgxCoolDialogsModule.forRoot()
  ],
  providers: [{
    provide: SLIMSCROLL_DEFAULTS,
    useValue: {
      alwaysVisible : true,
      gridOpacity: '0.4', barOpacity: '0.7',
      gridBackground: '#c2c2c2',
      gridWidth: '6',
      gridMargin: '2px 2px',
      barBackground: '#2C3E50',
      barWidth: '6',
      barMargin: '2px 2px'
    }
  },
  {
    provide: '$scope',
    useFactory: i => i.get('$rootScope'),
    deps: ['$injector']
  }, AuthGuard, TranslateService, CookieService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [ TranslateService ],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
