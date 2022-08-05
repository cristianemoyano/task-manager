import mongoose from 'mongoose';

import Board from '@/models/boardModel';
import { initialBoards } from '../initialBoards';

// beforeAll(async () => {
//   mongoose.connect(process.env.MONGODB_URI);

//   await Board.insertMany(initialBoards);
// });

// afterAll(async () => {
//   await Board.deleteMany({});

//   mongoose.connection.close();
// });

export async function connect() {
  mongoose.connect(process.env.MONGODB_URI);

  await Board.insertMany(initialBoards);
}

export async function closeAndReset() {
  await Board.deleteMany({});

  mongoose.connection.close();
}
