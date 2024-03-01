import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
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
import { BACK_HOME, BOARD_ERROR_CONTENT, BOARD_ERROR_MSG, BOARD_ERROR_TITLE, NEW_COLUMN } from '@/components/constants';
import { fetcher, filterTasksByAssignee } from '@/services/utils';
import { getAsignedBoardsByUser } from '@/services/board';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

import {produce} from "immer";
import { getUsers } from '@/services/user';

interface Props {
  isrBoards: IBoard[];
  isrBoard: IBoard;
  board_id: string;
  assignedBoards: IBoard[];
  user_id: string;
  user: IUser;
  users: IUser[];
}



const SingleBoard: NextPage<Props> = ({
  isrBoards,
  isrBoard,
  board_id,
  assignedBoards,
  user_id,
  user,
  users,
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

  const [filteredBoard, filterBoard] = useState<IBoard|undefined>(undefined);

  useEffect(() => {
    const nextBoardState = produce(board, draftBoard => {
      draftBoard = draftBoard
    })
    filterBoard(nextBoardState)
  }, [board]);

  const onUserClick = (user:IUser) => {
    if (isEmpty(board)) {
      return
    }

    const nextBoardState = produce(board, draftBoard => {
      draftBoard = filterTasksByAssignee(draftBoard, user._id)
    })
    filterBoard(nextBoardState)
  }

  const onClearFilters = () => {
    const nextBoardState = produce(board, draftBoard => {
      draftBoard = draftBoard
    })
    filterBoard(nextBoardState)
  }

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
        <TaskModal board={board} user_id={user_id} users={users}/>
        <DeleteModal board={board} user_id={user_id}/>
        <TaskInfosModal board={board} user_id={user_id} user={user} users={users}/>
        <main>
          <Sidebar boards={boards} assignedBoards={assignedBoards} user={user}/>
          <div className='board__main'>
            <Navbar boards={boards} board={board} onUserClick={onUserClick} onClearFilters={onClearFilters}/>
            {board?.columns.length ? (
              <ScrollContainer className='board__main__container'>
                {filteredBoard?.columns.map((column) => (
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

    let allUsers = await getUsers()

    let board = await Board.findOne({ _id: board_id, user_id: user._id });
    board = JSON.parse(JSON.stringify(board));

    let boards = await Board.find({ user_id: user._id }).select(['-columns']);
    boards = JSON.parse(JSON.stringify(boards));

    let assignedBoards = await getAsignedBoardsByUser(String(user._id))
    assignedBoards = JSON.parse(JSON.stringify(assignedBoards));

    user = JSON.parse(JSON.stringify(user));
    allUsers = JSON.parse(JSON.stringify(allUsers));

    return {
      props: {
        isrBoards: boards,
        isrBoard: board,
        assignedBoards: assignedBoards,
        board_id,
        user_id: user._id,
        user: user,
        users: allUsers,
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
      users: null,
    },
  };


};

export default SingleBoard;
