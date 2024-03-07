import type { NextPage } from 'next';

import { GetServerSideProps } from 'next';


import HeadOfPage from '@/components/shared/HeadOfPage';

import {  SEARCH_CONTENT, SEARCH_TITLE } from '@/components/constants';
import BoardModal from '@/components/modals/BoardModal';
import Sidebar from '@/components/sidebar/Sidebar';
import Navbar from '@/components/navbar/Navbar';
import SearchForm from '@/components/shared/Search';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { auth } from '@/services/auth';
import connectMongo from '@/services/connectMongo';
import { getUserByEmail } from '@/services/user';
import { IUser } from '@/typing';

const Search: NextPage<{ user_id:string, user:IUser }> = ({ user_id, user }) => {

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
        <BoardModal user_id={user_id} />
        <main>
          <Sidebar boards={[]} assignedBoards={[]} user={user}/>
          <div>
            <Navbar boards={[]} title='Buscar tareas'/>
            <SearchForm user={user}
              />
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
    user = JSON.parse(JSON.stringify(user));

    return {
      props: {
        user_id: user._id,
        user: user,
      },
    };
  }
  
  return {
    props: {
      user_id: null,
      user: null,
    },
  };

 
};

export default Search;
