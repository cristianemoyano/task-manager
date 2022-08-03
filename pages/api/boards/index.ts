import type { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  await connectMongo();

  if (method === 'GET') {
    const boards = await Board.find();

    res.status(200).json(boards);
  }

  if (method === 'POST') {
    const { board } = body;

    const newBoard = await Board.create(board);

    res.status(201).json(newBoard);
  }
}

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { method, body } = req;
//   const { db } = await connectToDatabase();

//   if (method === 'GET') {
//     const boards = await db.collection('boards').find().toArray();

//     res.status(200).json(boards);
//   }

//   if (method === 'POST') {
//     const board = body;

//     const newBoard = await db.collection('boards').insertOne(board);

//     res.status(201).json(newBoard);
//   }
// }
