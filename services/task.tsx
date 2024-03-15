import Board from "@/models/boardModel";
import { IColumn, ITask } from "@/typing";
import { isEmpty, isEqual } from "lodash";
import { FilterQuery } from "mongoose";

function buildQuery(text: string = '', assignee?: string, priority?: string, track_id?: string, is_closed?: string, project_id?: string): any {
  let expr: FilterQuery<any> = {};

  if (!isEmpty(text)) {
    expr['columns.tasks.title'] = { '$regex': text, '$options': 'i' };
  }
  if (!isEmpty(assignee)) {
    expr['columns.tasks.assignee'] = assignee;
  }
  if (!isEmpty(priority)) {
    expr['columns.tasks.priority'] = priority;
  }
  if (!isEmpty(track_id)) {
    expr['columns.tasks.track_id'] = track_id;
  }
  if (!isEmpty(is_closed)) {
    expr['columns.tasks.is_closed'] = Boolean(Number(is_closed));
  }
  if (!isEmpty(project_id)) {
    expr['columns.tasks.project_id'] = project_id;
  }
  const query = [
    {
      $match: {
        '$and': [
          expr
        ]
      }
    },
  ]
  return query;
}

export const searchTasks = async (text: string, assignee: string, priority: string, track_id: string, is_closed: string, project_id: string) => {
  const query = buildQuery(text, assignee, priority, track_id, is_closed, project_id);
  let boards = await Board.aggregate(query);
  const allTasks: ITask[] = boards.flatMap(board => {
    const tasks = board.columns.flatMap((column: IColumn) => column.tasks)
    return tasks.map((task: ITask) => {
      const nextTask = JSON.parse(JSON.stringify(task));
      return { ...nextTask, board_id: board._id }
    })
  }
  );
  return allTasks.filter((task: ITask) => {
    let query1, query2, query3, query4, query5, query6 = false;
    if (!isEmpty(text)) {
      query1 = task.title.toUpperCase().includes(text.toUpperCase()) || task.description.toUpperCase().includes(text.toUpperCase()) || task.track_id.toUpperCase() === text.toUpperCase()
    } else {
      query1 = true
    }
    if (!isEqual(assignee, "")) {
      query2 = task.assignee === assignee
    } else {
      query2 = true
    }
    if (!isEqual(priority, "")) {
      query3 = task.priority === priority
    } else {
      query3 = true
    }
    if (!isEmpty(track_id)) {
      query4 = task.track_id.toUpperCase() === track_id.toUpperCase()
    } else {
      query4 = true
    }
    if (!isEmpty(is_closed)) {
      query5 =  Boolean(Number(task.is_closed)) === Boolean(Number(is_closed))
    } else {
      query5 = true
    }
    if (!isEqual(project_id, "")) {
      query6 = task.project_id === project_id
    } else {
      query6 = true
    }
    return query1 && (query2 && query3) && query4 && query5 && query6

  })
}
