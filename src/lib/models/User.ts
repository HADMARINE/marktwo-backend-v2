import { model, Schema, Model, Document } from 'mongoose';

const userSchema = new Schema({
  uid: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  enckey: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

export interface UserDocument extends Document {
  uid: string;
  password: string;
  name: string;
  enckey: string;
  email: string;
  isAdmin: boolean;
}

const User: Model<UserDocument> = model('user', userSchema);

export default User;
