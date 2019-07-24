import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Response} from './response.model';

export class AppService {
  url = 'https://nookdev.sslcommerz.com/api/angular/';
}
