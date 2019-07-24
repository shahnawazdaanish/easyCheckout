import {ZTransaction} from './ZTransaction';

export class GenericResponse {
  status: string;
  data: any;
  message: string;
  constructor(public pstatus: string, public pdata: object, public pmessage: string) {
    this.status = pstatus;
    this.data = pdata;
    this.message = pmessage;
  }
}
