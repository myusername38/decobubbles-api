import { Role } from 'src/enums/role.enum';

export interface UserTokenData {
  role: Role;
  iss: string;
  aud: string;
  auth_time: string;
  user_id: string;
  sub: string;
  exp: number;
  email: string;
  email_verified: boolean;
  firebase: any;
  uid: string;
}
