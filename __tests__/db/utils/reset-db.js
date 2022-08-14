import mongoose from 'mongoose';

import Board from '@/models/boardModel';
import User from '@/models/userModel';
import { initialBoards } from '../initialBoards';

export async function connect() {
  mongoose.connect(process.env.MONGODB_URI);

  await Board.deleteMany({});
  await User.deleteMany({});

  return await Board.insertMany(initialBoards);
}

export async function closeAndReset() {
  mongoose.connection.close();
}
