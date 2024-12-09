import mongoose from "mongoose";

const PickUpOrderSchema = new mongoose.Schema(
  {
    pickUpNumber: {
      type: String,
    },
    companyName: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "ready", "cancelled"],
      default: "pending",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const PickUpOrder = mongoose.model("PickUpOrder", PickUpOrderSchema);
export default PickUpOrder;
