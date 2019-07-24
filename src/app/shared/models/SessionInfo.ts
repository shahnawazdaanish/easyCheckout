declare module app.shared.models {

  export interface Card {
    card_name: string;
    card_no: string;
    ex_month: string;
    ex_year: string;
    token: string;
    selected: boolean;
  }

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

  export interface Meta {
    emi: number;
    offer: string;
    gw_sessionkey: string;
    main_amount: string;
    save_card_offer: string;
    save_card_dis_amt: string;
    cust_mobile: string;
    existingMobile: string;
    numberOfCardSaved: string;
    withoutOTP?: string;
    CustomerName?: string;
    storeLogoBase64?: string;
    primaryColor?: string;
    activeColor?: string;
    max_duration_min?: string;

    currency_type?: string;
    currency_amount?: string;
    currency_rate?: string;

    default_tab?: string;
  }

  export interface SessionData {
    cards: Card[];
    gateways: Gateways;
    meta: Meta;
  }

  export interface Request {
    id: number;
    uin: string;
    tran_id: string;
    bank_txn_id: string;
    merchant_id: string;
    amount: string;
    currency: string;
    email: string;
    store_name: string;
    store_image_url: string;
    return_url: string;
    cancel_url: string;
    merchant_ref: string;
    token_value: string;
    token_ref: string;
    action: string;
    created_at: string;
    updated_at: string;
    order_id: string;
    temp_cpc?: any;
    merchant_trx_id: string;
    from_card_index: number;
    can_login: number;
    can_save: number;
    show_gateways: number;
    asked_to_save: number;
    is_tokenize: number;
    is_emi: number;
    is_offer: number;
    emi_bank_id?: any;
    emi_tenure?: any;
    offer_id?: any;
    discounted_amount?: any;
    without_discount_amount?: any;
    allowed_bin: string;
    max_session_time: string;
    qr_code: string;
    qr_read_url: string;
    device_token?: any;
    encryption_key?: any;
    cus_token?: any;
  }

  export interface Data {
    id: number;
    uin: string;
    session_key: string;
    session_data: SessionData;
    is_expire: number;
    created_at: string;
    updated_at: string;
    formatted_date: string;
    transaction?: any;
    request: Request;
    url?: string;
  }

  export interface SessionInfo {
    status: string;
    message: string;
    data: Data;
  }

}

















//
//
// declare module app.shared.models {
//
//   export interface Gw {
//     visa: string;
//     master: string;
//     amex: string;
//     othercards: string;
//     internetbanking: string;
//     mobilebanking: string;
//   }
//
//   export interface Desc {
//     name: string;
//     type: string;
//     logo: string;
//     gw: string;
//     r_flag: string;
//     emi: number;
//     redirectGatewayURL: string;
//   }
//
//   export interface Gateways {
//     status: string;
//     failedreason: string;
//     sessionkey: string;
//     gw: Gw;
//     redirectGatewayURL: string;
//     GatewayPageURL: string;
//     directPaymentURL: string;
//     storeBanner: string;
//     storeLogo: string;
//     desc: Desc[];
//   }
//
//   export interface Meta {
//     emi: number;
//     offer: string;
//     gw_sessionkey: string;
//     main_amount: string;
//     save_card_offer: string;
//     save_card_dis_amt: string;
//   }
//
//   export interface SessionData {
//     cards: any[][];
//     gateways: Gateways;
//     meta: Meta;
//   }
//
//   export interface Request {
//     id: number;
//     uin: string;
//     tran_id: string;
//     bank_txn_id: string;
//     merchant_id: string;
//     amount: string;
//     currency: string;
//     email: string;
//     store_name: string;
//     store_image_url: string;
//     return_url: string;
//     cancel_url: string;
//     merchant_ref: string;
//     token_value: string;
//     token_ref: string;
//     action: string;
//     created_at: string;
//     updated_at: string;
//     order_id: string;
//     temp_cpc?: any;
//     merchant_trx_id: string;
//     from_card_index: number;
//     can_login: number;
//     can_save: number;
//     show_gateways: number;
//     is_tokenize: number;
//     is_emi: number;
//     is_offer: number;
//     emi_bank_id?: any;
//     emi_tenure?: any;
//     offer_id?: any;
//     discounted_amount?: any;
//     without_discount_amount?: any;
//     allowed_bin: string;
//     max_session_time: string;
//     qr_code?: any;
//     qr_read_url?: any;
//   }
//
//   export interface SessionInfoData {
//     id: number;
//     uin: string;
//     session_key: string;
//     session_data: SessionData;
//     is_expire: number;
//     created_at: string;
//     updated_at: string;
//     formatted_date: string;
//     transaction?: any;
//     request: Request;
//   }
//
//   export interface SessionInfo {
//     status: string;
//     message: string;
//     data: SessionInfoData;
//   }
//
// }

