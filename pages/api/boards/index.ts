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
    const boards = await Board.find().select(['-columns']);

    res.status(200).json(boards);
  }

  if (method === 'POST') {
    const { board } = body;

    const newBoard = await Board.create(board);

    res.status(201).json(newBoard);
  }
}
