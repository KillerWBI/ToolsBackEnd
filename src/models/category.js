import { Schema, model } from 'mongoose';



const CategoryShrma = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    keywords: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);
export const Category = model('Category', CategoryShrma);
export default Category;


