import type { NextPage } from 'next';

import { GetServerSideProps } from 'next';

import useModal from '@/contexts/useModal';
import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import { IBoard } from '@/typing';

import HeadOfPage from '@/components/shared/HeadOfPage';
import EmptyState from '@/components/shared/EmptyState';
import Navbar from '@/components/navbar/Navbar';
import BoardModal from '@/components/modals/BoardModal';
import Sidebar from '@/components/sidebar/Sidebar';
import { auth } from '@/services/auth';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home: NextPage<{ boards: IBoard[] }> = ({ boards = [] }) => {
  const { toggleBoardModal, setIsNewBoard } = useModal();
  const { data: session } = useSession()

  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [router]);

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
  const session = await auth(
    context.req,
    context.res,
  )

  if (session?.user) {

    const clientSession = await getSession(context);

    console.log("INIT CLIENT SESSION: ", clientSession);

    await connectMongo();

    let boards = await Board.find({ user_id: clientSession?.id }).select(['-columns']);
    boards = JSON.parse(JSON.stringify(boards));

    return {
      props: {
        boards,
        session: JSON.parse(JSON.stringify(session))
      },
    };
  }
  
  return {
    props: {
      boards: [],
      session,
    },
  };

 
};

export default Home;
