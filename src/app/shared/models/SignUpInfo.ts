export class SignUpInfo {
  number: string;
  otp: string;
  email: string;
  password: string;
  conf_password?: string;
  name?: string;
  strength?: number;
  oldUser?: boolean;
  constructor() {
  }
}
