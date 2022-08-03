import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';

export default async function handler(req, res) {
  const {
    method,
    body,
    query: { boardId },
  } = req;
  await connectMongo();

  if (method === 'PATCH') {
    const { column_id, task } = body;

    const board = await Board.findOne({ _id: boardId });

    const column = board.columns.find(
      (col) => col._id.toString() === column_id
    );

    column.tasks.push(task);

    const boardUpdated = await board.save();

    res.status(200).json(boardUpdated);
  }
}
