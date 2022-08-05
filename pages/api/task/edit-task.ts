import type { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import { IColumn, ITask } from '@/typing';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  await connectMongo();

  if (method === 'PATCH') {
    const { board_id, column_id, task_id, task } = body;

    const board = await Board.findOne({ _id: board_id });

    const taskToUpdate = board.columns
      .find((c: IColumn) => c._id.toString() == column_id)
      .tasks.find((t: ITask) => t._id.toString() == task_id);

    taskToUpdate.title = task.title;
    taskToUpdate.description = task.description;
    taskToUpdate.subtasks = task.subtasks;

    const boardUpdated = await board.save();

    res.status(200).json(boardUpdated);
  }
}
