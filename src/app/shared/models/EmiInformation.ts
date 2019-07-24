declare module app.shared.models {
  interface EmiBankTenure {
    tenure: number;
  }
  interface EmiBankTenureDesc {
    tenure: number;
    desc: string;
  }
  interface EmiInformation {
    status: string;
    message: string;
    data: FetchedData;
  }

  interface FetchedData {
    status: string;
    data: EmiData;
  }

  interface EmiData {
    actionStatus: string;
    emi: Emi[];
    msgToDisplay: string;
    systemMesg: string;
  }

  interface Emi {
    emiBankID: string;
    emiBankTenureList: EmiBankTenure[];
    emiBankTenureDesc: EmiBankTenureDesc[];
    bankName: string;
    binList: string[];
    bankLogo: string;
    redirectGWPath: string;
  }
}
