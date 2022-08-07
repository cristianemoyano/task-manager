import type { NextPage } from 'next';

import useModal from '@/contexts/useModal';
import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import { IBoard } from '@/typing';

import HeadOfPage from '@/components/shared/HeadOfPage';
import Navbar from '@/components/navbar/Navbar';
import BoardModal from '@/components/modals/BoardModal';
import TaskModal from '@/components/modals/TaskModal';
import DeleteModal from '@/components/modals/DeleteModal';
import TaskInfosModal from '@/components/modals/TaskInfosModal';

const SingleBoard: NextPage<{ board: IBoard; boards: IBoard[] }> = ({
  board,
  boards,
}) => {
  const { toggleTaskInfosModal, setTaskInfosModalContent } = useModal();
  return (
    <HeadOfPage title='Board' content='Your Board'>
      <>
        <Navbar boards={boards} board={board} />
        <BoardModal isNewBoard={false} board={board} />
        <TaskModal board={board} />
        <DeleteModal />
        <TaskInfosModal board={board} />
        <main>
          {board.columns.map((column) => (
            <div key={column._id}>
              <h1>{column.name}</h1>
              {column.tasks?.map((task) => (
                <button
                  key={task?._id}
                  onClick={() => {
                    setTaskInfosModalContent(task);
                    toggleTaskInfosModal();
                  }}
                >
                  {task.title}
                </button>
              ))}
            </div>
          ))}
        </main>
      </>
    </HeadOfPage>
  );
};

export async function getStaticProps({
  params,
}: {
  params: { board_id: string };
}) {
  const { board_id } = params;

  let board = await Board.findOne({ _id: board_id });
  board = JSON.parse(JSON.stringify(board));

  let boards = await Board.find();
  boards = JSON.parse(JSON.stringify(boards));

  return {
    props: {
      board,
      boards,
    },
    // revalidate: true,
  };
}

export async function getStaticPaths() {
  await connectMongo();

  const boards = await Board.find();

  const paths = boards.map((board) => ({
    params: { board_id: board._id.toString() },
  }));

  return { paths, fallback: 'blocking' };
}

export default SingleBoard;
