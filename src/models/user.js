import { Schema, model } from 'mongoose';



const UserShema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);
export const User = model('User', UserShema);
export default User;
