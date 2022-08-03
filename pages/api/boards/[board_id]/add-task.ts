import type { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';

interface Column {
  _id: string;
  tasks: [];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body,
    query: { board_id },
  } = req;
  await connectMongo();

  if (method === 'PATCH') {
    const { column_id, task } = body;

    const board = await Board.findOne({ _id: board_id });

    const column = board.columns.find(
      (col: Column) => col._id.toString() === column_id
    );

    column.tasks.push(task);

    const boardUpdated = await board.save();

    res.status(200).json(boardUpdated);
  }
}
