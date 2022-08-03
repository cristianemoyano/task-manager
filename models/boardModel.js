import { Schema, model, models } from 'mongoose';

const subtasksSchema = new Schema({
  _id: Number,
  title: String,
  isCompleted: Boolean,
});

const tasksSchema = new Schema({
  _id: Number,
  title: String,
  description: String,
  status: String,
  subtasks: [subtasksSchema],
});

const columnsSchema = new Schema({
  _id: Number,
  name: String,
  tasks: [tasksSchema],
});

const boardSchema = new Schema({
  _id: Number,
  name: String,
  columns: [columnsSchema],
});

const Board = models.Board || model('Board', boardSchema);

export default Board;
