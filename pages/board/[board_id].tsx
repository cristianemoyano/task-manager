import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import ScrollContainer from 'react-indiana-drag-scroll';
import { isEmpty } from 'lodash';

import { IBoard } from '@/typing';
import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import useModal from '@/contexts/useModal';

import HeadOfPage from '@/components/shared/HeadOfPage';
import Navbar from '@/components/navbar/Navbar';
import BoardModal from '@/components/modals/BoardModal';
import TaskModal from '@/components/modals/TaskModal';
import DeleteModal from '@/components/modals/DeleteModal';
import TaskInfosModal from '@/components/modals/TaskInfosModal';
import BoardColumn from '@/components/single_board/BoardColumn';
import EmptyState from '@/components/shared/EmptyState';
import NewItem from '@/components/shared/NewItem';
import Sidebar from '@/components/sidebar/Sidebar';

interface Props {
  isrBoards: IBoard[];
  isrBoard: IBoard;
  board_id: string;
  user_id: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const SingleBoard: NextPage<Props> = ({
  isrBoards,
  isrBoard,
  board_id,
  user_id,
}) => {
  const { data: boards, error: boardsError } = useSWR<IBoard[], any>(
    `/api/boards?user_id=${user_id}`,
    fetcher,
    {
      fallbackData: isrBoards,
      revalidateOnFocus: false,
    }
  );

  const { data: board, error: boardError } = useSWR<IBoard, any>(
    `/api/boards/${board_id}?user_id=${user_id}`,
    fetcher,
    {
      fallbackData: isrBoard,
      revalidateOnFocus: false,
    }
  );

  const { setIsNewBoard, toggleBoardModal } = useModal();
  const router = useRouter();

  if (boardsError || boardError || !boards || !board)
    return (
      <HeadOfPage title='Board Error' content='No Board'>
        <EmptyState
          title='We did not foun any board, maybe you are trying to access someone else board or one that does not exist.'
          button='Go back home'
          handleClick={() => router.push('/')}
        />
      </HeadOfPage>
    );

  return (
    <HeadOfPage title='Board' content='Your Board'>
      <>
        <BoardModal board={board} />
        <TaskModal board={board} />
        <DeleteModal board={board} />
        <TaskInfosModal board={board} />
        <main>
          <Sidebar boards={boards} />
          <div className='board__main'>
            <Navbar boards={boards} board={board} />
            {board.columns.length ? (
              <ScrollContainer className='board__main__container'>
                {board.columns.map((column) => (
                  <BoardColumn key={column._id} column={column} />
                ))}
                <NewItem
                  isColumn={true}
                  onClick={() => {
                    setIsNewBoard(false);
                    toggleBoardModal();
                  }}
                />
              </ScrollContainer>
            ) : (
              <EmptyState
                title='This board is empty. Create a new column to get started.'
                button='+ Add New Column'
                handleClick={() => {
                  setIsNewBoard(false);
                  toggleBoardModal();
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
      redirect: {
        permanent: false,
        destination: '/register',
      },
    };
  }

  const board_id = context.query.board_id;

  await connectMongo();

  if (board_id?.length !== 24) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  let board = await Board.findOne({ _id: board_id, user_id: session.id });
  board = JSON.parse(JSON.stringify(board));

  let boards = await Board.find({ user_id: session.id }).select(['-columns']);
  boards = JSON.parse(JSON.stringify(boards));

  return {
    props: {
      isrBoards: boards,
      isrBoard: board,
      board_id,
      user_id: session?.id,
    },
  };
};

export default SingleBoard;
