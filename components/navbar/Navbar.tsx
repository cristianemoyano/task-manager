import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import useModal from '@/contexts/useModal';
import AllBoardsModal from './AllBoardsModal';
import BoardDropdown from './BoardDropdown';
import { IBoard, IUser } from '@/typing';
import KanbanLogo from '../shared/KanbanLogo';
import { HOME, NEW_TASK } from '../constants';
import UserList from '../shared/UserList';
import { fetcher, getBoardAssignees } from '@/services/utils';
import useSWR from 'swr';

interface Props {
  boards: IBoard[];
  board?: IBoard;
  onUserClick?: (user:IUser) => void;
  onClearFilters?: () => void;
  title?: string;
  toggleClosedTasks?: () => void;
}



export default function Navbar({ boards, board, onUserClick, onClearFilters, title, toggleClosedTasks }: Props) {
  const { toggleTaskModal, setTaskModalContent, isSidebarOpen } = useModal();
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isBoardDropdownOpen, setIsBoardDropdownOpen] = useState(false);
  const { pathname } = useRouter();

  const assigneesIds = getBoardAssignees(board);

  const { data: users, error: usersError } = useSWR<IUser[], any>(
    `/api/users/?user_ids=${assigneesIds.join(',')}`,
    fetcher,
    {
      fallbackData: [],
      revalidateOnFocus: false,
    }
  );

  const handleBoardDropdown = (evt:any, value:boolean) => {
    setIsBoardDropdownOpen(value)
  }

  useEffect(function mount() {

    function onMouse() {
      setIsBoardDropdownOpen(false)
    }
    window.addEventListener('mousedown', onMouse, false);

    return function unMount() {
      window.removeEventListener('mousedown', onMouse, false);
    };
  });


  return (
    <>
      <nav className='navbar'>
        <div
          className={
            isSidebarOpen
              ? 'navbar__wrapper'
              : 'navbar__wrapper navbar__wrapper--full'
          }
        >
          <div className='navbar__container'>
            <div
              className={isSidebarOpen ? 'navbar__logo--hide' : 'navbar__logo'}
            >
              <KanbanLogo />
            </div>
            <div
              className='navbar__dropdown'
              onClick={(evt) => handleBoardDropdown(evt, !isBoardModalOpen)}
            >
              <h2 className='navbar__dropdown__title'>
              {pathname === '/' ? HOME : pathname.includes("board") ? board?.name : title}
              </h2>
              {isBoardModalOpen ? (
                <Image
                  src='/assets/icon-chevron-up.svg'
                  width={10}
                  height={7}
                  layout='fixed'
                  alt='chevron-up'
                />
              ) : (
                <Image
                  src='/assets/icon-chevron-down.svg'
                  width={10}
                  height={7}
                  layout='fixed'
                  alt='chevron-down'
                />
              )}
            </div>

            <div className="grid grid-rows-2 grid-flow-col gap-1">
              {/* TITLE*/}
              <div>
                <h2 className='navbar__title'>
                  {pathname === '/' ? HOME : pathname.includes("board") ? board?.name : title}
                </h2>
              </div>
              {/* USERS FILTER */}
              <div className=''>
              {pathname.includes("board") ? <UserList users={users} onUserClick={onUserClick} onClearFilters={onClearFilters} /> : ""}
                
              </div>
            </div>

          </div>
          <div className='navbar__container'>
            {board && (
              <>
                <button
                  className='navbar__add__button'
                  onClick={() => {
                    toggleTaskModal();
                    setTaskModalContent({ isNew: true, task: {} });
                  }}
                  disabled={!board.columns.length}
                >
                  <div className='navbar__add__icon'>
                    <Image
                      src='/assets/icon-add-task-mobile.svg'
                      width={12}
                      height={12}
                      layout='fixed'
                      alt='chevron-down'
                    />
                  </div>
                  <h3 className='navbar__add__text'>+ {NEW_TASK}</h3>
                </button>
                <button
                  className='dropdown__buton'
                  onClick={(evt) => handleBoardDropdown(evt, !isBoardDropdownOpen)}
                >
                  <Image
                    src='/assets/icon-vertical-ellipsis.svg'
                    width={5}
                    height={20}
                    layout='fixed'
                    alt='vertical-ellipsis'
                    className='dropdown__button__icon'
                  />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <AllBoardsModal
        isVisible={isBoardModalOpen}
        close={() => setIsBoardModalOpen(false)}
        boards={boards}
      />
      {board && (
        <BoardDropdown
          isVisible={isBoardDropdownOpen}
          close={(evt) => handleBoardDropdown(evt, false)}
          board={board}
          toggleClosedTasks={toggleClosedTasks}
        />
      )}
    </>
  );
}
