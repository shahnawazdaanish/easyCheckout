import DiscountList = app.shared.models.DiscountList;

export class CardInfo {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
  save: Boolean;
  selected: Boolean;
  emi?: Boolean;
  card_index?: string;
  emiBank?: string;
  emiTenure?: string;
  phone?: string;
  brand?: string;
  offer?: DiscountList;
  constructor() {
  }
}
