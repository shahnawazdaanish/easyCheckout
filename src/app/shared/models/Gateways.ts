declare module app.share.models {

  export interface Gw {
    visa: string;
    master: string;
    amex: string;
    othercards: string;
    internetbanking: string;
    mobilebanking: string;
  }

  export interface Desc {
    name: string;
    type: string;
    logo: string;
    gw: string;
    r_flag: string;
    emi: number;
    redirectGatewayURL: string;
  }

  export interface Gateways {
    status: string;
    failedreason: string;
    sessionkey: string;
    gw: Gw;
    redirectGatewayURL: string;
    GatewayPageURL: string;
    directPaymentURL: string;
    storeBanner: string;
    storeLogo: string;
    desc: Desc[];
  }

}
