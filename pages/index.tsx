import type { NextPage } from 'next';

import useModal from '@/contexts/useModal';
import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import { IBoard } from '@/typing';

import HeadOfPage from '@/components/shared/HeadOfPage';
import EmptyState from '@/components/shared/EmptyState';
import Navbar from '@/components/navbar/Navbar';
import BoardModal from '@/components/modals/BoardModal';

const Home: NextPage<{ boards: IBoard[] }> = ({ boards }) => {
  const { toggleBoardModal, setIsNewBoard } = useModal();

  return (
    <HeadOfPage title='Home' content='Welcome Home'>
      <>
        <Navbar boards={boards} />
        <BoardModal />
        {boards.length ? (
          <main className='home'>
            <h1 className='home__title'>
              Choose the board that you want to see
            </h1>
          </main>
        ) : (
          <EmptyState
            title='You have no board yet. Create a new board to get started.'
            button='+ Add New Board'
            handleClick={() => {
              toggleBoardModal();
              setIsNewBoard(true);
            }}
          />
        )}
      </>
    </HeadOfPage>
  );
};

export async function getStaticProps() {
  await connectMongo();

  let boards = await Board.find();
  boards = JSON.parse(JSON.stringify(boards));

  return {
    props: {
      boards,
    },
    // revalidate: true,
  };
}

export default Home;
