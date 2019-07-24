import {ZTransaction} from './ZTransaction';

export class ZResponse {
  status: string;
  data: ZTransaction;
  message: string;
  constructor(public pstatus: string, public pdata: ZTransaction, public pmessage: string) {
    this.status = pstatus;
    this.data = pdata;
    this.message = pmessage;
  }
}
