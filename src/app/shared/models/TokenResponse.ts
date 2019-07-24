export interface TokenData {
  reg_id: string;
  enc_key: string;
}

export interface TokenResponse {
  status: string;
  message: string;
  data: TokenData;
}
