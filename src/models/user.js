import { Schema, model } from 'mongoose';



const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32
    },
    email: {
      type: String,
      unique: true,
      riquired: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128
    },
    avatarUrl: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (!this.username) {
    this.username = this.email;
  }
  next();
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
export default User;


