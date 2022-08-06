import type { NextPage } from 'next';

import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import { IBoard } from '@/typing';

import HeadOfPage from '@/components/shared/HeadOfPage';
import Navbar from '@/components/navbar/Navbar';
import BoardModal from '@/components/modals/BoardModal';

const SingleBoard: NextPage<{ board: IBoard; boards: IBoard[] }> = ({
  board,
  boards,
}) => {
  console.log(board);
  return (
    <HeadOfPage title='Board' content='Your Board'>
      <>
        <Navbar boards={boards} board={board} />
        <BoardModal isNewBoard={false} board={board} />
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
