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
import User from '@/models/userModel';
import { EMPTY_BOARDS_MSG, HOME, HOME_MSG, NEW_BOARD, WELCOME_MSG } from '@/components/constants';

const Home: NextPage<{ boards: IBoard[], user_id:string }> = ({ boards = [], user_id }) => {
  const { toggleBoardModal, setIsNewBoard } = useModal();
  const { data: session } = useSession()

  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [router]);

  return (
    <HeadOfPage title={HOME} content={WELCOME_MSG}>
      <>
        <BoardModal user_id={user_id} />
        <main>
          <Sidebar boards={boards} />
          <div>
            <Navbar boards={boards} />
            {boards.length ? (
              <EmptyState
                title={HOME_MSG}
                button={`+ ${NEW_BOARD}`}
                handleClick={() => {
                  toggleBoardModal();
                  setIsNewBoard(true);
                }}
              />
            ) : (
              <EmptyState
                title={EMPTY_BOARDS_MSG}
                button={`+ ${NEW_BOARD}`}
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

    let user = await User.findOne({ email: session?.user?.email })
    let boards = await Board.find({ user_id: user._id }).select(['-columns']);
    boards = JSON.parse(JSON.stringify(boards));

    user = JSON.parse(JSON.stringify(user));

    return {
      props: {
        boards,
        session: JSON.parse(JSON.stringify(session)),
        user_id: user._id,
      },
    };
  }
  
  return {
    props: {
      boards: [],
      session,
      user_id: null,
    },
  };

 
};

export default Home;
