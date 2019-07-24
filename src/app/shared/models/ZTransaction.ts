import {NookSession} from './NookSession';
import {NookRequest} from './NookRequest';

export class ZTransaction {
  session_key: string;
  uin: string;
  merchant_trx_id: string;
  session: NookSession;
  request: NookRequest;
  formatted_date: string;
  created_at: string;
  url?: string;

  constructor(public psession_key: string, puin: string, pmerchant_trx_id: string, psession: NookSession, prequest: NookRequest, formatted_date, created_at) {
    this.session_key = psession_key;
    this.uin = puin;
    this.merchant_trx_id = pmerchant_trx_id;
    this.session = psession;
    this.request = prequest;
    this.formatted_date = formatted_date;
    this.created_at = created_at;
  }
}
