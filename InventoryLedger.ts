import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInventoryLedger extends Document {
  product: Types.ObjectId;
  changeType: "sale" | "purchase" | "adjustment" | "refund";
  quantityChange: number;
  previousStock: number;
  newStock: number;
  referenceId?: Types.ObjectId;
  notes?: string;
}

const InventoryLedgerSchema = new Schema<IInventoryLedger>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    changeType: {
      type: String,
      enum: ["sale", "purchase", "adjustment", "refund"],
      required: true
    },
    quantityChange: {
      type: Number,
      required: true
    },
    previousStock: {
      type: Number,
      required: true
    },
    newStock: {
      type: Number,
      required: true
    },
    referenceId: {
      type: Schema.Types.ObjectId
    },
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IInventoryLedger>(
  "InventoryLedger",
  InventoryLedgerSchema
);