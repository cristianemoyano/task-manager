import Board from "@/models/boardModel";

export const getOwnedBoardsByUser = async (userId: string) => {
    let boards = await Board.find({ user_id: userId}).select(['-columns']);
    return boards
}

export const getAsignedBoardsByUser = async (userId: string) => {
    let boards = await Board.find({ 'columns':  { $elemMatch: { 'tasks.assignee': userId } }}).select(['-columns']);
    return boards
}
