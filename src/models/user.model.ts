import mongoose, {Schema,Document} from "mongoose";
import bcrypt from "bcrypt"
import crypto from "crypto"

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  role:'ADMIN' | 'USER';
  isVerified: boolean;
  profileImage?: string;
  emailVerificationCode:string;
  emailVerificationCodeExpiry:Date;
  resetAndForgotPasswordToken:string;
  resetAndForgotPasswordTokenExpiry:Date;
}


const UserSchema:Schema<User> = new Schema({
  username:{
    type: String,
    required: [true,"username is required field"],
    unique: true,
    minlength: [3,"username must be at least 3 characters"],
    maxlength: [20,"username must be at most 20 characters"],
    trim: true,
  },
  email:{
    type: String,
    required: [true,"email is required field"],
    unique: true,
    lowercase: true,
    validate: {
      validator: (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: "Invalid email format",
    },
  },

  password:{
    type: String,
    required: [true,"password is required field"],
    minlength: [6,"password must be at least 6 characters"],
  },

  role:{
    type: String,
    enum: ['ADMIN', 'USER'],
    default: 'USER',
  },

  isVerified:{
    type: Boolean,
    default: false,
  },

  profileImage:{
    type: String,
    default: '',
  },

  emailVerificationCode:{
    type: String,
    default: '',
  },

  emailVerificationCodeExpiry:{
    type: Date,
    default: null,
  },

  resetAndForgotPasswordToken:{
    type: String,
    default: '',
  },

  resetAndForgotPasswordTokenExpiry:{
    type: Date,
    default: null,
  },

});



const UserModel = (mongoose.models.User as mongoose.Model<User>) ||
                    mongoose.model<User>('User', UserSchema);

export default UserModel;

