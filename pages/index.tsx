import type { NextPage } from 'next';
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';

import useModal from '@/contexts/useModal';
import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import { IBoard } from '@/typing';

import HeadOfPage from '@/components/shared/HeadOfPage';
import EmptyState from '@/components/shared/EmptyState';
import Navbar from '@/components/navbar/Navbar';
import BoardModal from '@/components/modals/BoardModal';
import Sidebar from '@/components/sidebar/Sidebar';

const Home: NextPage<{ boards: IBoard[] }> = ({ boards = [] }) => {
  const { toggleBoardModal, setIsNewBoard } = useModal();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isEmpty(session?.id)) {
      router.push('/register');
    }
  }, [session, router]);

  return (
    <HeadOfPage title='Home' content='Welcome Home'>
      <>
        <BoardModal />
        <main>
          <Sidebar boards={boards} />
          <div>
            <Navbar boards={boards} />
            {boards.length ? (
              <EmptyState
                title='Choose the board that you want to see or create a new one.'
                button='+ Add New Board'
                handleClick={() => {
                  toggleBoardModal();
                  setIsNewBoard(true);
                }}
              />
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
          </div>
        </main>
      </>
    </HeadOfPage>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  
  if (isEmpty(session?.id)) {
    return {
      props: {
      },
    };
  }

  await connectMongo();

  let boards = await Board.find({ user_id: session?.id }).select(['-columns']);
  boards = JSON.parse(JSON.stringify(boards));

  return {
    props: {
      boards,
    },
  };
};

export default Home;
