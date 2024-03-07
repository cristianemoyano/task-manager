import type { NextPage } from 'next';

import { GetServerSideProps } from 'next';

import useModal from '@/contexts/useModal';
import connectMongo from '@/services/connectMongo';
import { IBoard, IUser } from '@/typing';

import HeadOfPage from '@/components/shared/HeadOfPage';
import EmptyState from '@/components/shared/EmptyState';
import Navbar from '@/components/navbar/Navbar';
import BoardModal from '@/components/modals/BoardModal';
import Sidebar from '@/components/sidebar/Sidebar';
import { auth } from '@/services/auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { EMPTY_BOARDS_MSG, HOME, HOME_MSG, NEW_BOARD, WELCOME_MSG } from '@/components/constants';
import { getUserByEmail } from '@/services/user';
import { getAsignedBoardsByUser, getOwnedBoardsByUser } from '@/services/board';

const Home: NextPage<{ boards: IBoard[], assignedBoards: IBoard[], user_id:string, user:IUser }> = ({ boards = [], assignedBoards =[], user_id, user }) => {
  const { toggleBoardModal, setIsNewBoard } = useModal();
  const { data: session } = useSession()

  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/register', router.asPath);
    }
  }, [router]);

  return (
    <HeadOfPage title={HOME} content={WELCOME_MSG}>
      <>
        <BoardModal user_id={user_id} />
        <main>
          <Sidebar boards={boards} assignedBoards={assignedBoards} user={user}/>
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

    await connectMongo();

    let user = await getUserByEmail(String(session?.user?.email))
    let ownedBoards = await getOwnedBoardsByUser(String(user._id))
    let assignedBoards = await getAsignedBoardsByUser(String(user._id))

    ownedBoards = JSON.parse(JSON.stringify(ownedBoards));
    assignedBoards = JSON.parse(JSON.stringify(assignedBoards));
    user = JSON.parse(JSON.stringify(user));

    return {
      props: {
        boards: ownedBoards,
        assignedBoards: assignedBoards,
        session: JSON.parse(JSON.stringify(session)),
        user_id: user._id,
        user: user,
      },
    };
  }
  
  return {
    props: {
      boards: [],
      assignedBoards: [],
      session,
      user_id: null,
      user: null,
    },
  };

 
};

export default Home;
