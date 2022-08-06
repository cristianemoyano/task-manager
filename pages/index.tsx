import type { NextPage } from 'next';

import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import { IBoard } from '@/typing';

import HeadOfPage from '@/components/shared/HeadOfPage';
import EmptyState from '@/components/shared/EmptyState';
import Navbar from '@/components/navbar/Navbar';
import AddNewBoard from '@/components/modals/AddNewBoard';

const Home: NextPage<{ boards: [IBoard] }> = ({ boards }) => {
  return (
    <HeadOfPage title='Home' content='Welcome Home'>
      <>
        <Navbar boards={boards} />
        <AddNewBoard />
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
            handleClick={() => console.log('click')}
          />
        )}
      </>
    </HeadOfPage>
  );
};

export async function getStaticProps() {
  await connectMongo();

  const boards = await Board.find();
  const allBoards = JSON.parse(JSON.stringify(boards));

  return {
    props: {
      boards: allBoards,
    },
    // revalidate: true,
  };
}

export default Home;
