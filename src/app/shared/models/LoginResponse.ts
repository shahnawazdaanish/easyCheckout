export interface TransactionsList {
  date: string;
  time: string;
  transId: string;
  tAmount: string;
  cardNo: string;
  description: string;
  type: string;
}

export interface CardNo {
  cardindex: string;
  cardNo: string;
  bankName: string;
  friendlyName: string;
  type: string;
}

export interface ActiveSession {
  sessionIndex: string;
  ipAddress: string;
  browser: string;
  osName: string;
  handset: string;
  sessionStartTime: string;
  location: string;
}

export interface Data {
  actionStatus: string;
  msgToDisplay: string;
  systemMesg: string;
  custSession: string;
  isOTPEnable: string;
  loginID: string;
  registeredOn: string;
  custFName: string;
  custLName: string;
  gender: string;
  profileImage: string;
  dtOfBirth: string;
  shipmentAddress1: string;
  shipmentAddress2: string;
  shipmentCity: string;
  shipmentState: string;
  shipmentPostcode: string;
  shipmentCountry: string;
  isMobileNoVerified: string;
  mobileNo: string;
  isEmailIdVerified: string;
  emailId: string;
  transactionsList: TransactionsList[];
  cardNos: CardNo[];
  activeSession: ActiveSession[];
}

export interface LoginResponse {
  status: string;
  data: Data;
}
