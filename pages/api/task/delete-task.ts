import type { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import { IColumn, ITask } from '@/typing';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  await connectMongo();

  if (method === 'DELETE') {
    try {
      const { board_id, column_id, task_id, user_id } = query;

      const board = await Board.findOne({ _id: board_id, user_id });

      const columnToUpdate: IColumn = board.columns.find(
        (c: IColumn) => c._id.toString() == column_id
      );
      const taskIndex = columnToUpdate.tasks!.findIndex(
        (t: ITask) => t._id.toString() == task_id
      );
      columnToUpdate.tasks!.splice(taskIndex, 1);

      const boardUpdated = await board.save();

      res.status(200).json(boardUpdated);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
