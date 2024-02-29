import { Schema, model, models } from 'mongoose';

import { IUser } from '@/typing';
import { ObjectId } from 'mongodb';

const userSchema = new Schema<IUser>({
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
});

export interface UserDocument {
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
}

const User = models?.User || model<IUser>('User', userSchema);

export default User;
