import mongoose from "mongoose";

const deliveryAssignmentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    shopOrderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    broadcastedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    status: {
        type: String,
        enum: ["broadcasted", "assigned", "enroute", "completed", "expired"],
        default: "broadcasted",
    },
    acceptedAt: Date,
    createdAt: { type: Date, default: Date.now },
});

const DeliveryAssignment = mongoose.model(
    "DeliveryAssignment",
    deliveryAssignmentSchema
);
export default DeliveryAssignment;
