import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import ScrollContainer from 'react-indiana-drag-scroll';

import { IBoard, IUser } from '@/typing';
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
import { auth } from '@/services/auth';
import User from '@/models/userModel';
import { BACK_HOME, BOARD, BOARD_ERROR_CONTENT, BOARD_ERROR_MSG, BOARD_ERROR_TITLE, NEW_COLUMN } from '@/components/constants';
import { fetcher } from '@/services/utils';
import { getAsignedBoardsByUser } from '@/services/board';

interface Props {
  isrBoards: IBoard[];
  isrBoard: IBoard;
  board_id: string;
  assignedBoards: IBoard[];
  user_id: string;
  user: IUser;
}



const SingleBoard: NextPage<Props> = ({
  isrBoards,
  isrBoard,
  board_id,
  assignedBoards,
  user_id,
  user,
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
      <HeadOfPage title={BOARD_ERROR_TITLE} content={BOARD_ERROR_CONTENT}>
        <EmptyState
          title={BOARD_ERROR_MSG}
          button={BACK_HOME}
          handleClick={() => router.push('/')}
        />
      </HeadOfPage>
    );

  return (
    <HeadOfPage title={board.name} content={board.name}>
      <>
        <BoardModal board={board} user_id={user_id}/>
        <TaskModal board={board} user_id={user_id}/>
        <DeleteModal board={board} user_id={user_id}/>
        <TaskInfosModal board={board} user_id={user_id}/>
        <main>
          <Sidebar boards={boards} assignedBoards={assignedBoards} user={user}/>
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
                button={`+ ${NEW_COLUMN}`}
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
  const session = await auth(
    context.req,
    context.res,
  )

  if (session?.user) {

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

    let user = await User.findOne({ email: session?.user?.email })

    let board = await Board.findOne({ _id: board_id, user_id: user._id });
    board = JSON.parse(JSON.stringify(board));

    let boards = await Board.find({ user_id: user._id }).select(['-columns']);
    boards = JSON.parse(JSON.stringify(boards));

    let assignedBoards = await getAsignedBoardsByUser(String(user._id))
    assignedBoards = JSON.parse(JSON.stringify(assignedBoards));

    user = JSON.parse(JSON.stringify(user));

    return {
      props: {
        isrBoards: boards,
        isrBoard: board,
        assignedBoards: assignedBoards,
        board_id,
        user_id: user._id,
        user: user,
      },
    };


  }

  return {
    props: {
      isrBoards: [],
      isrBoard: null,
      board_id: null,
      user_id: null,
      user: null,
    },
  };


};

export default SingleBoard;
