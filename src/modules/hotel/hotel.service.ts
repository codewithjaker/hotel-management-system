import { Hotel } from "./hotel.model";
import { IHotel } from "./hotel.interface";

export const createHotel = async (payload: IHotel) => {
  return await Hotel.create(payload);
};

export const getHotels = async () => {
  return await Hotel.find();
};
