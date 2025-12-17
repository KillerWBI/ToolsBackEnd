import { Schema, model } from 'mongoose';

const toolSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
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
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0 && arr.length <= 5;
        },
        message: 'Images array must contain 1-5 items',
      },
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    rentalTerms: {
      type: String,
      default: '',
    },

    bookedDates: [
      {
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
          required: true,
        },
      },
    ],

    feedbacks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'feedbacks',
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

toolSchema.index({
  category: 'text',
  name: 'text',
  description: 'text',
});

export const Tool = model('Tool', toolSchema);
