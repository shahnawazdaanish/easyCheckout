export class NookRequest {
  uin: string;
  bank_txn_id: string;
  amount: number;
  currency: string;
  email: string;
  store_name: string;
  store_image_url: string;
  return_url: string;
  cancel_url: string;
  order_id: string;
  merchant_trx_id: string;
  is_app: number;
  do_add: number;
  is_transaction: number;
  is_emi: number;
  is_offer: number;
  allowed_bin: string;

  constructor(
    uin: string,
    bank_txn_id: string,
    amount: number,
    currency: string,
    email: string,
    store_name: string,
    store_image_url: string,
    return_url: string,
    cancel_url: string,
    order_id: string,
    merchant_trx_id: string,
    is_app: number,
    do_add: number,
    is_transaction: number,
    is_emi: number,
    is_offer: number,
    allowed_bin: string
  ) {
    this.uin = uin;
    this.bank_txn_id = bank_txn_id;
    this.amount = amount;
    this.currency = currency;
    this.email = email;
    this.store_name = store_name;
    this.store_image_url = store_image_url;
    this.return_url = return_url;
    this.cancel_url = cancel_url;
    this.order_id = order_id;
    this.merchant_trx_id = merchant_trx_id;
    this.is_app = is_app;
    this.do_add = do_add;
    this.is_transaction = is_transaction;
    this.is_emi = is_emi;
    this.is_offer = is_offer;
    this.allowed_bin = allowed_bin;
  }
}
