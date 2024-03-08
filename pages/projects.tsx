import type { NextPage } from 'next';

import { GetServerSideProps } from 'next';


import HeadOfPage from '@/components/shared/HeadOfPage';

import {  SEARCH_CONTENT, SEARCH_TITLE } from '@/components/constants';
import Sidebar from '@/components/sidebar/Sidebar';
import Navbar from '@/components/navbar/Navbar';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { auth } from '@/services/auth';
import connectMongo from '@/services/connectMongo';
import { getUserByEmail } from '@/services/user';
import { IBoard, IUser } from '@/typing';
import { getAsignedBoardsByUser, getOwnedBoardsByUser } from '@/services/board';
import ProjectForm from '@/components/shared/ProjectForm';
import ProjectList from '@/components/shared/ProjectList';

const Projects: NextPage<{ boards: IBoard[], assignedBoards: IBoard[], user_id:string, user:IUser }> = ({ boards = [], assignedBoards =[], user_id, user }) => {

  const router = useRouter();
  const { data: session } = useSession()

  useEffect(() => {
      if (!session) {
        router.push('/register', router.asPath);
      }
  }, [router]);

 
  return (
    <HeadOfPage title={SEARCH_TITLE} content={SEARCH_CONTENT}>
      <>
        <main>
          <Sidebar boards={boards} assignedBoards={assignedBoards} user={user}/>
          <div>
            <Navbar boards={boards} title='Proyectos'/>
            <ProjectForm />
            <ProjectList />
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

export default Projects;
