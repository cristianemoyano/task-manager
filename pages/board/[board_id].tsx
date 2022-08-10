import type { NextPage } from 'next';

import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import { IBoard } from '@/typing';
import useModal from '@/contexts/useModal';

import HeadOfPage from '@/components/shared/HeadOfPage';
import Navbar from '@/components/navbar/Navbar';
import BoardModal from '@/components/modals/BoardModal';
import TaskModal from '@/components/modals/TaskModal';
import DeleteModal from '@/components/modals/DeleteModal';
import TaskInfosModal from '@/components/modals/TaskInfosModal';
import BoardColumn from '@/components/single_board/BoardColumn';
import EmptyState from '@/components/shared/EmptyState';

const SingleBoard: NextPage<{ board: IBoard; boards: IBoard[] }> = ({
  board,
  boards,
}) => {
  const { setIsNewBoard, toggleBoardModal } = useModal();

  return (
    <HeadOfPage title='Board' content='Your Board'>
      {board ? (
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
      ) : (
        <h1>something went wring</h1>
      )}
    </HeadOfPage>
  );
};

export async function getStaticPaths() {
  await connectMongo();

  const boards = await Board.find();

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

  let boards = await Board.find();
  boards = JSON.parse(JSON.stringify(boards));

  return {
    props: {
      board: board,
      boards: boards,
    },
  };
}

export default SingleBoard;
