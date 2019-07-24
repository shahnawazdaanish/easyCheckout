import { Injectable } from '@angular/core';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private storage: StorageService) { }

  logout(): void {
    // localStorage.setItem('isLoggedIn', 'false');
    // localStorage.removeItem('token');
    this.storage.setItem('isLoggedIn', 'false');
    this.storage.removeItem('token');
  }
}
