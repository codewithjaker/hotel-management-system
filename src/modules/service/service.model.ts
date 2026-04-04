// models/service.model.ts
import { Schema, model, Types } from "mongoose";

const serviceSchema = new Schema({
  hotelId: { type: Types.ObjectId, ref: "Hotel" },
  name: String,
  category: String,
  price: Number,
});

export const Service = model("Service", serviceSchema);