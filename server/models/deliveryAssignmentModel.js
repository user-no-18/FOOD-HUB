import mongoose from "mongoose";

const deliveryAssignmentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    shopOrderId: { type: mongoose.Schema.Types.ObjectId, required: false },
    broadcastedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    status: {
        type: String,
        enum: ["broadcasted", "assigned","completed"],
        default: "broadcasted",
    },
    acceptedAt: Date,
}, { timestamps: true });

// Add performance indexes for efficient dispatching queries
deliveryAssignmentSchema.index({ broadcastedTo: 1, status: 1 });
deliveryAssignmentSchema.index({ assignedTo: 1, status: 1 });
deliveryAssignmentSchema.index({ order: 1, shop: 1 });

const DeliveryAssignment = mongoose.model(
    "DeliveryAssignment",
    deliveryAssignmentSchema
);
export default DeliveryAssignment;
