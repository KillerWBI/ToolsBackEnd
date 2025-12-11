import { Schema, model } from 'mongoose';

const UserShema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: '<https://ac.goit.global/fullstack/react/default-avatar.jpg>', // внести адресу дефолтного зображення аватару з Монго
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const User = model('User', UserShema);
export default User;
