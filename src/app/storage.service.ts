import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  isLSAvailable = true;

  constructor(private cookie: CookieService) {
    if (localStorage == null) {
      this.isLSAvailable = false;
      console.log('Localstorage not enabled. Please enable localstorage');
    }
  }

  getItem(item, fromOpposite?: boolean): string {
    if (this.isLSAvailable) {
      if (fromOpposite) {
        return localStorage.getItem(item);
      }
      // return sessionStorage.getItem(item);
      return localStorage.getItem(item);
    } else {
      if (this.cookie.check(item)) {
        return this.cookie.get(item);
      } else {
        return null;
      }
    }
  }

  setItem(key, value, toOpposite?: boolean) {
    if (this.isLSAvailable) {
      if (toOpposite) {
        localStorage.setItem(key, value);
      } else {
        // sessionStorage.setItem(key, value);
        localStorage.setItem(key, value);
      }
    } else {
      this.cookie.set(key, value);
    }
  }

  removeItem(key) {
    if (this.isLSAvailable) {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    } else {
      if (this.cookie.check(key)) {
        this.cookie.delete(key);
      }
    }
  }
}
