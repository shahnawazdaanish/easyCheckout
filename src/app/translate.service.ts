import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  currentLS: BehaviorSubject<string> = new BehaviorSubject<string>('en');
  lang = this.currentLS.asObservable();
  data: any = {};
  constructor(private http: HttpClient, private storage: StorageService) { }

  use(lang: string): Promise<{}> {
    return new Promise<{}>((resolve, reject) => {
      const langPath = `assets/lang/${lang || 'en'}.json`;
      this.http.get<{}>(langPath).subscribe(
        translation => {
          this.data = Object.assign({}, translation || {});
          resolve(this.data);
          this.currentLS.next(lang);
          this.storage.setItem('lang', lang);
        },
        error => {
          this.data = {};
          resolve(this.data);
        }
      );
    });
  }
  getItem(key) {
    return this.storage.getItem(key);
  }
  currentLanguage() {
    return this.currentLS.value;
  }
}
