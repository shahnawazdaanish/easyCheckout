import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};

@Injectable()
export class ApiService {
  url = 'https://nookdev.sslcommerz.com/api/angular/';

  constructor(private  http:  HttpClient) {}
}
