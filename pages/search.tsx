import type { NextPage } from 'next';

import { GetServerSideProps } from 'next';


import HeadOfPage from '@/components/shared/HeadOfPage';

import {  SEARCH_CONTENT, SEARCH_TITLE } from '@/components/constants';
import BoardModal from '@/components/modals/BoardModal';
import Sidebar from '@/components/sidebar/Sidebar';
import Navbar from '@/components/navbar/Navbar';
import SearchForm from '@/components/shared/Search';


const Search: NextPage<{ }> = ({  }) => {
 
  return (
    <HeadOfPage title={SEARCH_TITLE} content={SEARCH_CONTENT}>
      <>
        <BoardModal user_id={""} />
        <main>
          <Sidebar boards={[]} assignedBoards={[]} user={undefined}/>
          <div>
            <Navbar boards={[]} />
            <SearchForm
              />
          </div>
        </main>
      </>
    </HeadOfPage>

    
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {

  
  return {
    props: {
    },
  };

 
};

export default Search;
