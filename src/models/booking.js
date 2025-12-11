import { Schema, model } from 'mongoose';

const bookingSchema = new Schema(
  {
    toolId: {
      type: Schema.Types.ObjectId,
      ref: 'Tool',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Ендпоінт приватний
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryCity: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryBranch: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Booking = model('Booking', bookingSchema);
