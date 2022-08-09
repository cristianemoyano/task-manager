import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import useModal from '@/contexts/useModal';
import AllBoardsModal from './AllBoardsModal';
import BoardDropdown from './BoardDropdown';
import { IBoard } from '@/typing';

interface Props {
  boards: IBoard[];
  board?: IBoard;
}

export default function Navbar({ boards, board }: Props) {
  const { toggleTaskModal, setTaskModalContent } = useModal();
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isBoardDropdownOpen, setIsBoardDropdownOpen] = useState(false);
  const { pathname } = useRouter();

  return (
    <>
      <nav className='navbar'>
        <div className='navbar__container'>
          <Link href='/' passHref>
            <a>
              <Image
                src='/assets/logo-mobile.svg'
                width={24}
                height={25}
                layout='fixed'
                alt='company-logo'
              />
            </a>
          </Link>
          <div
            className='navbar__dropdown'
            onClick={() => setIsBoardModalOpen(!isBoardModalOpen)}
          >
            <h2 className='navbar__dropdown__title'>
              {pathname === '/' ? 'Choose your board' : board!.name}
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
        </div>
        {board && (
          <div className='navbar__container'>
            <button
              className='navbar__add__button'
              onClick={() => {
                toggleTaskModal();
                setTaskModalContent({ isNew: true, task: {} });
              }}
              disabled={!board.columns.length}
            >
              <Image
                src='/assets/icon-add-task-mobile.svg'
                width={12}
                height={12}
                layout='fixed'
                alt='chevron-down'
                className='navbar__add__icon'
              />
              <h3 className='navbar__add__text'>+ Add New Task</h3>
            </button>
            <button
              className='dropdown__buton'
              onClick={() => setIsBoardDropdownOpen(!isBoardDropdownOpen)}
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
          </div>
        )}
      </nav>
      <AllBoardsModal
        isVisible={isBoardModalOpen}
        close={() => setIsBoardModalOpen(false)}
        boards={boards}
      />
      {board && (
        <BoardDropdown
          isVisible={isBoardDropdownOpen}
          close={() => setIsBoardDropdownOpen(false)}
          board={board}
        />
      )}
    </>
  );
}
