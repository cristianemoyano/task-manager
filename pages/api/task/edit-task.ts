import type { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import { IColumn, ITask } from '@/typing';
import { isEmpty } from 'lodash';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body, query } = req;
  await connectMongo();

  if (method === 'PATCH') {
    try {
      const { board_id, column_id, task_id, task, comment } = body;

      let board = await Board.findOne({
        _id: board_id,
        // user_id: query.user_id,
      });

      const taskToUpdate = board.columns
        .find((c: IColumn) => c._id.toString() === column_id)
        .tasks.find((t: ITask) => t._id.toString() === task_id);

      if (!isEmpty(comment?.value)) {
        taskToUpdate.comments.push(comment)
      }
      taskToUpdate.title = task.title;
      taskToUpdate.track_id = task.track_id;
      taskToUpdate.priority = task.priority;
      taskToUpdate.assignee = task.assignee;
      taskToUpdate.description = task.description;
      taskToUpdate.subtasks = task.subtasks;
      taskToUpdate.is_closed = task.is_closed;
  
      await board.save();

      res.status(200).json(task);
    } catch (error) {
      console.error(error)
      res.status(500).json(error);
    }
  }
}
