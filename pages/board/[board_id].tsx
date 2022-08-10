import { useRouter } from 'next/router';
import useSWR, { mutate, Fetcher } from 'swr';
import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import useModal from '@/contexts/useModal';

import HeadOfPage from '@/components/shared/HeadOfPage';
import Navbar from '@/components/navbar/Navbar';
import BoardModal from '@/components/modals/BoardModal';
import TaskModal from '@/components/modals/TaskModal';
import DeleteModal from '@/components/modals/DeleteModal';
import TaskInfosModal from '@/components/modals/TaskInfosModal';
import BoardColumn from '@/components/single_board/BoardColumn';
import EmptyState from '@/components/shared/EmptyState';
import { IBoard } from '@/typing';
import axios from 'axios';
import { useState } from 'react';

const fetcher: Fetcher<any, string> = (url) =>
  axios.get(url).then((res) => res.data);

const SingleBoard = () => {
  const router = useRouter();
  const { board_id } = router.query;

  const { data: boards, error: boardsError } = useSWR<IBoard[], any>(
    '/api/boards',
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const { data: board, error: boardError } = useSWR<IBoard, any>(
    `/api/boards/${board_id}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { setIsNewBoard, toggleBoardModal } = useModal();

  if (!boards || !board) return <h1>Loading</h1>;

  if (boardsError || boardError) return <h1>Error</h1>;

  console.log('boards', boards);
  console.log('board', board);

  return (
    <HeadOfPage title='Board' content='Your Board'>
      <>
        <Navbar boards={boards} board={board} />
        <BoardModal board={board} />
        <TaskModal board={board} />
        <DeleteModal board={board} />
        <TaskInfosModal board={board} />
        {board.columns.length ? (
          <main className='board__main'>
            <div className='board__main__container'>
              {board.columns.map((column) => (
                <BoardColumn key={column._id} column={column} />
              ))}
              <div
                className='board__new__column'
                onClick={() => {
                  setIsNewBoard(false);
                  toggleBoardModal();
                }}
              >
                <h1 className='board__new__column__title'>+ New Column</h1>
              </div>
            </div>
          </main>
        ) : (
          <EmptyState
            title='This board is empty. Create a new column to get started.'
            button='+ Add New Column'
            handleClick={() => {
              setIsNewBoard(false);
              toggleBoardModal();
            }}
          />
        )}
      </>
    </HeadOfPage>
  );
};

// export async function getStaticPaths() {
//   await connectMongo();

//   const boards = await Board.find();

//   const paths = boards.map((board) => ({
//     params: { board_id: board._id.toString() },
//   }));

//   return { paths, fallback: 'blocking' };
// }

// export async function getStaticProps({
//   params,
// }: {
//   params: { board_id: string };
// }) {
//   const { board_id } = params;
//   await connectMongo();

//   let board = await Board.findOne({ _id: board_id });
//   board = JSON.parse(JSON.stringify(board));

//   let boards = await Board.find();
//   boards = JSON.parse(JSON.stringify(boards));

//   return {
//     props: {
//       board: board,
//       boards: boards,
//     },
//   };
// }

export default SingleBoard;
