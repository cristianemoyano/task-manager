import Board from "@/models/boardModel";
import { IColumn, ITask } from "@/typing";
import { isEmpty, isEqual } from "lodash";
import { FilterQuery } from "mongoose";

function buildQuery(text: string = '', assignee?: string, priority?: string): any {
    const query: FilterQuery<any>  = {};
    if (!isEmpty(text)) {
        query['columns'] = { $elemMatch: { 'tasks.title': text } } ;
    }
    // if (!isEmpty(assignee)) {
    //     query['columns.tasks.assignee'] = assignee;
    // }
    // if (!isEmpty(priority)) {
    //     query['columns.tasks.priority'] = priority;
    // }
    return query;
}

export const searchTasks = async (text: string, assignee: string, priority: string) => {
    const query = buildQuery(text, assignee, priority);

    let boards = await Board.find({ });
    const allTasks: ITask[] = boards.flatMap(board => {
        const tasks = board.columns.flatMap((column:IColumn) => column.tasks)
        return tasks.map((task:ITask)=>{
            const nextTask = JSON.parse(JSON.stringify(task));
            return {...nextTask, board_id: board._id}
        })}
    );
    return allTasks.filter((task:ITask)=>{
        let query1, query2, query3 = false;
        if (!isEmpty(text)) {
            query1 = task.title.toUpperCase().includes(text.toUpperCase()) || task.description.toUpperCase().includes(text.toUpperCase()) || task.track_id.toUpperCase() === text.toUpperCase() 
        } else {
            query1 = true
        }
        if (!isEqual(assignee, "-")) {
            query2 = task.assignee === assignee
        } else {
            query2 = true
        }
        if (!isEqual(priority, "-")) {
            query3 = task.priority === priority
        } else {
            query3 = true
        }
        return query1 && (query2 && query3)
        
    })
}
