import { Schema, model } from 'mongoose';



const toolSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
    },

    images: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    specifications: {
      type: Object,
      of: String,
      default: {},
    },

    rentalTerms: {
      type: String,
      default: "",
    },

    bookedDates: {
      type: [Date],
      default: [],
    },

    feedbacks: [
      {
        type: Schema.Types.ObjectId,
        ref: "feedbacks",
      },
    ],
     userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
export const Tool = model('Tool', toolSchema);



