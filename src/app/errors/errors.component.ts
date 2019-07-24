import { Component, OnInit } from '@angular/core';
import {AppdataService} from '../appdata.service';
import {ErrorInformation} from '../shared/models/ErrorInformation';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit {
  error: ErrorInformation;
  constructor(private data: AppdataService) {
    this.data.errorMessage.subscribe((error) => this.error = error);
  }

  ngOnInit() {
  }

}
