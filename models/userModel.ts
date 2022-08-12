import { Schema, model, models } from 'mongoose';

import { IUser } from '@/typing';

const userSchema = new Schema<IUser>({
  name: String,
  email: String,
  password: String,
});

const User = models?.User || model<IUser>('User', userSchema);

export default User;
