import { Schema, model } from 'mongoose';



const FeedbackShema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    rate: {
      type: Number,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);
export const Feedbacks = model('feedbacks', FeedbackShema);



