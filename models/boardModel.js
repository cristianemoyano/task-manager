import { Schema, model, models } from 'mongoose';

const subtasksSchema = new Schema({
  title: String,
  isCompleted: Boolean,
});

const tasksSchema = new Schema({
  title: String,
  description: String,
  status: String,
  subtasks: [subtasksSchema],
});

const columnsSchema = new Schema({
  name: String,
  tasks: [tasksSchema],
});

const boardSchema = new Schema({
  name: String,
  columns: [columnsSchema],
});

const Board = models.Board || model('Board', boardSchema);

export default Board;
