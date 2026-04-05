import { Types } from "mongoose";

export interface IJwtPayload {
  id: Types.ObjectId;
  email: string;
  role: string;
  hotelId?: Types.ObjectId;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginResponse {
  user: any;
  tokens: ITokens;
}