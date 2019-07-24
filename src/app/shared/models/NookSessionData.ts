export interface Qr {
  qr_read_url: string;
  qr_code: string;
}

export interface Meta {
  acquirer: string;
  requester: string;
  emi: number;
  offer: number;
  gw_sessionkey: string;
  main_amount: string;
}

export interface NookSessionData {
  cards: any[][];
  gateways: string;
  qr: Qr;
  meta: Meta;
}
