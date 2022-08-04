import { Schema, model, models } from 'mongoose';

import { ISubtask, ITask, IColumn, IBoard } from '@/typing';

const subtasksSchema = new Schema<ISubtask>({
  _id: { type: Number, required: false },
  title: String,
  isCompleted: Boolean,
});

const tasksSchema = new Schema<ITask>({
  _id: { type: Number, required: false },
  title: String,
  description: String,
  status: String,
  subtasks: [subtasksSchema],
});

const columnsSchema = new Schema<IColumn>({
  _id: { type: Number, required: false },
  name: String,
  tasks: [tasksSchema],
});

const boardSchema = new Schema<IBoard>({
  _id: { type: Number, required: false },
  name: String,
  columns: [columnsSchema],
});

const Board = models.Board || model<IBoard>('Board', boardSchema);

export default Board;
