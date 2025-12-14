import { Schema, model } from 'mongoose';

const FeedbackShema = new Schema(
  {
    toolId: {
      type: Schema.Types.ObjectId,
      ref: 'Tool',
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
      trim: true,
      minlength: 2,
      maxlength: 2000,
    },
    rate: {
      type: Number,
      required: true,
      trim: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true, versionKey: false }
);
export const Feedbacks = model('feedbacks', FeedbackShema);
