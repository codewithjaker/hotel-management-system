import { Types } from "mongoose";

export interface IGuest {
  _id?: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  idType?: "passport" | "nid" | "driving_license" | "other";
  idNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  preferences?: {
    language?: string;
    smoking?: boolean;
    specialRequests?: string;
  };
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type GuestDocument = IGuest & Document;