declare module app.shared.models {

  export interface DiscountList {
    priority: number;
    AvailDiscountId: string;
    discountTitle: string;
    offerDesc: string;
    gateway: any[];
    disIMGPath: string;
    MaxDisAmt: string;
    disPercentage: string;
    firstDigitAllowed: any[];
    allowedBIN: string[];
    isCouponEnable: number;
    termNConditionURL: string;
    redirectGWPath: string;
    payableAMT: string;
    hover?: boolean;
    regularPrice?: string;
    is_visa?: string;
    is_master?: string;
    is_amex?: string;
    is_other_card?: string;
    is_ib?: string;
    is_wallet?: string;
    offerEndOnDate?: string;
  }

  export interface OfferData {
    actionStatus: string;
    discountList: DiscountList[];
    msgToDisplay: string;
    systemMesg: string;
  }

  export interface ResponseData {
    status: string;
    data: OfferData;
  }

  export interface OfferInformation {
    status: string;
    message: string;
    data: ResponseData;
  }

}
