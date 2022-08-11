import type { NextPage } from 'next';
import useSWR from 'swr';
import axios from 'axios';

import { IBoard } from '@/typing';
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
import NewItem from '@/components/shared/NewItem';

export async function getStaticPaths() {
  await connectMongo();

  const boards = await Board.find().select(['-columns']);

  const paths = boards.map((board) => ({
    params: { board_id: board._id.toString() },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({
  params,
}: {
  params: { board_id: string };
}) {
  const { board_id } = params;
  await connectMongo();

  let board = await Board.findOne({ _id: board_id });
  board = JSON.parse(JSON.stringify(board));

  let boards = await Board.find().select(['-columns']);
  boards = JSON.parse(JSON.stringify(boards));

  return {
    props: {
      isrBoards: boards,
      isrBoard: board,
      board_id,
    },
  };
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const SingleBoard: NextPage<{
  isrBoards: IBoard[];
  isrBoard: IBoard;
  board_id: string;
}> = ({ isrBoards, isrBoard, board_id }) => {
  const { data: boards, error: boardsError } = useSWR<IBoard[], any>(
    '/api/boards',
    fetcher,
    {
      fallbackData: isrBoards,
      revalidateOnFocus: false,
    }
  );

  const { data: board, error: boardError } = useSWR<IBoard, any>(
    `/api/boards/${board_id}`,
    fetcher,
    {
      fallbackData: isrBoard,
      revalidateOnFocus: false,
    }
  );

  const { setIsNewBoard, toggleBoardModal } = useModal();

  if (boardsError || boardError || !boards || !board) return <h1>Error</h1>;

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
              <NewItem
                isColumn={true}
                onClick={() => {
                  setIsNewBoard(false);
                  toggleBoardModal();
                }}
              />
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

export default SingleBoard;
